import assert from "assert"
import {EventEmitter} from "events"
import ApplicationSettings from '../ApplicationSettings'
import PriceFeed from '../PriceFeed'
import Wallet from '../Wallet'
import safeEventHandlerShim from '../Wallet/safeEventHandler'
import Torrent from '../Torrent'
import DeepInitialState from '../Torrent/Statemachine/DeepInitialState'
import mkdirp from 'mkdirp'
import WalletTopUpOptions from "./WalletTopUpOptions"
import fs from 'fs'
import path from 'path'
import bcoin from 'bcoin'
import { TorrentInfo, Session } from 'joystream-node'
import db from '../../db'
import request from 'request'
import magnet from 'magnet-uri'
import StreamServer from '../StreamServer/StreamServer'
import {computeOptimumPricePerPiece} from '../../common/'
import semver from 'semver'

var debug = require('debug')('application')
import {shell} from 'electron'

const APPLICATION_VERSION = require('../../../package.json').version

const FOLDER_NAME = {
  WALLETS: 'wallets',
  DEFAULT_SAVE_PATH_BASE: 'download',
  TORRENT_DB: 'data'
}

/**
 * How long(in ms) between each poll the joystream-node session for
 * torrent plugin status updates.
 * @type {number}
 */
const POST_TORRENT_UPDATES_INTERVAL = 3000

/**
 * How long (in ms) between each time the pricefeed is polled
 * for the new crypto exchange rate
 * @type {number}
 */
const PRICE_FEED_POLLING_INTERVAL = 60*1000 //

/**
 * Default settings to use for the application settings
 */
const DEFAULT_APPLICATION_SETTINGS = {

  useAssistedPeerDiscovery : true,

  /*
    Binding to port 0 will make the operating system pick the port.
    Libtorrent will attempt to open both a UDP and a TCP listen socket, to allow accepting
    uTP connections as well as TCP. If using the DHT, this will also make the DHT use the same UDP ports.
    See https://www.libtorrent.org/reference-Settings.html#settings-pack outgoing_interfaces/incoming_interfaces for details
    We are picking a fixed default port to make it easier to do manual port mapping.
  */
  bittorrentPort : 7881,

  makeDefaultSavePathFromBaseFolder : (baseFolder) => {
    return path.join(baseFolder, FOLDER_NAME.DEFAULT_SAVE_PATH_BASE)
  },

  buyerTerms : {
    maxPrice: 2,
    maxLock: 20,
    minNumberOfSellers: 1,
    maxContractFeePerKb: 1024
  },

  sellerTerms : {
    minPrice: 2,
    minLock: 10,
    maxNumberOfSellers: 5,
    minContractFeePerKb: 1024,
    settlementFee: 450
  },

  termsAccepted : false,

  defaultClientPreference: 'not_set', // not_set, ask, dont_ask, force

  claimedFreeBCH : false

}

/**
 * Application
 *
 * emits resourceStarted(<Application.RESOURCE>)
 * emits resourceStopped(<Application.RESOURCE>)
 * emits startedResources({Set.<RESOURCES>}) - reports change in set of started resources
 * emits onboardingIsEnabled(enabled {Bool}) - onboarding status was altereds
 * emits state({Application.STATE})
 * emits stopped
 * emits starting
 * emits started
 * emits stopping
 * emits torrentAdded({Torrent})
 * emits torrentRemoved({infoHash})
 */
class Application extends EventEmitter {

  /**
   *
   * NB: An important design decision is that we do not consider
   * the application started until _all_ resources have been started.
   * This is because it becomes much more complicated to stop, it is
   * possible that not all resource have started yet, more over, many
   * resources themselves cannot stop until they have been fully started.
   */
  static STATE = {
    STOPPED : 0,
    STARTING : 1,
    STARTED : 2,
    STOPPING : 3,
  }

  /**
   * {STATE} State of app
   */
  state

  /**
   * Resource types owned by the app
   * RENAME: not resource, loading/ter milestone ?
   */
  static RESOURCE = {

    SETTINGS: 0,
    WALLET: 1,
    JOYSTREAM_NODE_SESSION: 2,
    PRICE_FEED: 3,
    STORED_TORRENTS: 4,
    STREAM_SERVER: 5
  }

  static get NUMBER_OF_RESOURCE_TYPES() { return Object.keys(Application.RESOURCE).length }

  static sessionNetworkFromBcoinNetwork (network) {
    if (network === 'bitcoincash') return 'mainnet_bitcoin_cash'

    throw new Error('unsupported network')
  }

  /**
   * {Set.<RESOURCES>} The resources which are currently started
   */
  startedResources

  /**
   * {Bool} Whether onboarding is enabled
   */
  onboardingIsEnabled

  /**
   * {Array.<String>} List of torrent file paths to use as examples in the onboarding
   */
  onboardingTorrents

  /**
   * @property {ElectronConfig} Application settings
   */
  applicationSettings

  /**
   * @property {Wallet}
   */
  wallet

  /**
   * @property {PriceFeed}
   */
  priceFeed

  /**
   * {Map<String.Torrent>} Map of torrents currently added
   */
  torrents

  /**
   * {StreamServer} Media Streaming Server
   */
   streamServer

  /**
   * Constructor
   * Creates a stopped app
   *
   * @param onboardingTorrents {Array.<String>} - names of torrents to be added during onboarding.
   * @param onboardingIsEnabled {Bool} - whether to do onboarding flow If it is running for the first time, then there will be onboarding, regardless
   * of the value of this parameter.
   * @param enableOnboardingIfFirstRun {Bool} - regardless of `onboardingIsEnabled`, if this is true, then onboarding will be shown if
   * the app is running for the first time, as according to the application settings.
   * @param faucetRequestIssuer {Func} - function for requesting coins from faucet
   */
  constructor (onboardingTorrents, onboardingIsEnabled, enableOnboardingIfFirstRun, faucetRequestIssuer) {

    super()

    this._setState(Application.STATE.STOPPED)
    this.startedResources = new Set()

    //this._extendedLibtorrentSession = null
    this.onboardingTorrents = onboardingTorrents
    this._setOnboardingIsEnabled(onboardingIsEnabled)
    this.applicationSettings = null
    this.wallet = null
    this.priceFeed = null
    this.torrents = new Map()


    this._enableOnboardingIfFirstRun = enableOnboardingIfFirstRun
    this._faucetRequestIssuer = faucetRequestIssuer
    this._torrentDatabase = null

    // setInterval reference for polling joystream-node session for
    this._torrentUpdateInterval = null
    this._joystreamNodeSession = null
  }

  static walletPath (appDirectory) {
    return path.join(appDirectory, FOLDER_NAME.WALLETS, bcoin.network.primary.type)
  }

  static torrentDatabasePath (appDirectory) {
    return path.join(appDirectory, FOLDER_NAME.TORRENT_DB)
  }

  static createApplicationSettings () {
    return new ApplicationSettings()
  }

  /**
   * Start application
   * Presumes that the application directory ('appDirectory')
   * already exists.
   *
   * @param config
   * @param config.network {String} - Bitcoin network (tesnet|mainnet)
   * @param config.assistedPeerDiscovery {Bool} - enable SecondaryDHT (joystream assisted peer discovery)
   * @param config.bitTorrentPort {Number} - libtorrent listening port (0 means libtorrent picks)
   * @param appDirectory {String} - the application directory, that is where the root
   * folder where the the file/folder tree of the application lives.
   * @param onStarted {Func} - callback called when start attempt is open
   */

  start(config, appDirectory, onStarted = () => {} ) {

    debug('starting')

    // Make sure we can start
    if(this.state !== Application.STATE.STOPPED)
      onStarted('Can only start when stopped')

    this._setState(Application.STATE.STARTING)

    // Hold on to app directory
    this._appDirectory = appDirectory

    /**
     * Wallet
     */

     // // Ensure base wallets directory exists Wallet will take care of this
     // mkdirp.sync(FOLDER_NAME.WALLETS)

    // Make and hold on to path to wallet
    this._walletPath = Application.walletPath(this._appDirectory)

    const spvNodeOptions = {
      prefix: this._walletPath,
      db: 'leveldb',
      network: bcoin.network.primary.type,
      // Disable workers which are not available in electron
      workers: false
    }

    // Add a logger if log level is specified
    if(config.logLevel)
      spvNodeOptions.logger = new bcoin.logger({ level: config.logLevel })

    // Create the SPV Node
    let spvNode = bcoin.spvnode(spvNodeOptions)

    // Create and hold to wallet
    this.wallet = new Wallet(spvNode)

    this.wallet.once('started', () => {

      assert(this.state === Application.STATE.STARTING)

      this._startedResource(Application.RESOURCE.WALLET, onStarted)
    })

    this.wallet.on('totalBalanceChanged', safeEventHandlerShim((balance) => {
        this._totalWalletBalanceChanged(balance)
    }),'core-wallet.totalBalanceChanged')

    // Start wallet
    this.wallet.start()

    /**
     * Price feed
     */

    // Hold on to price feed
    this.priceFeed = new PriceFeed(null, exchangeRateFetcher.bind(null, bcoin.network.primary.type))

    this.priceFeed.on('error', this._onPriceFeedError)

    // Start feed (synchronous)
    this.priceFeed.start(PRICE_FEED_POLLING_INTERVAL)

    this._startedResource(Application.RESOURCE.PRICE_FEED)

    /**
     * Application settings
     */

    // Create application settings
    this.applicationSettings = Application.createApplicationSettings()

    // Open settings (is synchronous), with given default values,
    // these are set on the first run
    this.applicationSettings.open(
      0,
      DEFAULT_APPLICATION_SETTINGS.makeDefaultSavePathFromBaseFolder(appDirectory),
      DEFAULT_APPLICATION_SETTINGS.useAssistedPeerDiscovery,
      DEFAULT_APPLICATION_SETTINGS.bittorrentPort,
      DEFAULT_APPLICATION_SETTINGS.buyerTerms,
      DEFAULT_APPLICATION_SETTINGS.sellerTerms,
      DEFAULT_APPLICATION_SETTINGS.termsAccepted,
      DEFAULT_APPLICATION_SETTINGS.defaultClientPreference,
      DEFAULT_APPLICATION_SETTINGS.claimedFreeBCH
      )

    this._startedResource(Application.RESOURCE.SETTINGS, onStarted)

    // Make sure some download folder actually exists, which
    // may not be the case on the first run
    let downloadFolder = this.applicationSettings.downloadFolder()

    mkdirp(downloadFolder, null, (err) => {

      if(err)
        debug('Failed to create download folder: ' + downloadFolder + ' due to ' + err)

    })

    // If onboarding is not enabled, and it is the first session, and
    // it was requested by the user to have onboarding on the first session
    // none the less, then enable onboarding
    if(!this.onboardingIsEnabled &&
      this._enableOnboardingIfFirstRun &&
      !this.applicationSettings.numberOfPriorSessions())
      this._setOnboardingIsEnabled(true)

    /**
     * Create Joystream node session
     */

    // Construct default session settings
    var sessionSettings = {
      libtorrent_settings: {
        // network interface libtorrent session will open a listening socket on
        listen_interfaces: '0.0.0.0:' + this.applicationSettings.bittorrentPort(),
        enable_upnp: true,
        enable_natpmp: true,
        enable_dht: true,
        allow_multiple_connections_per_ip: false,
        peer_fingerprint: {
          name: 'JS',
          major: semver.major(APPLICATION_VERSION),
          minor: semver.minor(APPLICATION_VERSION),
          revision: semver.patch(APPLICATION_VERSION),
          tag: 0
        },
        user_agent: 'JoyStream ' + APPLICATION_VERSION
      },

      // Assisted Peer Discovery (APD)
      assistedPeerDiscovery: this.applicationSettings.useAssistedPeerDiscovery(),

      // bitcoin network configuration for payment channels
      network: Application.sessionNetworkFromBcoinNetwork(bcoin.network.primary.type)
    }

    // Create & start session
    // We assume that the session has already started after this call
    this._joystreamNodeSession = new Session(sessionSettings)

    // Setup polling of torrent plugin statuses
    this._torrentUpdateInterval = setInterval(() => {

      // Not possible since we cancel timer before stopping
      assert(this.state !== Application.STATE.STOPPED)

      this._joystreamNodeSession.postTorrentUpdates()

    }, POST_TORRENT_UPDATES_INTERVAL)

    // NB: this is the last synchronous step, so we must pass `onStarted` here,
    // in case all asynchronous loading of resources is already done.
    this._startedResource(Application.RESOURCE.JOYSTREAM_NODE_SESSION, onStarted)

    /**
     * Load settings, add and start torrents
     */

    // Torrent database folder
    const torrentDatabaseFolder = Application.torrentDatabasePath(this._appDirectory)

    db.open(torrentDatabaseFolder)
      .then((torrentDatabase) => {
        this._startedResource(Application.RESOURCE.STORED_TORRENTS, onStarted)

        this._torrentDatabase = torrentDatabase

        // Should we skip loading any existing torrents
        if(config.skipLoadingExistingTorrents)
          return []
        else // (async) loading of all torrent entries
          return this._torrentDatabase.getAll('torrents')

      })
      .then((savedTorrents) => {

          // Add all saved torrents to session with saved settings
          savedTorrents.forEach((savedTorrent) => {

            // Need to convert data from db into a torrentInfo
            // NB: https://github.com/JoyStream/joystream-desktop/issues/668
            if (savedTorrent.metadata) {
              savedTorrent.metadata = new TorrentInfo(Buffer.from(savedTorrent.metadata, 'base64'))
            }

            if (savedTorrent.resumeData) {
              savedTorrent.resumeData = Buffer.from(savedTorrent.resumeData, 'base64')
            }

            // add to session
            this._addTorrent(savedTorrent, (err, torrent) => {

              assert(!err)

            })

        })

    })

    // const streamServerHost = this.applicationSettings.streamServerHost()
    // const streamServerPort = this.applicationSettings.streamServerPort()
    // we can use port 0 (just listen on a random port)

    this.streamServer = new StreamServer(this.torrents, /*{host, port}*/)

    this.streamServer.on('started', () => {
        this._startedResource(Application.RESOURCE.STREAM_SERVER, onStarted)
    })

    this.streamServer.on('error', (err) => {
      debug('StreamServer Error:', err)
    })

    this.streamServer.start()
  }

  getTorrentStreamUrl (infoHash, fileIndex) {
    return this.streamServer.getStreamUrl(infoHash, fileIndex)
  }

  /**
   * Stops app
   *
   * @param onStop {Func} - called with result of stop attempt
   */
  stop(onStopped = () => {}) {

    if(this.state !== Application.STATE.STARTED)
      onStopped('Can only stop when started')

    this._setState(Application.STATE.STOPPING)

    /**
     * Terminate and remove torrents, and store settings
     * NB: This is not being done as well as it should, with
     * weird hooking into a public signal, but we can't invest
     * more time in this now, see here for proper redo.
     * https://github.com/JoyStream/joystream-desktop/issues/714
     */

    if(this.torrents.size === 0)
      onAllTorrentsGone.bind(this)()
    else {
      // Add terminated handler for each torrent
      this.torrents.forEach((torrent, infoHash) => {

        // If torrent is already stopping, then we
        if(torrent.isTerminating()) {

          // then we just ignore it,
          debug('Ignoring initiating termination of this torrent, because its already being terminated: ' + torrent.name)

          /**
           * and when its actually removed, we detect this through the
           * public interface. The reason we use the public interface,
           * rather than the `Terminated` event from the torrent itself,
           * is that we don't want to compete with the termination processing
           * we are doing in `Application.removeTorrent`
           */
          this.on('torrentRemoved', (infoHashOfRemovedTorrent) => {

            if(infoHashOfRemovedTorrent === infoHash)
              onTorrentTerminated.bind(this)()
          })

        } else {

          let encodedTorrentSettings

          torrent.once('Terminated', () => {

            assert(this.state === Application.STATE.STOPPING)

            /**
             * Remove the torrent from the session
             *
             * Notice that we take it for granted that this will work, and
             * we don't need to wait for some resource to come back, like in the
             * addTorrent scenario
             */
            this._joystreamNodeSession.removeTorrent(infoHash, (err) => {

              assert(!err)

            })

            assert(encodedTorrentSettings)

            this._torrentDatabase.save('torrents', infoHash, encodedTorrentSettings)
              .then(() => {
                debug('Torrent stored in database: ' + torrent.name)
              })
              .catch((err) => {
                debug('Failed to store torrent in database: ', encodedTorrentSettings)
              })
              .finally(() => {

                // remove from map
                this.torrents.delete(infoHash)

                onTorrentTerminated.bind(this)()

              })

          })

          // Does it make sense to encode settings of a loading torrent?
          encodedTorrentSettings = encodeTorrentSettings(torrent)

          debug('Initiating termination of torrent: ' + torrent.name)

          torrent._terminate()

        }

      })

    }

    function onTorrentTerminated() {

      // if this was the last one, then we are done
      // terminating torrents!
      if(this.torrents.size === 0)
        onAllTorrentsGone.bind(this)()
    }

    function onAllTorrentsGone() {

      assert(this.torrents.size === 0)

      this._torrentDatabase.close((err) => {

        assert(!err)

        this._stoppedResource(Application.RESOURCE.STORED_TORRENTS, onStopped)
      })

      /**
       * Stop Joystream node session
       */

      this._joystreamNodeSession.pauseLibtorrent((err) => {

        assert(!err)

        // Remove port mapping from router
        this._joystreamNodeSession.applySettings({
          enable_upnp: false,
          enable_natpmp: false
        })

        clearInterval(this._torrentUpdateInterval)

        this._joystreamNodeSession = null
        this._torrentUpdateInterval = null

        // Allow some time for calls to unmap ports to complete
        setTimeout(() => {
          this._stoppedResource(Application.RESOURCE.JOYSTREAM_NODE_SESSION, onStopped)
        }, 1500)

      })

    }

    /**
     * Application settings
     */

    // Count session
    let numberOfPriorSessions = this.applicationSettings.numberOfPriorSessions()

    if(!numberOfPriorSessions || numberOfPriorSessions == 0)
      this.applicationSettings.setNumberOfPriorSessions(1)
    else
      this.applicationSettings.setNumberOfPriorSessions(numberOfPriorSessions + 1)

    this.applicationSettings.close()

    this._stoppedResource(Application.RESOURCE.SETTINGS)

    /**
     * Price feed
     */

    this.priceFeed.stop()

    this._stoppedResource(Application.RESOURCE.PRICE_FEED)

    /**
     * Stop wallet
     */
    this.wallet.once('stopped', () => {

      assert(this.state === Application.STATE.STOPPING)

      this._stoppedResource(Application.RESOURCE.WALLET, onStopped)
    })

    // Check if the wallet is not yet started, if so
    if(this.wallet.state !== Wallet.STATE.STARTED) {

      debug('Delaying stopping wallet until it has actually started.')

      // then it must mean its still starting
      //assert(this.wallet.state === Wallet.STATE.<lots of states here>)

      // and we have to wait until its ready, before we try
      // to stop
      this.wallet.once('started', () => {

        debug('Now we can finally stop wallet.')

        this.wallet.stop()
      })

    } else
      this.wallet.stop()

    this.streamServer.once('stopped', () => {

      assert(this.state === Application.STATE.STOPPING)

      this._stoppedResource(Application.RESOURCE.STREAM_SERVER, onStopped)
    })

    this.streamServer.stop()
  }

  /**
   * `distortPrice` is part of hack security fix in 1.0.3
   */
  defaultBuyerTerms (pieceLength, numPieces, distortPrice = true) {
    let defaultTerms = this.applicationSettings.defaultBuyerTerms()
    const settlementFee = this.applicationSettings.defaultSellerTerms().settlementFee
    let convertedTerms = {...defaultTerms}

    // what chunk of the data needs to be delivered before seller will get non dust output
    const alpha = 0.2

    const satoshiPerMb = defaultTerms.maxPrice

    convertedTerms.maxPrice = computeOptimumPricePerPiece(alpha, pieceLength, numPieces, satoshiPerMb, settlementFee, distortPrice)

    return convertedTerms
  }

  defaultSellerTerms(pieceLength, numPieces) {
    let defaultTerms = this.applicationSettings.defaultSellerTerms()
    const settlementFee = defaultTerms.settlementFee
    let convertedTerms = {...defaultTerms}

    // what chunk of the data needs to be delivered before seller will get non dust output
    const alpha = 0.2

    const satoshiPerMb = defaultTerms.minPrice

    convertedTerms.minPrice = computeOptimumPricePerPiece(alpha, pieceLength, numPieces, satoshiPerMb, settlementFee)

    return convertedTerms
  }

  /**
   * Add torrent with given settings
   *
   *
   * @param settings {Object} - document ???
   * @param fun {Func}  - Callback, returns {@link Torrent} on success, error string otherwise
   */
  addTorrent(settings, onAdded = () => {}) {

    if (this.state !== Application.STATE.STARTED) {
      onAdded('Can add torrent when started')
      return
    }

    this._addTorrent(settings, onAdded)
  }

  /**
   * Add torrent with given settings
   *
   *
   * @param settings {Object} - document ???
   * @param fun {Func}  - Callback, returns {@link Torrent} on success, error string otherwise
   */
  _addTorrent(settings, onAdded = () => {}) {

    /**
     * There is a lot of weird copying and decoding going on here
     * which I don't want to break, but which should be fixed,
     * see:
     */

    const infoHash = settings.infoHash

    if (this.torrents.has(infoHash)) {
      onAdded('Torrent already added')
      return
    }

    // settings.metadata has to be a TorrentInfo object
    if (settings.metadata && !settings.metadata instanceof TorrentInfo) {
      onAdded('Invalid metadata passed, must be TorrentInfo instance')
      return
    }

    // Validate magnet link is correctly encoded ?
    if (settings.url) {
      // onAdded('Invalid magnet link url')
    }

    // Create parameters for adding to session
    let params = {
      name: settings.name,
      savePath: settings.savePath,
    }

    // Add torrents paramaters should only have one of ti, url or infoHash
    if (settings.url) {
      params.url = settings.url
    } else if (settings.metadata) {
      params.ti = settings.metadata
    } else {
      params.infoHash = infoHash
    }

    // joystream-node decoder doesn't correctly check if resumeData propery is undefined, it only checks
    // if the key on the params object exists so we need to conditionally set it here.
    if (settings.resumeData)
      params.resumeData = settings.resumeData

    // set param flags - auto_managed/paused
    params.flags = {

      // Whether torrent should be added in (libtorrent) paused mode from the get go
      // We always add it in non-paused mode to make sure torrent completes checking files and
      // finish loading in the state machine
      paused: false,

      // Automanagement: We never want this, as our state machine should explicitly control
      // pause/resume behaviour torrents for now.
      //
      // Whether libtorrent is responsible for determining whether it should be started or queued.
      // Queuing is a mechanism to automatically pause and resume torrents based on certain criteria.
      // The criteria depends on the overall state the torrent is in (checking, downloading or seeding).
      auto_managed: false,

      // make sure our settings override resume data (paused and auto managed flags)
      override_resume_data: true
    }

    // Try to add torrent to session
    this._joystreamNodeSession.addTorrent(params, (err, newJoystreamNodeTorrent) => {

      if(err)
        onAdded(err)
      else {

        if (this.state === Application.STATE.STOPPING || this.state === Application.STATE.STOPPED) {
          return onAdded('application is shutting down')
        }

        // Process being added to session
        let torrent = this._onTorrentAddedToSession(settings, newJoystreamNodeTorrent)

        // and finally tell user
        onAdded(null, torrent)

      }

    })

  }

  _onTorrentAddedToSession(settings, joystreamNodeTorrent) {

    const infoHash = settings.infoHash

    // Create new torrent
    let torrent = new Torrent(
      settings,

      //privateKeyGenerator
      () => {
        return bcoin.secp256k1.generatePrivateKey()
      },

      //publicKeyHashGenerator
      () => {

        assert(this.wallet.state === Wallet.STATE.STARTED)

        return this.wallet.receiveAddress.getHash()
      },

      //contractGenerator
      (contractOutputs, contractFeeRate) => {

        assert(this.wallet.state === Wallet.STATE.STARTED)

        let outputs = []

        for (let i in contractOutputs) {
          outputs.push(bcoin.output.fromRaw(contractOutputs[i]))
        }

        const note = 'Contract to buy: ' + torrent.name

        return this.wallet.createAndSendPaidDownloadingContract(outputs, contractFeeRate, note)
          .then((transaction) => {
             debug('Contract TX:', transaction.toRaw().toString('hex'))
             debug('Contract TX ID:', transaction.txid())
            return transaction.toRaw()
          })
      },

      // broadcastRawTransaction
      (tx) => {

        assert(this.wallet.state === Wallet.STATE.STARTED)

        this.wallet.broadcast(tx)
      }
    )

    // When torrent is missing buyer terms
    torrent.on('Loading.WaitingForMissingBuyerTerms', (data) => {

      // NB: Replace by querying application settings later!
      let terms = this.defaultBuyerTerms(torrent.torrentInfo.pieceLength(), torrent.torrentInfo.numPieces())

      // change name
      torrent.provideMissingBuyerTerms(terms)

    })

    joystreamNodeTorrent.on('dhtGetPeersReply', (peers) => {

      if(this.state !== Application.STATE.STARTED)
        return

      // a call to connect_peer will throw if torrent is "uninitialized or in queued or checking mode"
      if(torrent.isTerminating() || torrent.state.startsWith('Loading'))
        return

      //debug('discovered joystream peers. Adding ', peers.length, ' peers to peer list')

      // Note: A call to connectPeer only adds the endpoint to the list of peers libtorrent
      // will attempt to connect to. The priority of which peers from the set to connect to
      // and in which order is hard coded.
      for (let i in peers) {
        joystreamNodeTorrent.connectPeer(peers[i])
      }

    })

    // Add to torrents map

    // where it obviously should not already be
    assert(!this.torrents.has(infoHash))

    this.torrents.set(infoHash, torrent)

    // Tell torrent about result
    torrent._addedToSession(joystreamNodeTorrent)

    // Emit signal
    this.emit('torrentAdded', torrent)

    return torrent
  }

  /**
   * Remove torrent identified by given hash.
   *
   * @param infoHash {String} - torrent hash identifier
   * @param deleteData {Bool} - whether to delete real data
   * @param onRemoved {Function} - callback
   */
  removeTorrent(infoHash, deleteData, onRemoved) {

    if(this.state !== Application.STATE.STARTED) {
      onRemoved('Can only remove torrent when started')
      return
    }

    let torrent = this.torrents.get(infoHash)

    if(!torrent) {
      onRemoved('No torrent added corresponding to given hash')
      return
    }

    // Make sure torrent is not in the process or being
    // added or removed
    if(!torrent.state.startsWith('Active')) {
      onRemoved('Can only remove torrent when its active, not while its being added or removed.')
      return
    }

    torrent.once('Terminated', () => {

      /**
       * Remove the torrent from the session
       *
       * Notice that we take it for granted that this will work, and
       * we don't need to wait for some resource to come back, like in the
       * addTorrent scenario
       */
      this._joystreamNodeSession.removeTorrent(infoHash, (err) => {

        assert(!err)

      })

      // Remove the torrent from the db
      this._torrentDatabase.remove('torrents', infoHash)
        .then(() => {})
        .catch(() => {  debug('Removing torrent from database failed.')})

      // Delete torrent from the this map,
      this.torrents.delete(infoHash)

      // If deleteData we want to remove the folder/file
      if (deleteData) {
        let fullPath = path.join(torrent.savePath, torrent.name, path.sep)
        shell.moveItemToTrash(fullPath)
      }

      // Emit event
      this.emit('torrentRemoved', infoHash)

      // Tell user about success
      onRemoved(null, true)

    })

    // Stop torrent
    torrent._terminate()

  }

  _startedResource = (resource, onStarted) => {

    assert(this.state === Application.STATE.STARTING)
    assert(!this.startedResources.has(resource))

    // add to set of started resources
    this.startedResources.add(resource)

    // tell the world
    this.emit('resourceStarted', resource)
    this.emit('startedResources', this.startedResources)

    // If all resources have started, then we are done!
    if(this.startedResources.size === Application.NUMBER_OF_RESOURCE_TYPES) {

      this._setState(Application.STATE.STARTED)

      // Make callback to user
      onStarted(null, true)
    }
  }

  _stoppedResource = (resource, onStopped) => {

    assert(this.state === Application.STATE.STOPPING)
    assert(this.startedResources.has(resource))

    // remove to set of started resources
    this.startedResources.delete(resource)

    // what about the fact that we never take wallet out?!
    // how can we be symmetric here in that case?

    // tell the world
    this.emit('resourceStopped', resource)
    this.emit('startedResources', this.startedResources)

    // If all resources have stopped, then we are done!
    if(this.startedResources.size === 0) {
      this._setState(Application.STATE.STOPPED)

      // Make user callback
      onStopped(null, true)
    }
  }

  _setState(state) {
    this.state = state
    this.emit('state', state)
    this.emit(stateToString(state))
  }

  _setOnboardingIsEnabled(onboardingIsEnabled) {
    this.onboardingIsEnabled = onboardingIsEnabled
    this.emit('onboardingIsEnabled', onboardingIsEnabled)
  }

  _totalWalletBalanceChanged (balance) {

    debug('new total balance: ' + balance)

  }

  _onPriceFeedError = (err) => {

     debug('priceFeed [error]:')
     debug('Could not fetch exchange rate, likely due to no internet, or broken endpoint.')
     debug(err)
  }

  addExampleTorrents () {
    assert(this.state === Application.STATE.STARTING || this.state === Application.STATE.STARTED )

    this.onboardingTorrents.forEach((torrentFileName) => {

        this._addTorrentByFileName(torrentFileName, (err) => {
          if(err)
            debug('Failed to add example torrent:', torrentFileName, err.message)
        })
    })
  }

  _addTorrentByFileName (torrentFileName, callback) {
    fs.readFile(torrentFileName, (err, data) => {
      if (err) {
        return callback(err)
      }

      let torrentInfo

      try {
        torrentInfo = new TorrentInfo(data)
      } catch (e) {
        return callback(e)
      }

      // Make settings for downloading with default settings
      let settings = {
        infoHash : torrentInfo.infoHash(),
        metadata : torrentInfo,
        resumeData : null,
        name: torrentInfo.name(),
        savePath: this.applicationSettings.downloadFolder(),
        deepInitialState: DeepInitialState.DOWNLOADING.UNPAID.STARTED,
        extensionSettings : {
          buyerTerms: this.defaultBuyerTerms(torrentInfo.pieceLength(), torrentInfo.numPieces())
        }
      }

      this._addTorrent(settings, callback)
    })
  }

  _addTorrentByMagnetLink (magnetUrl, callback) {
    var parsedMagnet = magnet.decode(magnetUrl)

    let settings = {
        infoHash: parsedMagnet.infoHash,
        url: magnetUrl,
        resumeData : null,
        name: parsedMagnet.infoHash,
        savePath: this.applicationSettings.downloadFolder(),
        deepInitialState: DeepInitialState.DOWNLOADING.UNPAID.STARTED,
        extensionSettings : {
          buyerTerms: this.applicationSettings.defaultBuyerTerms()
        }
    }

    this._addTorrent(settings, callback)
  }

  handleOpenExternalTorrent (uri, callback) {

    try {
      // check if uri is a valid magnet link
      let parsedMagnet = magnet.decode(uri)

      if (parsedMagnet && parsedMagnet.infoHash) {
      this._addTorrentByMagnetLink(uri, callback)
      return
    }

    } catch (err) { }

    try {
      // maybe its a path to a torrent file
      if (fs.lstatSync(uri).isFile()) {
      this._addTorrentByFileName(uri, callback)
      return
    }
    } catch (err) { }

      callback('resource not file or magnetlink')

  }

  static CLAIM_FREE_BCH_ERROR = {
    APPLICATION_IN_WRONG_STATE: 0,
    RECEIVE_ADDRESS_NOT_READY: 1,
    WALLET_NOT_STARTED : 2,
    SETTINS_MUST_BE_OPEN : 3,
    ALREADY_CLAIMED: 4,
    FAUCET_ERROR: 5
  }

  /**
   * Claim free BCH
   */
  claimFreeBCH() {

    if(this.state === Application.STATE.STOPPING || this.state === Application.STATE.STOPPED) {
      return
    }

    // Make sure the wallet is started
    if(
      // so it exists
      !this.wallet
      ||
      // and has a a receive address preparedThese are the only states where the receive address is set,
      // and the we are not shutdown, or doing shutdown
      !(
        this.wallet.state === Wallet.STATE.GETTING_BALANCE ||
        this.wallet.state === Wallet.STATE.CONNECTING_TO_NETWORK ||
        this.wallet.state === Wallet.STATE.STARTED
      )
    ) {
      return
    }

    // Request coins to our current receive address
    this._faucetRequestIssuer(this.wallet.receiveAddress)

  }
}

function stateToString(state) {

  let str

  switch(state) {
    case Application.STATE.STOPPED:
      str = 'stopped'
      break

    case Application.STATE.STARTING:
      str = 'starting'
      break

    case Application.STATE.STARTED:
      str = 'started'
      break

    case Application.STATE.STOPPING:
      str = 'stopping'
      break

    default:
      assert(false)
  }

  return str

}

function exchangeRateFetcher(bcoinNetwork) {
  return new Promise(function (resolve, reject) {

    // mapping from bcoin network name to coinmarketcap ticker symbol
    const mapping = {
      'mainnet' : 'bitcoin',
      'testnet' : 'bitcoin',
      'bitcoincash' : 'bitcoin-cash',
      'bitcoincashtestnet' : 'bitcoin-cash'
    }

    const ticker = mapping[bcoinNetwork]

    if (!ticker) {
      return reject('unknown ticker for network ' + bcoinNetwork)
    }

    request('https://api.coinmarketcap.com/v1/ticker/' + ticker, function (err, response, body) {
      if (err) return reject(err)

      const responseStatusCode = response.statusCode

      if (responseStatusCode !== 200) {
        return reject(new Error({
          statusCode: responseStatusCode
        }))
      }

      // Parse the response
      // Parsing error throws an exception which rejects the promise
      const data = JSON.parse(body)

      // We should get back an array with one object for the ticker we requested
      const price = data[0].price_usd

      resolve(parseFloat(price))
    })
  })
}
// TODO: move this to be a method on the Torrent class and introduce a
// corresponding decoder method. These are routines for converting to and from
// an object that can be serialized/deserialized into the torrents database
function encodeTorrentSettings(torrent) {

  let encoded = {
    infoHash: torrent.infoHash,
    name: torrent.name,
    savePath: torrent.savePath,
    deepInitialState: torrent.state.startsWith('Loading') ? torrent._deepInitialState : torrent.deepInitialState(),
    extensionSettings: {
      buyerTerms: torrent.buyerTerms,
      sellerTerms: torrent.sellerTerms
    }
  }

  // Only encode metadata if it is available and valid
  if (torrent.torrentInfo && torrent.torrentInfo.isValid()) {
    encoded.metadata = torrent.torrentInfo.toBencodedEntry().toString('base64')
  }

  // It is possible that resume data generation has failed and resumeData could be null
  if (torrent.resumeData) {
    encoded.resumeData = torrent.resumeData.toString('base64')
  }

  return encoded

}


export default Application
export {
  DEFAULT_APPLICATION_SETTINGS
}
