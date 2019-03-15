/**
 * Created by bedeho on 04/07/17.
 */

var assert = require('chai').assert
var sinon = require('sinon')
var Mocks = require('./Mocks')
var ControlledPromise = require('../util/controlled_promise')
var PromiseMock = require('promise-mock')

var Torrent = require('../../src/core/Torrent/Statemachine')
var ViabilityOfPaidDownloadingInSwarm = require('../../src/core/Torrent/ViabilityOfPaidDownloadingSwarm').default
var BEPSupportStatus = require('joystream-node').BEPSupportStatus
var ConnectionInnerState = require('joystream-node').ConnectionInnerState

/**
 *
 * NB! Within a given describe where a client instance lives, the order of
 * specific tests (it) are important most of the time, so change with care.
 *
 */

describe('Torrent state machine', function () {

    describe('recovers from incomplete download with upload settings' , function () {

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: null,
            metadata: "my-metadata",
            deepInitialState: Torrent.DeepInitialState.UPLOADING.STOPPED,
            extensionSettings: {
                sellerTerms : {}
            },
            isFullyDownloaded: false
        }

        let client = new MockClient(fixture)

        it('waits for buyer terms', function () {

            handleSequence(Torrent,
                            client,
                            fixtureToAddedToSessionInput(fixture),
                            fixtureToCheckFinishedInput(fixture))

            assert(client._joystreamNodeTorrent != null)
            assert.equal(Torrent.compositeState(client), 'Loading.WaitingForMissingBuyerTerms')

        })

        it('gets started downloading', function() {

            let buyerTerms = {}

            handleSequence(Torrent,
                            client,
                            ['missingBuyerTermsProvided', buyerTerms])

            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt')

        })

    })

    describe('terminate while loading' , function () {

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: null,
            metadata: "my-metadata",
            deepInitialState: Torrent.DeepInitialState.UPLOADING.STOPPED,
            extensionSettings: {
                sellerTerms : {}
            },
            isFullyDownloaded: false,
            generateResumeData : true
        }

        let client = new MockClient(fixture)

        it('terminates', function () {

            handleSequence(Torrent, client,
                            fixtureToAddedToSessionInput(fixture),
                            fixtureToCheckFinishedInput(fixture),
                            fixtureToTerminateInput(fixture))

            assert.equal(Torrent.compositeState(client), 'Terminated')
        })

    })

    describe('Full downloading->passive->uploading lifecycle', function() {
        beforeEach(function () {
          PromiseMock.install()
        })

        afterEach(function () {
          PromiseMock.uninstall()
        })

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: "resume_data",
            metadata: null,
            deepInitialState: Torrent.DeepInitialState.DOWNLOADING.UNPAID.STOPPED,
            extensionSettings: {
                buyerTerms : {
                    minNumberOfSellers : 1
                },
                sellerTerms: {
                    minPrice: 1,
                    minContractFeePerKb: 1000,
                    minLock: 1
                }
            },
            updateBuyerTerms : {
                x : 2,
                rr: "hello"
            }

        }

        const metadataFixture = { metadata: { _numPieces: 5 } }

        let client = new MockClient(fixture)

        it('waits to be added to session', function () {

            assert.equal(Torrent.compositeState(client), 'Loading.AddingToSession')

        })

        it('waits for metadata',  function() {

            handleSequence(Torrent,
                            client,
                            fixtureToAddedToSessionInput(fixture))

            assert.equal(Torrent.compositeState(client),'Loading.WaitingForMetadata')
        })

        it('checks partial download', function() {

            Torrent.queuedHandle(client, 'metadataReady', new Mocks.TorrentInfo(metadataFixture))

            assert.equal(Torrent.compositeState(client), 'Loading.CheckingPartialDownload')
        })

        it('goes to correct inital state: unpaid stopped downloading', function() {

            Torrent.queuedHandle(client, 'checkFinished')

            assert.equal(client._joystreamNodeTorrent.setLibtorrentInteraction.callCount, 1)
            assert.equal(client._joystreamNodeTorrent.toBuyMode.callCount, 1)
            assert.deepEqual(client._joystreamNodeTorrent.toBuyMode.getCall(0).args[0], fixture.extensionSettings.buyerTerms)
            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Stopped')

        })

        it('starts', function () {

            client._joystreamNodeTorrent.handle.resume.reset()
            client._joystreamNodeTorrent.startPlugin.reset()

            Torrent.queuedHandle(client, 'start')

            assert.equal(client._joystreamNodeTorrent.handle.resume.callCount, 1)
            assert.equal(client._joystreamNodeTorrent.startPlugin.callCount, 1)
            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt')
        })

        xit('update buyer terms', function () {

            Torrent.queuedHandle(client, 'updateBuyerTerms', fixture.updateBuyerTerms)

            assert.equal(client.updateBuyerTerms.callCount, 1)
            assert.deepEqual(client.updateBuyerTerms.getCall(0).args[0], fixture.updateBuyerTerms)
            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt')
        })

        it('ignores premature start paid download attempts' , function () {

            var callback = sinon.spy()

            Torrent.queuedHandle(client, 'startPaidDownload', callback)
            assert(callback.called)
            assert(callback.getCall(0).args[0] !== null)
            assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt')

        })

        it('finds suitable sellers', function () {
            // pump in peer plugins without any viable connections
            let viability
            let statuses = []
            statuses.push(Mocks.PeerPluginStatus('id-1'))
            statuses.push(Mocks.PeerPluginStatus('id-2'))
            statuses.push(Mocks.PeerPluginStatus('id-3'))

            client._setViabilityOfPaidDownloadInSwarm.reset()
            Torrent.queuedHandle(client, 'processPeerPluginStatuses', statuses)

            assert.equal(client._setViabilityOfPaidDownloadInSwarm.callCount, 1)
            assert.equal(client.peers.size, 3)
            viability = client._setViabilityOfPaidDownloadInSwarm.getCall(0).args[0]
            assert(viability instanceof ViabilityOfPaidDownloadingInSwarm.NoJoyStreamPeerConnections)

        })

        it('can start paid download', function () {

          /// pump in peerplugins with one seller

          let viability
          let statuses = []
          const supported = BEPSupportStatus.supported
          const announcedModeAndTermsFromPeer = Mocks.AnnouncedModeAndTerms.Sell(fixture.extensionSettings.sellerTerms, 0)
          const payor = {
            // 33 byte compressed public key of seller
            sellerContractPk: Buffer.from('030589ee559348bd6a7325994f9c8eff12bd5d73cc683142bd0dd1a17abc99b0dc', 'hex')
          }

          const connectionStatus = Mocks.ConnectionStatus('id-1', ConnectionInnerState.PreparingContract, payor, {}, announcedModeAndTermsFromPeer)
          statuses.push(Mocks.PeerPluginStatus('id-1' , 0, supported, supported, connectionStatus))

          client._setViabilityOfPaidDownloadInSwarm.reset()
          Torrent.queuedHandle(client, 'processPeerPluginStatuses', statuses)
          assert.equal(client._setViabilityOfPaidDownloadInSwarm.callCount, 1)
          assert.equal(client.peers.size, 1)
          viability = client._setViabilityOfPaidDownloadInSwarm.getCall(0).args[0]
          assert(viability instanceof ViabilityOfPaidDownloadingInSwarm.Viable)

          ///

          // startPaidDownload event moves to 'SigningContract'
          var startDownloadCallback = sinon.spy()

          Torrent.queuedHandle(client, 'startPaidDownload', startDownloadCallback)

          assert(!startDownloadCallback.called)

          assert(client._privateKeyGenerator.called)
          assert(client._publicKeyHashGenerator.called)
          assert(client._contractGenerator.called)

          assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.SigningContract')


          // trigger contractSigned, moves to 'InitiatingPaidDownload'
          const contractTx = new Buffer(250)
          client._contractGenerator.returnValues[0].resolve(contractTx)

          Promise.run()

          assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.InitiatingPaidDownload')

          // trigger paidDownloadInitiationCompleted, moves to '../../Paid/Started'
          // third argument is the callback
          const callback = client._joystreamNodeTorrent.startDownloading.getCall(0).args[2]

          // success
          callback(null)
          assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Paid.Started')

        })

        it('ready to start paid download when all sellers leave', function () {

          Torrent.queuedHandle(client, 'allSellersGone')

          assert.equal(Torrent.compositeState(client), 'Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt')
        })

        it('finish download' , function() {

            client._joystreamNodeTorrent.toObserveMode.reset()

            Torrent.queuedHandle(client, 'downloadFinished')

            assert.equal(client._joystreamNodeTorrent.toObserveMode.callCount, 1)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive')
        })

    })

    describe('Direct to passive flow', function() {

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: "resume_data",
            metadata: 'my-meta-data',
            deepInitialState: Torrent.DeepInitialState.PASSIVE,
            extensionSettings: {},
            isFullyDownloaded: true
        }

        let client = new MockClient(fixture)

        it('gets to passive', function () {

            handleSequence(Torrent, client,
                fixtureToAddedToSessionInput(fixture),
                fixtureToCheckFinishedInput(fixture)
            )

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive')
        })

        it('then to uploading', function() {

            Torrent.queuedHandle(client, 'goToStartedUploading')

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Started')
            assert.equal(client._joystreamNodeTorrent.toSellMode.callCount, 1)
        })

        it('then back to passive', function() {

            Torrent.queuedHandle(client, 'goToPassive')

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive')
        })

    })

    describe('Direct to uploading flow', function () {

        let fixture = {
            infoHash: "my_info_hash",
            name: "my_torrent_name",
            savePath: "save_path",
            resumeData: "resume_data",
            metadata: 'my-meta-data',
            deepInitialState: Torrent.DeepInitialState.UPLOADING.STOPPED,
            extensionSettings: {
                sellerTerms : {}
            },
            updateSellerTerms : {
                sellerTerms : {
                    xxx : 1
                }
            },
            isFullyDownloaded: true
        }

        let client = new MockClient(fixture)

        it('gets to (stopped) uploading', function () {

            handleSequence(Torrent, client,
                fixtureToAddedToSessionInput(fixture),
                fixtureToCheckFinishedInput(fixture)
            )

            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Stopped')
        })

        it('starts', function () {

          client._joystreamNodeTorrent.handle.resume.reset()
          client._joystreamNodeTorrent.startPlugin.reset()

          Torrent.queuedHandle(client, 'start')

          assert.equal(client._joystreamNodeTorrent.handle.resume.callCount, 1)
          assert.equal(client._joystreamNodeTorrent.startPlugin.callCount, 1)
          assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Started')
        })

        xit('changes seller terms', function () {

            Torrent.queuedHandle(client, 'updateSellerTerms', fixture.updateSellerTerms.sellerTerms)

            assert.equal(client.updateSellerTerms.callCount, 1)
            assert.deepEqual(client.updateSellerTerms.getCall(0).args[0], fixture.updateSellerTerms.sellerTerms)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Uploading.Started')
        })

        xit('starts paid upload' , function () {


            ///

            var statuses = []

            Torrent.queuedHandle(client, 'processPeerPluginStatuses', statuses)


            ///

            // startUploadingFailed

            ///

            // startedPaidUploading


        })

        xit('goes back to passive', function () {

            ///

            Torrent.queuedHandle(client, 'goToPassive')

            // assert.equal(client.updateSellerTerms.callCount, 1)
            // assert.deepEqual(client.updateSellerTerms.getCall(0).args[0], fixture.updateSellerTerms.sellerTerms)
            assert.equal(Torrent.compositeState(client), 'Active.FinishedDownloading.Passive')

            ///

            //

            ///

            //

        })

    })

})

function MockClient(fix) {

    this._submitInput = function (...args) {
      Torrent.queuedHandle(this, ...args)
    }

    this.torrentInfo = new Mocks.TorrentInfo(fix)
    this.infoHash = fix.infoHash
    this._deepInitialState = fix.deepInitialState
    this.sellerTerms = fix.extensionSettings.sellerTerms
    this.buyerTerms = fix.extensionSettings.buyerTerms
    this.peers = new Map()

    this.emit = sinon.spy() // EventEmitter
    this.on = sinon.spy() // EventEmitter

    this._setTorrentInfo = sinon.spy((info) => {
      this.torrentInfo = info
    })

    this._setBuyerTerms = sinon.spy()
    this._setSellerTerms = sinon.spy()

    this._setViabilityOfPaidDownloadInSwarm = sinon.spy((viability) => {
      this.viabilityOfPaidDownloadInSwarm = viability
    })

    this._privateKeyGenerator = sinon.spy(function () {
      return [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1]
    })

    this._publicKeyHashGenerator = sinon.spy(function () {
      return new Buffer(20)
    })

    this._contractGenerator = sinon.spy(function () {
      return ControlledPromise()
    })
}

function fixtureToAddedToSessionInput (fixture) {
  return [
    'addedToSession',
    new Mocks.MockJSNodeTorrent(fixture)
  ]
}

function fixtureToCheckFinishedInput(fix) {

    if(fix.isFullyDownloaded === undefined)
        throw new Error('isFullyDownloaded undefined')

    return 'checkFinished'
}

function fixtureToTerminateInput(fix) {

    if(fix.generateResumeData === undefined)
        throw new Error('generateResumeData undefined')

    return [
        'terminate',
        fix.generateResumeData
    ]
}

/// Move this onto Basemachine later?

function handleSequence(machine, client) {

    // arguments[2,...] : String, for subroutine, array with params, for function call

    for(var i = 2;i < arguments.length;i++)
        SubmitEventToBasemachine(machine, client, arguments[i])
}

function SubmitEventToBasemachine(machine, client, input) {

    if(typeof input === 'string')
        machine.queuedHandle(client, input)
    else if(input instanceof Array) // === 'array'
        machine.queuedHandle.apply(machine, [client].concat(input))
    else
        throw new Error('Bad event type passed')
}
