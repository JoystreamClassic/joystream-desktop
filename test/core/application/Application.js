var expect = require('chai').expect
import sinon from 'sinon'
import os from 'os'
import fs from 'fs'
import rimraf from 'rimraf'
import path from 'path'

import Application from '../../../src/core/Application'
import DeepInitialState from '../../../src/core/Torrent/Statemachine/DeepInitialState'
import { TorrentInfo } from 'joystream-node'

const buyerTerms = {
  maxPrice: 20,
  maxLock: 5,
  minNumberOfSellers: 1,
  maxContractFeePerKb: 2000
}

const sellerTerms = {
  minPrice: 20,
  minLock: 1,
  maxNumberOfSellers: 5,
  minContractFeePerKb: 2000,
  settlementFee: 2000
}

describe('Application', function() {

  describe('normal cycle', function() {

    let application = null
    let coinGetter = sinon.spy()

    afterEach(function() {

      /**
       * Since we add state assertions on application events,
       * we have to make sure to drop them after each test.
       */
      application.removeAllListeners()
    })

    it('create', function() {

      application = new Application([], false, false, coinGetter)

      expect(application.state).to.be.equal(Application.STATE.STOPPED)

    })

    it('start', function(done) {

      // Adjust timeout, starting the app takes time
      this.timeout(10000)

      let appDirectory = path.join(os.tmpdir(), '.joystream-test')

      // Reset directory
      resetDirectory(appDirectory)


      let config = {
        network: 'testnet',
        assistedPeerDiscovery: false,
        bitTorrentPort: 0
      }

      let startedResourcesEvents = new Set()

      application.on('resourceStarted', (resource) => {

        startedResourcesEvents.add(resource)

        areWeDone()
      })

      let startedEvent = false

      application.on('started', () => {
        startedEvent = true

        expect(application.state).to.be.equal(Application.STATE.STARTED)

        expect(startedResourcesEvents.size).to.be.equal(Application.NUMBER_OF_RESOURCE_TYPES)

        areWeDone()
      })

      let startingEvent = false

      application.on('starting', () => {
        startingEvent = true


        expect(application.state).to.be.equal(Application.STATE.STARTING)

        areWeDone()
      })

      let callbackCalled = false
      application.start(config, appDirectory, () => {

        callbackCalled = true

        areWeDone()
      })


      function areWeDone() {

        if(startingEvent && startedEvent && callbackCalled)
          done()

      }

    })

    let torrentName = 'tears-of-steel'
    let torrentInfo = loadTorrentInfoFixture(torrentName + '.torrent')

    const infoHash = torrentInfo.infoHash()

    let savePath = path.join(os.tmpdir(), torrentName)

    // Prepare savepath
    resetDirectory(savePath)

    let settings = {
      infoHash : infoHash,
      metadata : torrentInfo,
      resumeData : null,
      name: torrentInfo.name() || infoHash,
      savePath: savePath,
      deepInitialState: DeepInitialState.DOWNLOADING.UNPAID.STARTED,
      extensionSettings : {
        buyerTerms: buyerTerms
      }
    }

    it('add torrent successfully', function(done) {

      // Adjust timeout, starting the app takes time
      this.timeout(5000)

      let torrentAddedEventEmitted = false

      application.on('torrentAdded', (torrent) => {

        torrentAddedEventEmitted = true

        expect(torrent.infoHash).to.be.equal(settings.infoHash)

        areWeDone()

      })

      let addTorrentCallbackMade = false

      let torrentLoadedEventEmitted = false

      application.addTorrent(settings, (err, torrent) => {

        expect(err).to.be.null

        addTorrentCallbackMade = true

        // Make sure torrent matches
        expect(torrent.infoHash).to.be.equal(settings.infoHash)

        // and that it was actually added
        expect(application.torrents.get(torrent.infoHash)).to.be.equal(torrent)

        torrent.once('loaded', (deepInitialState) => {

          torrentLoadedEventEmitted = true

          // Make sure we started in right state
          expect(deepInitialState).to.be.equal(settings.deepInitialState)

          // and check other public values
          expect(torrent.torrentInfo).to.deep.equal(settings.metadata)

          areWeDone()

        })

        areWeDone()

      })

      function areWeDone() {

        if(torrentAddedEventEmitted &&
          addTorrentCallbackMade &&
          torrentLoadedEventEmitted)
          done()

      }

    })

    it('fail to add duplicate torrent', (done) => {

      application.addTorrent(settings, (err, torrent) => {

        expect(err).to.equal('Torrent already added')

        done()

      })

    })

    it('remove torrent', function(done) {

      let torrentRemovedEventEmitted = false
      application.on('torrentRemoved', (infoHash) => {

        torrentRemovedEventEmitted = true

        expect(infoHash).to.be.equal(settings.infoHash)

        areWeDone()

      })

      let removeTorrentCallbackCalled = false
      application.removeTorrent(settings.infoHash, false, (err) => {

        removeTorrentCallbackCalled = true

        // no error
        expect(err).to.be.null

        // torrent is gone
        expect(application.torrents.has(settings.infoHash)).to.be.false

        areWeDone()

      })

      function areWeDone() {

        if(torrentRemovedEventEmitted && removeTorrentCallbackCalled)
          done()

      }

    })

    it('cannot remove non-existent torrent', function(done) {

      // TBD

      //'No torrent added corresponding to given hash'

      done()
    })

    it('add new torrent to be persisted', function(done) {

      let torrentName = 'sintel'

      // Create settings for new torrent
      let torrentInfo = loadTorrentInfoFixture(torrentName + '.torrent')

      let savePath = path.join(os.tmpdir(), torrentName)

      // Prepare savepath
      resetDirectory(savePath)

      let settings = {
        infoHash : torrentInfo.infoHash(),
        metadata : torrentInfo,
        resumeData : null,
        name: torrentInfo.name(),
        savePath: savePath,
        deepInitialState: DeepInitialState.DOWNLOADING.UNPAID.STARTED,
        extensionSettings : {
          buyerTerms: buyerTerms
        }
      }

      // Add to session
      application.addTorrent(settings, (err, torrent) => {

        expect(err).to.be.null

        done()

      })

    })

    it('can claim free coins from faucet', function() {

      application.claimFreeBCH()

      // Make sure that coin fetcher was called once, with
      // a normal address
      expect(coinGetter.calledOnce).to.be.true

    })

    it('stop', function(done) {

      // Adjust timeout, starting the app takes time
      this.timeout(5000)

      let stoppingEventEmitted = false
      application.on('stopping', () => {

        stoppingEventEmitted = true

        // make sure we are currently stopping
        expect(application.state).to.be.equal(Application.STATE.STOPPING)

        areWeDone()

      })

      let resourceStoppedEvents = new Set()
      application.on('resourceStopped', (resource) => {

        resourceStoppedEvents.add(resource)

      })

      let stoppedEventEmitted = false
      application.on('stopped', () => {

        stoppedEventEmitted = true

        expect(application.state).to.be.equal(Application.STATE.STOPPED)
        expect(resourceStoppedEvents.size).to.be.equal(Application.NUMBER_OF_RESOURCE_TYPES)

        areWeDone()

      })

      let stopCallbackMade = false
      application.stop(() => {

        stopCallbackMade = true

        expect(application.state).to.be.equal(Application.STATE.STOPPED)

        areWeDone()

      })

      function areWeDone() {

        if(stoppingEventEmitted &&
          stoppingEventEmitted &&
          stopCallbackMade)
          done()

      }

    })

    it('starting new app, loading same persisted torrents', function(done) {

      // TBD

      done()
    })

  })

})

function loadTorrentInfoFixture(filename) {

  let data = fs.readFileSync('src/assets/torrents/' + filename)

  return new TorrentInfo(data)
}

function resetDirectory(directory) {

  // If an old directory exists, we delete it,
  // to give a fresh start
  if(fs.existsSync(directory)) {
    rimraf.sync(directory)
  }

  // Create fresh directory
  fs.mkdirSync(directory)
}
