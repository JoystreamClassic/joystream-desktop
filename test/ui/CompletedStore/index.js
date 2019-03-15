import CompletedStore from '../../../src/scenes/Completed/Stores/'
import TorrentTableRowStore from '../../../src/scenes/Common/TorrentTableRowStore'
import TorrentStore from '../../../src/core-stores/Torrent'

var assert = require('chai').assert

const mockUIStore = {
  applicationStore: {
    walletStore: {}
  }
}

function initStoreWithOneTorrent (store, infoHash) {
  const map = new Map()

  const torrentStore = new TorrentStore({
    infoHash: infoHash,
    state: 'Active.FinishedDownloading'
  })

  map.set(infoHash, new TorrentTableRowStore(torrentStore, mockUIStore))

  store.setRowStorefromTorrentInfoHash(map)
}

describe('CompletedStore', function () {
  let completedStore
  const infoHash1 = 'infoHash-1'

  beforeEach(function () {
    completedStore = new CompletedStore(mockUIStore)
  })

  it('constructor initializes empty infoHash to TorrentTableRowStore map', function () {
    assert.equal(completedStore.torrentRowStores.length, 0)
  })

  describe('addTorrentStore', function () {
    it('adds new torrent row store to map', function () {
      const newTorrentStore = new TorrentStore({ infoHash: 'infohash-2', state: 'Active.FinishedDownloading' })

      let numberOfTorrentStores = completedStore.torrentRowStores.length

      completedStore.addTorrentStore(newTorrentStore)

      assert.equal(completedStore.torrentRowStores.length, numberOfTorrentStores + 1)

      const addedRowStore = completedStore.torrentRowStores.slice(-1).pop()

      assert(addedRowStore instanceof TorrentTableRowStore)

      assert(completedStore.rowStorefromTorrentInfoHash.has(newTorrentStore.infoHash))
      assert.deepEqual(completedStore.rowStorefromTorrentInfoHash.get(newTorrentStore.infoHash), addedRowStore)
    })

    it('throws if duplicate infoHash', function () {
      initStoreWithOneTorrent(completedStore, infoHash1)

      const duplicateTorrentStore = {infoHash: infoHash1}

      assert.throws(function () {
        completedStore.addTorrentStore(duplicateTorrentStore)
      })
    })
  })

  describe('removeTorrentStore', function () {
    it('removes store from map', function () {
      initStoreWithOneTorrent(completedStore, infoHash1)

      assert(completedStore.rowStorefromTorrentInfoHash.has(infoHash1))
      completedStore.removeTorrentStore(infoHash1)
      assert(!completedStore.rowStorefromTorrentInfoHash.has(infoHash1))
    })

    it('throws on removing store which does not exist', function () {
      assert.throws(function () {
        completedStore.removeTorrentStore('infohash-2')
      })
    })
  })
})
