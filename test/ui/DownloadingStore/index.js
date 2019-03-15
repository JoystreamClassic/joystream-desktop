import DownloadingStore from '../../../src/scenes/Downloading/Stores/'
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
    state: 'Active.DownloadIncomplete'
  })

  map.set(infoHash, new TorrentTableRowStore(torrentStore, mockUIStore))

  store.setRowStorefromTorrentInfoHash(map)
}

describe('DownloadingStore', function () {
  let downloadingStore
  const infoHash1 = 'infoHash-1'

  beforeEach(function () {
    downloadingStore = new DownloadingStore(mockUIStore)
  })

  it('constructor initializes empty infoHash to TorrentTableRowStore map', function () {
    assert.equal(downloadingStore.torrentRowStores.length, 0)
    assert.equal(downloadingStore.state, DownloadingStore.STATE.InitState)
  })

  describe('addTorrentStore', function () {
    it('adds new torrent row store to map', function () {
      const newTorrentStore = new TorrentStore({ infoHash: 'infohash-2', state: 'Active.DownloadIncomplete' })

      let numberOfTorrentStores = downloadingStore.torrentRowStores.length

      downloadingStore.addTorrentStore(newTorrentStore)

      assert.equal(downloadingStore.torrentRowStores.length, numberOfTorrentStores + 1)

      const addedRowStore = downloadingStore.torrentRowStores.slice(-1).pop()

      assert(addedRowStore instanceof TorrentTableRowStore)

      assert(downloadingStore.rowStorefromTorrentInfoHash.has(newTorrentStore.infoHash))
      assert.deepEqual(downloadingStore.rowStorefromTorrentInfoHash.get(newTorrentStore.infoHash), addedRowStore)
    })

    it('throws if duplicate infoHash', function () {
      initStoreWithOneTorrent(downloadingStore, infoHash1)
      const duplicateTorrentStore = {infoHash: infoHash1}

      assert.throws(function () {
        downloadingStore.addTorrentStore(duplicateTorrentStore)
      })
    })
  })

  describe('removeTorrentStore', function () {
    it('removes store from map', function () {
      initStoreWithOneTorrent(downloadingStore, infoHash1)
      assert(downloadingStore.rowStorefromTorrentInfoHash.has(infoHash1))
      downloadingStore.removeTorrentStore(infoHash1)
      assert(!downloadingStore.rowStorefromTorrentInfoHash.has(infoHash1))
    })

    it('throws on removing store which does not exist', function () {
      assert.throws(function () {
        downloadingStore.removeTorrentStore('infohash-2')
      })
    })
  })
})
