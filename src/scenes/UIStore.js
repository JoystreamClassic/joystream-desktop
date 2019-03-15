import {observable, action, computed} from 'mobx'
import assert from 'assert'
import {shell, remote} from 'electron'
import opn from 'opn'
var debug = require('debug')('UIStore')

// Core
import Application from '../core/Application'
import ApplicationSettings from '../core/ApplicationSettings'
import Wallet from '../core/Wallet'
import bcoin from 'bcoin'

import * as constants from '../constants'

// Core stores
import {
  ApplicationStore,
  TorrentStore,
  PeerStore,
  WalletStore,
  PriceFeedStore,
  ApplicationSettingsStore
} from '../core-stores'
import {PaymentStore} from '../core-stores/Wallet'

// UI stores
import OnboardingStore from './Onboarding/Stores'
import ApplicationNavigationStore from './Application/Stores'
import DownloadingStore from './Downloading/Stores'
import UploadingStore from './Seeding/Stores'
import CompletedStore from './Completed/Stores'
import WalletSceneStore, { ClaimFreeBCHFlowStore } from './Wallet/Stores'
import Doorbell from './Doorbell'
import MediaPlayerStore from './VideoPlayer/Stores/MediaPlayerStore'

import {computeViabilityOfPaidDownloadingTorrent} from './Common/utils'

//
import {InViable} from './Common/ViabilityOfPaidDownloadingTorrent'
import {NoJoyStreamPeerConnections} from '../core/Torrent/ViabilityOfPaidDownloadingSwarm'

/**
 * Root user interface model
 *
 * Key design rules
 * a) All events coming from the underlying domain model (i.e. core classes),
 * must be handled by a single action which also scopes this object. This single
 * action ensures that _all_ resulting mutations of the MOBX state tree are transactional,
 * avoiding any possible race conditions in how reactions are dispatched, which is
 * very hard to reason about precisely, in particular over time as the source changes.
 * In practice, there are many - in fact most, events which just need to update a single
 * observable, and thus doing a local context specific event trapping and handling would be enough,
 * but for now we will try to just follow this general rule, to avoid the problem on principle.
 *
 * b) All domain stores implement user space calls by relaying to callbacks that we must provide,
 * which just implement calls to th underlying domain objects. The obvious alternative would
 * be to just provide these objects as dependencies to the domain stores, however that supports
 * the temptation to directly hook into events locally, as we are trying to avoid in a)
 *
 * c) Unlike in b, for user interface stores, they will take domain stores as dependencies,
 * and relay user calls onto these domain stores. This is fine, as the risk identified in b)
 * does not exist in this context - since there are no domain events from domain stores, and
 * since user interface stores will want to observe domain store properties anyway.
 *
 */
class UIStore {

  /**
   * Phases for the UI
   *
   * Note: while we could have just used Application.STATE,
   * we really want the freedom to decouple the UI to have its own
   * separate phases, e.g. start showing an active UI scene before
   * the underlying application is fully loaded. However, as is, there
   * is no difference betweene Application.STATE and UIStore.PHASE.
   */
  static PHASE = {

    // Idling between starting and stopping
    Idle: 0,

    // UI is alive and running
    Alive: 1,
  }

  /**
   * {PHASE} Current phase of the UI
   */
  @observable currentPhase

  /**
   * Scenes which are valid when in the
   *
   * {ALIVE_PHASE_SCENE}
   */
  static ALIVE_PHASE_SCENE = {
    Main : 0,
    OnboardingWelcome : 1,
    OnboardingDeparture : 2,
    VideoPlayer : 3,
    Terms : 4
  }

  /**
   * {Boolean} Whether to display the terms scene
   */
  @observable displayTermsScene

  /**
   * {Number} Total number of pieces sold by us as a seller this
   * session
   */
  @observable numberOfPiecesSoldAsSeller

  /**
   * {Number} Total revenue so far from spending, does not include
   * tx fees for closing channel (they are deducted).
   */
  @observable totalRevenueFromPieces

  /**
   * {Number} The total amount (sats) sent as payments so far,
   * does not include tx fees used to open and close channel.
   */
  @observable totalSpendingOnPieces

  /**
   * {ApplicationNavigationStore} Model for application navigator.
   * Is set when `currentPhase` is `PHASE.Alive`.
   */
  applicationNavigationStore

  /**
   * @property {DownloadingStore} Model for downloading scene.
   * Is set when `currentPhase` is `PHASE.Alive`.
   */
  downloadingStore

  /**
   * @property {UploadingStore} Model for uploading scene.
   *
   */
  uploadingStore

  /**
   * @property {CompletedStore} Model for completed scene.
   */
  completedStore

  /**
   * @property {WalletSceneStore} Model for downloading scene.
   */
  walletSceneStore

  /**
   * @property {OnboardingStore} Model for onboarding flow. Is observable
   * so that triggering onboarding start|stop in the UI is reactive.
   */
  @observable onboardingStore

  /**
   * @property {MediaPlayerStore} Model for media player scene. Is observable
   * so that opening and closing of player in UI is reactive.
   */
  @observable mediaPlayerStore

  /**
   * {ApplicatonStore} Mobx store for the application.
   */
  applicationStore

  /**
   * Constructor
   *
   * @param application {Application}
   */
  constructor(application, forceTermsScreen) {

    this.totalRevenueFromPieces = 0
    this.numberOfPiecesSoldAsSeller = 0
    this.totalSpendingOnPieces = 0
    this._forceTermsScreen = forceTermsScreen

    // Hold on to application instance
    this._application = application

    // Create application store
    this.applicationStore = new ApplicationStore({
      state: application.state,
      startedResources: application.startedResources,
      onboardingTorrents: application.onboardingTorrents,
      applicationSettings: application.applicationSettings,

      // We create WalletStore, PriceFeedStore those resource have bee
      // constructed
      walletStore: null,
      priceFeedStore: null,

      // Map store user actions onto underlying application

      starter: application.start.bind(application),
      stopper: application.stop.bind(application),
      torrentAdder: application.addTorrent.bind(application),
      torrentRemover: application.removeTorrent.bind(application)
    })

    // Hook into key application events, and set our observables based
    // on current values

    application.on('state', this._onNewApplicationStateAction)
    this._onNewApplicationStateAction(application.state)

    // NB: We only hook into `resourceStarted` and `resourceStopped`,
    // not `startedResources`, as they are redundant w.r.t. the same canonical
    // state change, and this opens up the possibility of race conditions in updating
    // view, even when using actions.

    application.on('resourceStarted', this._onResourceStartedAction)
    for(const resource of application.startedResources)
      this._onResourceStartedAction(resource)

    application.on('resourceStopped', this._onResourceStoppedAction)

    application.on('onboardingIsEnabled', this._updateOnboardingStatusAction)
    this._updateOnboardingStatusAction(application.onboardingIsEnabled)

    application.on('torrentAdded', this._onTorrentAddedAction)

    // process any currently added torrents
    for(let [infoHash, torrent] in application.torrents)
      this._onTorrentAddedAction(torrent)

    application.on('torrentRemoved', this._onTorrentRemovedAction)
  }

  _onNewApplicationStateAction = action((newState) => {

    this.applicationStore.setState(newState)
    this.setCurrentPhase(appStateToUIStorePhase(newState))

    if(newState === Application.STATE.STARTING) {

      /**
       * Create UI stores that must be available in order to
       * do basic UI of the app, which is possible at the earliest
       * while the application is starting.
       */

      // Application header
      this.applicationNavigationStore = new ApplicationNavigationStore(
        this,
        ApplicationNavigationStore.TAB.Downloading,
        0,
        'USD',
        bcoin.protocol.consensus.COIN
      )

      // Scene specific stores
      this.uploadingStore = new UploadingStore(this)
      this.downloadingStore = new DownloadingStore(this)
      this.completedStore = new CompletedStore(this)

      // add existing torrents to scene stores

      this.applicationStore.torrentStores.forEach((torrentStore, infoHash) => {

        this.uploadingStore.addTorrentStore(torrentStore)
        this.downloadingStore.addTorrentStore(torrentStore)
        this.completedStore.addTorrentStore(torrentStore)

      })

      // Imperatively display doorbell widget
      Doorbell.load()

    } else if(newState === Application.STATE.STARTED) {

      /**
       * Is there really anything to do here any more?
       */

    }
    else if(newState === Application.STATE.STOPPING) {
      // hide doorbell again
      Doorbell.hide()
    }

  })

  _onResourceStartedAction = action((resource) => {

    // Update started resource set
    this.applicationStore.setStartedResources(resource)

    if(resource === Application.RESOURCE.SETTINGS) {

      /**
       * ApplicationSettings
       * Nothing much to do here beyond exposing it, since there is no actual store
       */

      let applicationSettings = this._application.applicationSettings
      assert(applicationSettings)

      // Create store
      let applicationSettingsStore = new ApplicationSettingsStore(
        applicationSettings.state,
        applicationSettings.downloadFolder(),
        applicationSettings.bittorrentPort()
      )

      assert(!this.applicationStore.applicationSettingsStore)
      this.applicationStore.setApplicationSettingsStore(applicationSettingsStore)

      applicationSettings.on('downloadFolder', this._onNewDownloadFolderAction)

      // ** Hook into other events later ** //

      // When terms have not been accepted by the user, then we must
      // display the terms scene
      let termsAccepted = applicationSettings.termsAccepted()

      let displayTermsScene = !termsAccepted || this._forceTermsScreen

      this.setDisplayTermsScene(displayTermsScene)

    } else if(resource === Application.RESOURCE.PRICE_FEED) {

      /**
       * Create and setup price feed store
       */

      let priceFeed = this._application.priceFeed
      assert(priceFeed)

      // Create
      assert(!this.applicationStore.priceFeedStore)
      this.applicationStore.setPriceFeedStore(new PriceFeedStore(priceFeed.cryptoToUsdExchangeRate))

      // Hook into events
      priceFeed.on('tick', action((cryptoToUsdExchangeRate) => {

        this.applicationStore.priceFeedStore.setCryptoToUsdExchangeRate(cryptoToUsdExchangeRate)
      }))

    } else if(resource === Application.RESOURCE.WALLET) {

      /**
       * Create and setup wallet store
       */

      let wallet = this._application.wallet
      assert(wallet)

      // Create walletStore
      assert(!this.applicationStore.walletStore)

      let walletStore = new WalletStore(
        wallet.state,
        wallet.totalBalance,
        wallet.confirmedBalance,
        wallet.receiveAddress,
        wallet.blockTipHeight,
        wallet.synchronizedBlockHeight,
        [],
        wallet.pay.bind(wallet),

        /**
         * HACK due to broken annouce paradigm in application,
         * see https://github.com/JoyStream/joystream-desktop/issues/897
         * Must be fixed
         */

        wallet.state === Wallet.STATE.GETTING_BALANCE ||
        wallet.state === Wallet.STATE.CONNECTING_TO_NETWORK ||
        wallet.state === Wallet.STATE.STARTED
        ?
          wallet.getMasterKey()
        :
          null
      )

      this.applicationStore.setWalletStore(walletStore)

      // Hook into events
      wallet.on('state', this._onWalletStateChanged)
      wallet.on('totalBalanceChanged', this._onWalletTotalBalanceChanged)
      wallet.on('confirmedBalanceChanged', this._onWalletConfirmedBalanceChanged)
      wallet.on('receiveAddressChanged', this._onWalletReceiveAddressChanged)
      wallet.on('blockTipHeightChanged', this._onWalletBlockTipHeightChanged)
      wallet.on('synchronizedBlockHeightChanged', this._onWalletSynchronizedBlockHeightChanged)
      wallet.on('paymentAdded', this._onWalletPaymentAdded)

      // add any payments which are already present
      wallet.paymentsInTransactionWithTXID.forEach((payments, txHash) => {
          payments.forEach(this._onWalletPaymentAdded.bind(this))
      })

      /**
       * Set wallet scene model
       * For now just set a constant fee rate, in the
       * future we need to rely on a fee estimation feed from some
       * endpoint, or something similar.
       * Estimate picked from: https://live.blockcypher.com/btc-testnet/
       */
      // let satsPrkBFee = 0.00239 * bcoin.protocol.consensus.COIN

      // http://statocashi.info/dashboard/db/fee-estimates?orgId=1&from=now-7d&to=now
      let satsPrkBFee = 1050

      // We need settings to be opened, and we are guaranteed that this has happened
      // before wallet is ready
      assert(this._application.applicationSettings.state === ApplicationSettings.STATE.OPENED)

      assert(!this.walletSceneStore)
      this.walletSceneStore = new WalletSceneStore(
        this.applicationStore.walletStore,
        this.applicationStore.priceFeedStore,
        satsPrkBFee,
        null,
        '',
        true, // allow claiming free BCH functionality
        launchExternalTxViewer,
        this.claimFreeBCH,
        bcoin.protocol.consensus.COIN
      )

    }

  })

  _onResourceStoppedAction = action((resource) => {

    // Update started resource set
    this.applicationStore.setStartedResources(resource)

  })


  _updateOnboardingStatusAction = action((isEnabled) => {

    let onboardingStore = null

    // Create onboarding store if enabled
    if (isEnabled)
      onboardingStore = new OnboardingStore(this, OnboardingStore.STATE.WelcomeScreen, true, open)

    // Update application store signal about onboarding being enabled
    // and set store
    this.applicationStore.setOnboardingIsEnabled(isEnabled)
    this.setOnboardingStore(onboardingStore)

  })

  _onTorrentAddedAction = action((torrent) => {

    assert(this.applicationStore)

    // Create TorrentStore
    let torrentStore = new TorrentStore({
      infoHash: torrent.infoHash,
      name: torrent.name,
      savePath: torrent.savePath,
      state: torrent.state,
      totalSize: torrent.torrentInfo ? torrent.torrentInfo.totalSize() : 0,
      pieceLength: torrent.torrentInfo ? torrent.torrentInfo.pieceLength() : 0,
      numberOfPieces: torrent.torrentInfo ? torrent.torrentInfo.numPieces() : 0,
      progress: torrent.progress,
      viabilityOfPaidDownloadInSwarm : torrent.viabilityOfPaidDownloadInSwarm,
      downloadedSize: torrent.downloadedSize,
      downloadSpeed: torrent.downloadSpeed,
      uploadSpeed: torrent.uploadSpeed,
      uploadedTotal: torrent.uploadedTotal,
      numberOfSeeders: torrent.numberOfSeeders,
      sellerTerms: torrent.sellerTerms,
      buyerTerms: torrent.buyerTerms,
      numberOfPiecesSoldAsSeller: 0,
      totalRevenueFromPiecesAsSeller: 0,
      totalSpendingOnPiecesAsBuyer: 0,
      starter: torrent.start.bind(torrent),
      stopper: torrent.stop.bind(torrent),
      paidDownloadStarter: torrent.startPaidDownload.bind(torrent),
      uploadBeginner: torrent.beginUpload.bind(torrent),
      uploadStopper: torrent.endUpload.bind(torrent)
    })

    /// Hook into events

    torrent.on('state', action((state) => {

      torrentStore.setState(state)

      /**
       * When torrent is finished, we have to count towards the navigator
       * Bug: see here https://github.com/JoyStream/joystream-desktop/issues/764
       */

      if(state === 'Active.FinishedDownloading.Passive') {

        assert(this.applicationNavigationStore)
        this.applicationNavigationStore.handleTorrentCompleted()

        // In the future: Add desktop notifications!

      }

    }))

    torrent.on('loaded', action((deepInitialState) => {

      /**
       * When adding a torrent through the uploading flow,
       * we need to learn whether uploading the given torrent is feasible,
       * which depends on whether it has been fully downloaded and authenticated,
       * which is ultimately something libtorrent will tell us about.
       *
       * Hence, whenever a torrent has been loaded, we check
       * if there is such an uploading flow going for the given torrent,
       * and notify the given scene model about the download status.
       */

      if(this.uploadingStore &&
        this.uploadingStore.state === UploadingStore.STATE.AddingTorrent &&
        this.uploadingStore.infoHashOfTorrentSelected === torrent.infoHash) {

        if(torrent.state.startsWith('Active.DownloadIncomplete'))
          this.uploadingStore.torrentDownloadIncomplete()
        else if(torrent.state.startsWith('Active.FinishedDownloading'))
          this.uploadingStore.torrentFinishedDownloading()
      }

    }))

    torrent.on('viabilityOfPaidDownloadInSwarm', action((viabilityOfPaidDownloadInSwarm) => {
      torrentStore.setViabilityOfPaidDownloadInSwarm(viabilityOfPaidDownloadInSwarm)
    }))

    torrent.on('buyerTerms', action((buyerTerms) => {
      torrentStore.setBuyerTerms(buyerTerms)
    }))

    torrent.on('sellerTerms', action((sellerTerms) => {
      torrentStore.setSellerTerms(sellerTerms)
    }))

    torrent.on('resumeData', action((resumeData) => {
      // Nothing to do
    }))

    /**
     * When metadata comes in, we need to set some values on
     * the store
     */
    torrent.on('torrentInfo', action((torrentInfo) => {

      torrentStore.setName(torrentInfo.name())
      torrentStore.setTotalSize(torrentInfo.totalSize())
      torrentStore.setTorrentFiles(torrentInfo.files())
      torrentStore.setPieceLength(torrentInfo.pieceLength())
      torrentStore.setNumberOfPieces(torrentInfo.numPieces())
    }))

    torrent.on('progress', action((progress) => {
      torrentStore.setProgress(progress * 100)
    }))

    torrent.on('downloadedSize', action((downloadedSize) => {
      torrentStore.setDownloadedSize(downloadedSize)
    }))

    torrent.on('downloadSpeed', action((downloadSpeed) => {
      torrentStore.setDownloadSpeed(downloadSpeed)
    }))

    torrent.on('uploadedTotal', action((uploadedTotal) => {
      torrentStore.setUploadedTotal(uploadedTotal)
    }))

    torrent.on('uploadSpeed', action((uploadSpeed) => {
      torrentStore.setUploadSpeed(uploadSpeed)
    }))

    torrent.on('numberOfSeeders', action((numberOfSeeders) => {
      torrentStore.setNumberOfSeeders(numberOfSeeders)
    }))

    torrent.on('paymentSent', action((paymentIncrement, totalNumberOfPayments, totalAmountPaid, pieceIndex) => {
      /**
       * A naive mistake here is to miss the fact that a single torrent may involve
       * multiple failed attempts at paying different peers at different times, hence
       * we cannot simply write to the `torrentStore` using `totalAmountPaid`.
       */

      torrentStore.totalSpendingOnPiecesAsBuyer += paymentIncrement

      // Global counters
      this.totalSpendingOnPieces += paymentIncrement
    }))

    torrent.on('validPaymentReceived', action((paymentIncrement, totalNumberOfPayments, totalAmountPaid) => {

      torrentStore.numberOfPiecesSoldAsSeller++
      torrentStore.totalRevenueFromPiecesAsSeller += paymentIncrement

      // Global counters
      this.numberOfPiecesSoldAsSeller++
      this.totalRevenueFromPieces += paymentIncrement
    }))

    torrent.on('lastPaymentReceived', action((settlementTx) => {

      // Raw transaction
      console.log('settlementTx')
      console.log(settlementTx)

    }))

    torrent.on('failedToMakeSignedContract', action((failedToMakeSignedContract) => {
      console.log('failedToMakeSignedContract: ' + failedToMakeSignedContract)
    }))

    /**
     * When a peer is added,
     * we create a peer store which watches the peer and
     * synches its own observables. Also we add
     * store to torrent store
     */
    torrent.on('peerAdded', action((peer) => {

      let pid = peer.pid()

      let peerStore = new PeerStore(
        pid,
        peer.state(),
        peer.peerPluginStatus()
      )

      peer.on('peerPluginStatus', action((peerPluginStatus) => {
        peerStore.setPeerPluginStatus(peerPluginStatus)
      }))

      assert(!torrentStore.peerStores.has(pid))

      torrentStore.peerStores.set(pid, peerStore)

    }))

    /**
     * When peer is removed, drop peer store from the
     * torrent store
     */
    torrent.on('peerRemoved', action((peerId) => {

      assert(torrentStore.peerStores.has(peerId))

      torrentStore.peerStores.delete(peerId)

    }))

    // If we have metadata set the torrentFiles
    if (torrent.torrentInfo && torrent.torrentInfo.isValid()) {
      torrentStore.setTorrentFiles(torrent.torrentInfo.files())
    }

    // Add to application store
    this.applicationStore.onNewTorrentStore(torrentStore)

    // Add to relevant scenes if they currently exist,
    // which they only do when UI is active, not during loading

    if(this.currentPhase === UIStore.PHASE.Alive) {

      assert(this.uploadingStore)
      assert(this.downloadingStore)
      assert(this.completedStore)

      /**
       * Keep in mind that _all_ torrent table scenes
       * know about all stores at all times, even though
       * the torrent may be in an irrelevant state. This avoids
       * having to add/remove through reactions as state changes
       */

      this.uploadingStore.addTorrentStore(torrentStore)
      this.downloadingStore.addTorrentStore(torrentStore)
      this.completedStore.addTorrentStore(torrentStore)
    }

  })

  _onTorrentRemovedAction = action((infoHash) => {

    // Remove from application store
    this.applicationStore.onTorrentRemoved(infoHash)

    // Remove from relevant scenes
    this.uploadingStore.removeTorrentStore(infoHash)
    this.downloadingStore.removeTorrentStore(infoHash)
    this.completedStore.removeTorrentStore(infoHash)
  })

  /**
   * Below we have all the hooks introduced to handle core domain
   * events which require action wrappers to be handled safely in
   * updating our store tree.
   */

  /**
   * Hooks for {@link Wallet}
   */

  /// Hook up with events

  _onWalletStateChanged = action((newState) => {
    let walletStore = this.applicationStore.walletStore
    assert(walletStore)
    walletStore.setState(newState)

    // When the wallet has gotten the balance, then we know it
    // has completed loading the preceeding state, Wallet.STATE.GETTING_WALLET,
    // which means we can
    if(newState === Wallet.STATE.GETTING_BALANCE)
      walletStore.setMasterKey(wallet.getMasterKey())

  })

  _onWalletTotalBalanceChanged = action((totalBalance) => {
    let walletStore = this.applicationStore.walletStore
    assert(walletStore)
    walletStore.setTotalBalance(totalBalance)
  })

  _onWalletConfirmedBalanceChanged = action((confirmedBalance) => {
    let walletStore = this.applicationStore.walletStore
    assert(walletStore)
    walletStore.setConfirmedBalance(confirmedBalance)
  })

  _onWalletReceiveAddressChanged = action((receiveAddress) => {
    let walletStore = this.applicationStore.walletStore
    assert(walletStore)
    walletStore.setReceiveAddress(receiveAddress)
  })

  _onWalletBlockTipHeightChanged = action((height) => {
    let walletStore = this.applicationStore.walletStore
    assert(walletStore)
    walletStore.setBlockTipHeight(height)
  })

  _onWalletSynchronizedBlockHeightChanged = action((height) => {
    let walletStore = this.applicationStore.walletStore
    assert(walletStore)
    walletStore.setSynchronizedBlockHeight(height)
  })

  _onWalletPaymentAdded = action((payment) => {

    assert(this.applicationStore)

    // Create payment store
    let paymentStore = new PaymentStore({
      type: payment.type,
      txId: payment.txId,
      outputIndex: payment.outputIndex,
      seenDate: payment.seenDate,
      minedDate: payment.minedDate,
      toAddress: payment.toAddress,
      amount: payment.amount,
      fee: payment.fee,
      confirmed: payment.confirmed,
      blockIdOfBlockHoldingTransaction: payment.blockIdOfBlockHoldingTransaction,
      blockHeightOfBlockHoldingTransaction: payment.blockHeightOfBlockHoldingTransaction,
      note: payment.note
    })

    /**
     * NB: REVISIT when we work on WalletStore.pay
     * // add to wallet store
     *
     */

    let walletStore = this.applicationStore.walletStore
    assert(walletStore)

    walletStore.addPaymentStore(paymentStore)

    /// Hook up events

    payment.on('confirmedChanged', action((confirmed, seenDate, minedDate) => {
      paymentStore.setSeenDate(seenDate)
      paymentStore.setMinedDate(minedDate)
      paymentStore.setConfirmed(confirmed)
    }))

    payment.on('blockIdOfBlockHoldingTransactionChanged', action((blockIdOfBlockHoldingTransaction) => {
      paymentStore.setBlockIdOfBlockHoldingTransaction(blockIdOfBlockHoldingTransaction)
    }))

    payment.on('blockHeightOfBlockHoldingTransactionChanged', action((blockHeightOfBlockHoldingTransaction) => {
      paymentStore.setBlockHeightOfBlockHoldingTransaction(blockHeightOfBlockHoldingTransaction)
    }))

    payment.on('noteChanged', action((note) => {
      paymentStore.setNote(note)
    }))

  })

  // Hooks for {@link ApplicationSettings}

  /**
   * Handler for when download folder is changed in application settings
   * @param downloadFolder
   */
  _onNewDownloadFolderAction = action((downloadFolder) => {

    let applicationSettingsStore = this.applicationStore.applicationSettingsStore

    assert(this.applicationStore.applicationSettingsStore)

    applicationSettingsStore.setDownloadFolder(downloadFolder)

  })

  @action.bound
  setCurrentPhase(currentPhase) {
    this.currentPhase = currentPhase
  }

  @action.bound
  setDisplayTermsScene(displayTermsScene) {
    this.displayTermsScene = displayTermsScene
  }

  @action.bound
  handleTermsAccepted() {

    if(!this.displayTermsScene)
      throw Error('Cannot accept terms when not being displayed.')

    // Remove terms scene visibility
    this.setDisplayTermsScene(false)

    // Mark terms as being accepted in settings
    this._application.applicationSettings.setTermsAccepted(true)
  }

  @action.bound
  handleTermsRejected = () => {

    if(!this.displayTermsScene)
      throw Error('Cannot reject terms when not being displayed.')

    // Initiate closing application
    this.closeApplication()
  }

  /**
   * Closes the application, but firrst enables possible
   * onboarding flow if its currently enabled.
   */
  handleCloseApplicationAttempt = () => {

    /**
     * If onboarding is enabled, then display shutdown message - if its not already
     * showing, and block the shutdown for now
     */
    if (this._application.onboardingIsEnabled) {

      /**
       *  Only call for shutdown message if its not already showing, it is after all
       *  posible for the user to click the window close button on the shutdown message one or more times,
       * which we block, we _require_ that the button is pressed
       */

      assert(this.onboardingStore !== null)

      if (this.onboardingStore.state !== OnboardingStore.STATE.DepartureScreen) {
        this.onboardingStore.displayShutdownMessage()
      } else {
        console.log('Ignoring user attempt to close window while on departure screen of onboarding, UI scene button must be used.')
      }

    }
    /**
     * Otherwise we are initiating stop, so block window closing for the moment,
     * the main process will later trigger a second close request when we are in
     * `NotStarted` by calling electron.app.quit in response to IPC from
     * this renderes process about successful stopping, which which we don't block.
     */
    else {
      this.closeApplication()
    }

  }

  /**
   * Directly initiates application stoppage.
   */
  closeApplication() {
    this._application.stop()
  }

  @action.bound
  setRevenue(revenue) {
    this.revenue = revenue
  }

  @action.bound
  setOnboardingStore(onboardingStore) {
    this.onboardingStore = onboardingStore
  }

  @action.bound
  setMediaPlayerStore(mediaPlayerStore) {
    this.mediaPlayerStore = mediaPlayerStore
  }

  @action.bound
  playMedia(infoHash, fileIndex) {
    const torrent = this._application.torrents.get(infoHash)

    const streamUrl = this._application.getTorrentStreamUrl(infoHash, fileIndex)

    if (!torrent) {
      throw new Error('playMedia: torrent not in session')
    }

    const filteredTorrentStores = this.torrentStoresArray.filter(store => store.infoHash === infoHash)

    if (filteredTorrentStores.length !== 1) {
      throw new Error('playMedia: No torrent store found for torrent')
    }

    const torrentStore = filteredTorrentStores[0]

    assert(torrentStore.infoHash === infoHash)

    if (torrent.state.startsWith('Loading')) {
      throw new Error('playMedia: torrent still loading')
    }

    const loadedSecondsRequiredForPlayback = 10

    const autoPlay = true

    // Create store for player
    const store = new MediaPlayerStore(
      torrentStore,
      streamUrl,
      loadedSecondsRequiredForPlayback,
      autoPlay,
      mediaPlayerWindowSizeFetcher,
      mediaPlayerWindowSizeUpdater,
      () => { // When player exits
        this.setMediaPlayerStore(null)
        powerSavingBlocker(false)
        Doorbell.show()
      },
      this
    )

    // Display the media player
    this.setMediaPlayerStore(store)

    // Hide feedback in player
    Doorbell.hide()

    // Turn on power saving blocker
    powerSavingBlocker(true)
  }

  @action.bound
  claimFreeBCH = () => {

    this._application.claimFreeBCH()

  }

  @action.bound
  chooseNewDownloadFolder = () => {

    // Make sure the main phase scene is active
    if(this.alivePhaseScene !== UIStore.ALIVE_PHASE_SCENE.Main)
      throw Error('Must be in the main alive phase scene.')

    // Make sure we are on the right tab
    if(this.applicationNavigationStore.activeTab !== ApplicationNavigationStore.TAB.Settings)
      throw Error('Must be on the settings tab.')

    // Allow user to picke folder using native dialog
    let folderPicked = remote.dialog.showOpenDialog({
      title: 'Pick folder where torrents will be stored',
      properties: ['openDirectory']}
    )

    if (!folderPicked || folderPicked.length === 0) {
      return
    }

    // Update download folder
    this._application.applicationSettings.setDownloadFolder(folderPicked[0])

  }

  @computed get
  torrentStoresArray() {
    return [...this.applicationStore.torrentStores.values()]
  }

  @computed get torrentsBeingLoaded() {

    return this.torrentStoresArray.filter(function (torrent) {
      return torrent.isLoading
    })

  }

  @computed get torrentsFullyLoadedPercentage() {

    return 100 * (1 - (this.torrentsBeingLoaded.length / this.applicationStore.torrentStores.size))
  }

  @computed get startingTorrentCheckingProgressPercentage() {

    // Compute total size
    let totalSize = this.torrentStoresArray.reduce(function (accumulator, torrent) {
      return accumulator + torrent.totalSize
    }, 0)

    // Computed total checked size
    let totalCheckedSize = this.torrentStoresArray.reduce(function (accumulator, torrent) {
      let checkedSize = torrent.totalSize * (torrent.isLoading ? torrent.progress / 100 : 1)
      return accumulator + checkedSize
    }, 0)

    return totalCheckedSize / totalSize * 100
  }

  @computed get torrentsBeingTerminated() {

    return this.torrentStoresArray.filter(function (torrent) {
      return torrent.isTerminating
    })
  }

  @computed get terminatingTorrentsProgressPercentage() {

    return this.torrentsBeingTerminated * 100 / this.applicationStore.torrentStores.size
  }

  @computed get
  torrentsViabilityOfPaidDownloading () {
    let balance = 0
    let walletStarted = false
    const walletStore = this.applicationStore.walletStore

    if (walletStore) {
      balance = walletStore.totalBalance
      walletStarted = walletStore.state === Wallet.STATE.STARTED
    }

    return new Map(this.torrentStoresArray.map((torrentStore) => {

      let viability = computeViabilityOfPaidDownloadingTorrent(torrentStore.state, walletStarted, balance, torrentStore.viabilityOfPaidDownloadInSwarm)

      /**
       * -- Complete hack!!! --
       *
       * PROBLEM:
       * https://github.com/JoyStream/joystream-desktop/issues/955
       * The core issue is that the 1 sat (actually 2 sat due to bug) floor allows
       * malicious torrent distributor to make piece length arbitrarily short,
       * which artificially elevates to the total cost for the torrent. In fact,
       * by adjusting the total length and piece length, the cost can be made arbitrarily high,
       * and with the current uncapped automatic allocation, with the only constraint
       * being protocol terms comparison (which is distorted by 1 sat|2 sat floor),
       * can allow an arbitrarily large amount to be allocated to the channel and even spent.
       *
       * SOLUTION:
       * There are many ways to fix it, the fundamental fix at the protocol level will take time.
       * There are many fixes at the protocol level, however the one which is most forward compatible
       * and requiring no migration of prior terms (which is always a complicated mess), is the one below.
       * Namely, we just detect the case where our buyer side price calculation is making the truncation
       * mistake, and then pretend as if there are no seller peers around. The result of this is that any
       * malicious torrent will appear as having no peers to the user, which
       * is the same user experience the user will face once the fundamental fix is made.
       */

      let pieceLength = torrentStore.pieceLength
      let numPieces = torrentStore.numberOfPieces

      if(pieceLength && numPieces) {

        // distortPrice = true
        let convertedTerms = this._application.defaultBuyerTerms(pieceLength, numPieces, false)

        if(convertedTerms.maxPrice < 1) {

          viability = InViable(new NoJoyStreamPeerConnections())

          console.log('Hotfix: censoring any usage of this torrent, real piece price: ' + convertedTerms.maxPrice)
        }

      }

      return [torrentStore.infoHash, viability]
    }))
  }

  /**
   * Scene visible when scene is active
   * @returns {ALIVE_PHASE_SCENE|null}
   */
  @computed get
  alivePhaseScene() {

    // Make sure we are actually alive
    if(this.currentPhase !== UIStore.PHASE.Alive)
      return null
    else if(this.displayTermsScene)
      return UIStore.ALIVE_PHASE_SCENE.Terms
    else if(this.mediaPlayerStore)
      return UIStore.ALIVE_PHASE_SCENE.VideoPlayer
    else if(this.onboardingStore && this.onboardingStore.state === OnboardingStore.STATE.WelcomeScreen)
      return UIStore.ALIVE_PHASE_SCENE.OnboardingWelcome
    else if(this.onboardingStore && this.onboardingStore.state === OnboardingStore.STATE.DepartureScreen)
      return UIStore.ALIVE_PHASE_SCENE.OnboardingDeparture
    else
      return UIStore.ALIVE_PHASE_SCENE.Main
  }

  @computed get
  showCheckingTorrentProgress() {

    return this.alivePhaseScene === UIStore.ALIVE_PHASE_SCENE.Main &&
      this.applicationNavigationStore.onTorrentListingTab && // on the torrent tabs
      this.torrentsBeingLoaded.length > 0

  }

  @computed get
  totalSpendingOnPiecesInFiat() {

    if(!this.applicationStore.priceFeedStore)
      return null
    else
      return (this.totalSpendingOnPieces / bcoin.protocol.consensus.COIN) * this.applicationStore.priceFeedStore.cryptoToUsdExchangeRate
  }

  @computed get
  totalRevenueFromPiecesInFiat() {

    if(!this.applicationStore.priceFeedStore)
      return null
    else
      return (this.totalRevenueFromPieces / bcoin.protocol.consensus.COIN) * this.applicationStore.priceFeedStore.cryptoToUsdExchangeRate
  }


  @action.bound
  setTorrentTerminatingProgress(progress) {
    this.torrentTerminatingProgress = progress
  }

  openTelegramChannel() {

  }

  openRedditCommunity() {

  }

  openSlackSignupPagee() {

  }

  addExampleTorrents () {
    this._application.addExampleTorrents()
  }

  openingExternalTorrentResult (err, torrentName) {

  }

}

function launchExternalTxViewer(txId, outputIndex) {

  console.log('Opening payment carried by output ' + outputIndex + ' in tx ' + txId)

  opn(constants.BLOCKEXPLORER_QUERY_STRING_BASE + txId).catch(() => {})
}

function appStateToUIStorePhase(state) {

  let phase

  switch (state) {

    case Application.STATE.STOPPED:
      phase = UIStore.PHASE.Idle
      break

    case Application.STATE.STARTING:
      phase = UIStore.PHASE.Alive
      break

    case Application.STATE.STARTED:
      phase = UIStore.PHASE.Alive
      break

    case Application.STATE.STOPPING:
      phase = UIStore.PHASE.Idle
      break

    default:

      assert(false)
    //throw Error('Invalid state passed, and recall that STOPPED is not accepted')

  }

  return phase
}

/**
function peerCountsFromPluginStatuses(peerPluginStatuses) {

  // Counters
  let buyers = 0
  let sellers = 0
  let observers = 0
  let normals = 0

  // Iterate peers and determine type
  for(var i in peers) {

    // Get status
    var s = peers[i]._client.status

    if(s.peerBitSwaprBEPSupportStatus !== BEPSupportStatus.supported) {
      normals++
    } else if(s.connection) {

      var announced = s.connection.announcedModeAndTermsFromPeer

      if(announced.buyer)
        buyers++
      else if(announced.seller)
        sellers++
      else if(announced.observer)
        observers++
    }

  }

  return {
    buyers,
    sellers,
    observers,
    normals
  }

}
*/

/**
 startDownloadWithTorrentFileFromMagnetUri: function (client, magnetUri) {

  debugApplication('Adding torrent with magnet URI!')

  var parsed = magnet.decode(magnetUri)

  // Make sure torrent is not already added
  if(client.torrents.has(parsed.infoHash)) {
    console.log('TorrentAlreadyAdded')
    debugApplication('Torrent already added!')
    return
  }

  let savePath = client.store.applicationSettings.getDownloadFolder()

  let settings = Common.getSettingsFromMagnetUri(magnetUri, savePath)

  debugApplication('Settings with magnet URI successfully initialized. Readdy to add the torrent.')

  Common.addTorrent(client, settings)
}

 function getSettingsFromMagnetUri (magnetUri, defaultSavePath) {

    let terms = getStandardBuyerTerms()
    var parsed = magnet.decode(magnetUri)

    return {
        infoHash: parsed.infoHash,
        url: magnetUri,
        resumeData : null,
        savePath: defaultSavePath,
        name: parsed.infoHash,
        deepInitialState: TorrentStatemachine.DeepInitialState.DOWNLOADING.UNPAID.STARTED,
        extensionSettings : {
            buyerTerms: terms
        }
    }
}
 */


function mediaPlayerWindowSizeFetcher () {
  return { width: window.innerWidth, height: window.innerHeight }
}

function mediaPlayerWindowSizeUpdater (bounds) {
  require('electron').ipcRenderer.send('set-bounds', bounds)
}

function powerSavingBlocker (enable) {
  require('electron').ipcRenderer.send('power-save-blocker', {enable: enable})
}

export default UIStore
