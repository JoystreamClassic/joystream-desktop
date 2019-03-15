import PeerStore from '../../../src/core-stores/Peer'

var assert = require('chai').assert
var sinon = require('sinon')


describe('Peer Store', function () {

  describe('constructor initializes observables', function () {
    it('initializes observables', function () {
      const state = 'a'
      const pid = '0'
      const status = {a: 1, b: 2}

      const peerStore = new PeerStore(pid, state, status)

      assert.deepEqual(peerStore.peerId, pid)
      assert.deepEqual(peerStore.state, state)
      assert.deepEqual(peerStore.peerPluginStatus, status)
    })
  })

  describe('actions', function () {
    it('setState', function () {
      const peerStore = new PeerStore()
      let value = 'a'
      peerStore.setState(value)

      assert.equal(peerStore.state, value)

      value = 'b'
      peerStore.setState(value)

      assert.equal(peerStore.state, value)
    })

    it('setPeerPluginStatus', function () {
      const peerStore = new PeerStore()
      let value = 'a'
      peerStore.setPeerPluginStatus(value)

      assert.equal(peerStore.peerPluginStatus, value)

      value = 'b'
      peerStore.setPeerPluginStatus(value)

      assert.equal(peerStore.peerPluginStatus, value)
    })
  })

  describe('computed values', function () {
    // tests for computed values
  })

})
