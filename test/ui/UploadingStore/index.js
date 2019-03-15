import UploadingStore from '../../../src/scenes/Seeding/Stores/'
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
    state: 'Active.FinishedDownloading.Uploading'
  })

  map.set(infoHash, new TorrentTableRowStore(torrentStore, mockUIStore))

  store.setRowStorefromTorrentInfoHash(map)
}

describe('UploadingStore', function () {
  let uploadingStore
  const infoHash1 = 'infoHash-1'

  beforeEach(function () {
    uploadingStore = new UploadingStore(mockUIStore)
  })

  it('constructor initializes empty infoHash to TorrentTableRowStore map', function () {
    assert.equal(uploadingStore.torrentRowStores.length, 0)
    assert.equal(uploadingStore.state, UploadingStore.STATE.InitState)
  })

  describe('addTorrentStore', function () {
    it('adds new torrent row store to map', function () {
      const newTorrentStore = new TorrentStore({ infoHash: 'infohash-2', state:'Active.FinishedDownloading.Uploading' })

      let numberOfTorrentStores = uploadingStore.torrentRowStores.length

      uploadingStore.addTorrentStore(newTorrentStore)

      assert.equal(uploadingStore.torrentRowStores.length, numberOfTorrentStores + 1)

      const addedRowStore = uploadingStore.torrentRowStores.slice(-1).pop()

      assert(addedRowStore instanceof TorrentTableRowStore)

      assert(uploadingStore.rowStorefromTorrentInfoHash.has(newTorrentStore.infoHash))
      assert.deepEqual(uploadingStore.rowStorefromTorrentInfoHash.get(newTorrentStore.infoHash), addedRowStore)
    })

    it('throws if duplicate infoHash', function () {
      initStoreWithOneTorrent(uploadingStore, infoHash1)
      const duplicateTorrentStore = {infoHash: infoHash1}

      assert.throws(function () {
        uploadingStore.addTorrentStore(duplicateTorrentStore)
      })
    })
  })

  describe('removeTorrentStore', function () {
    it('removes store from map', function () {
      initStoreWithOneTorrent(uploadingStore, infoHash1)
      assert(uploadingStore.rowStorefromTorrentInfoHash.has(infoHash1))
      uploadingStore.removeTorrentStore(infoHash1)
      assert(!uploadingStore.rowStorefromTorrentInfoHash.has(infoHash1))
    })

    it('throws on removing store which does not exist', function () {
      assert.throws(function () {
        uploadingStore.removeTorrentStore('infohash-2')
      })
    })
  })
})
