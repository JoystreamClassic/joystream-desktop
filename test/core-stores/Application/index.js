import ApplicationStore from '../../../src/core-stores/Application'

var assert = require('chai').assert
var sinon = require('sinon')

const createInitialValues = () => {
  return {
    state: '0',
    startedResources: new Set(),
    onboardingTorrents: ['a', 'b', 'c'],
    onboardingIsEnabled: true,
    applicationSettingsStore: {'a': 1},
    walletStore: {'b': 2},
    priceFeedStore: {'c': 3},
    starter: sinon.spy(),
    stopper: sinon.spy(),
    torrentAdder: sinon.spy(),
    torrentRemover: sinon.spy()
  }
}

describe('Application Store', function () {

  let initialValues, constructorArgs, applicationStore

  beforeEach(function () {
    initialValues = createInitialValues()
    applicationStore = new ApplicationStore(initialValues)
  })

  describe('constructor', function () {
    it('initializes observables', function () {
      // checks public observale value on store matches initial values
      function checkInitialValue (store, valuesMap, observableName) {
        assert.deepEqual(store[observableName], valuesMap[observableName])
      }

      const check = checkInitialValue.bind(null, applicationStore, initialValues)

      check('state')
      check('startedResources')
      check('onboardingTorrents')
      check('onboardingIsEnabled')
      check('applicationSettingsStore')
      check('walletStore')
      check('priceFeedStore')
    })
  })

  describe('actions', function () {
    it('setState', function () {
      let value = 'newstate'
      applicationStore.setState(value)
      assert.equal(applicationStore.state, value)

      value = 'anotherstate'
      applicationStore.setState(value)
      assert.equal(applicationStore.state, value)
    })

    it('setStartedResources', function () {
      let value = new Set([1, 2, 3])
      applicationStore.setStartedResources(value)
      assert.deepEqual(applicationStore.startedResources, value)

      value = new Set([4, 5, 6])
      applicationStore.setStartedResources(value)
      assert.deepEqual(applicationStore.startedResources, value)
    })

    it('setOnboardingIsEnabled', function () {
      let value = true
      applicationStore.setOnboardingIsEnabled(value)
      assert.equal(applicationStore.onboardingIsEnabled, value)

      value = false
      applicationStore.setOnboardingIsEnabled(value)
      assert.equal(applicationStore.onboardingIsEnabled, value)
    })

    it('start', function () {
      applicationStore.start()

      assert(initialValues.starter.called)
    })

    it('stop', function () {
      applicationStore.stop()

      assert(initialValues.stopper.called)
    })

    it('addTorrent', function () {
      const settings = 'abc'
      const callback = sinon.spy()

      applicationStore.addTorrent(settings, callback)

      const adder = initialValues.torrentAdder
      assert(adder.called)
      assert.equal(adder.getCall(0).args[0], settings)
    })

    it('removeTorrent', function () {
      const infoHash = '123'
      const deleteData = false
      const callback = sinon.spy()
      applicationStore.removeTorrent(infoHash, deleteData, callback)

      const remover = initialValues.torrentRemover
      assert(remover.called)
      assert.equal(remover.getCall(0).args[0], infoHash)
      assert.equal(remover.getCall(0).args[1], deleteData)
    })

    describe('onNewTorrentStore', function () {
      it('adds new torrent store to torrentStores', function () {
        const settings = 'abc'
        const callback = sinon.spy()

        applicationStore.addTorrent(settings, callback)

        const infoHash = 'xyz'

        assert(!applicationStore.torrentStores.has(infoHash))

        applicationStore.onNewTorrentStore({
          infoHash: infoHash
        })

        assert(applicationStore.torrentStores.has(infoHash))
      })

      it('invokes pending user callback', function () {
        const settings = {infoHash: 'abc'}
        const addedCallback = sinon.spy()

        applicationStore.addTorrent(settings, addedCallback)

        assert(!addedCallback.called)

        applicationStore.onNewTorrentStore({
          infoHash: settings.infoHash
        })

        assert(addedCallback.called)
      })

    })

    describe('onTorrentRemoved', function () {
      let infoHash, settings, addedCallback, removedCallback

      beforeEach(function () {
        infoHash = 'abc'
        settings = {infoHash: infoHash}
        addedCallback = sinon.spy()
        removedCallback = sinon.spy()

        applicationStore.addTorrent(settings, addedCallback)

        applicationStore.onNewTorrentStore({
          infoHash: infoHash
        })
      })

      it('removes torrent store', function () {
        assert(applicationStore.torrentStores.has(infoHash))

        applicationStore.removeTorrent(infoHash, false, removedCallback)

        applicationStore.onTorrentRemoved(infoHash)

        assert(!applicationStore.torrentStores.has(infoHash))
      })

      it('invokes pending callback', function () {
        assert(applicationStore.torrentStores.has(infoHash))

        applicationStore.removeTorrent(infoHash, false, removedCallback)

        assert(!removedCallback.called)

        applicationStore.onTorrentRemoved(infoHash)

        assert(removedCallback.called)
      })
    })

  })
})
