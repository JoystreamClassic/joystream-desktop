import TorrentStore from '../../../src/core-stores/Torrent'

var assert = require('chai').assert
var sinon = require('sinon')

const createInitialValues = () => {
  return {
    infoHash: 'abc',
    name: 'torrent.name',
    savePath: 'path',
    state: 1,
    totalSize: 100,
    progress: 50,
    viabilityOfPaidDownloadInSwarm : new Object(),
    downloadedSize: 50,
    downloadSpeed: 15,
    uploadSpeed: 5,
    uploadedTotal: 0,
    numberOfSeeders: 2,
    sellerTerms: 'seller_terms',
    buyerTerms: 'buyer_terms',
    numberOfPiecesSoldAsSeller: 0,
    totalRevenueFromPiecesAsSeller: 0,
    totalSpendingOnPiecesAsBuyer: 0,
    starter: sinon.spy(),
    stopper: sinon.spy(),
    paidDownloadStarter: sinon.spy(),
    uploadBeginner: sinon.spy(),
    uploadStopper: sinon.spy()
  }
}

describe('Torrent Store', function () {
  let initialValues, torrentStore

  beforeEach(function () {
    initialValues = createInitialValues()
    torrentStore = new TorrentStore(initialValues)
  })

  it('constructor initializes observables', function () {
    function checkInitialValue (store, valuesMap, observableName) {
      assert.deepEqual(store[observableName], valuesMap[observableName])
    }

    const check = checkInitialValue.bind(null, torrentStore, initialValues)

    const observables = [
      'infoHash', 'name', 'savePath', 'state', 'totalSize', 'progress', 'viabilityOfPaidDownloadInSwarm',
      'downloadedSize', 'downloadSpeed', 'uploadSpeed', 'uploadedTotal',
      'numberOfSeeders', 'sellerTerms', 'buyerTerms', 'numberOfPiecesSoldAsSeller',
      'totalRevenueFromPiecesAsSeller', 'totalSpendingOnPiecesAsBuyer'
    ]

    observables.forEach(function (observableName) {
      check(observableName)
    })
  })

  describe('actions', function () {
    function testActionSetsObservable (store, actionName, observableName, value) {
      store[actionName](value)
      assert.equal(store[observableName], value)
    }

    const actionToObvservableMap = new Map([
      ['setInfoHash', 'infoHash'],
      ['setState', 'state'],
      ['setName', 'name'],
      ['setTotalSize', 'totalSize'],
      ['setDownloadedSize', 'downloadedSize'],
      ['setDownloadSpeed', 'downloadSpeed'],
      ['setUploadSpeed', 'uploadSpeed'],
      ['setUploadedTotal', 'uploadedTotal'],
      ['setNumberOfSeeders', 'numberOfSeeders'],
      ['setProgress', 'progress'],
      ['setViabilityOfPaidDownloadInSwarm', 'viabilityOfPaidDownloadInSwarm'],
      ['setTorrentFiles', 'torrentFiles'],
      ['setSellerTerms', 'sellerTerms'],
      ['setNumberOfPiecesSoldAsSeller', 'numberOfPiecesSoldAsSeller'],
      ['setTotalRevenueFromPiecesAsSeller', 'totalRevenueFromPiecesAsSeller'],
      ['setBuyerTerms', 'buyerTerms'],
      ['setTotalSpendingOnPiecesAsBuyer', 'totalSpendingOnPiecesAsBuyer']
    ])

    actionToObvservableMap.forEach(function (observableName, actionName) {
      it(actionName, function () {
        testActionSetsObservable(torrentStore, actionName, observableName, 'testValue')
      })
    })

  })

  describe('computed values', function () {
    it('isDownloading', function () {
      torrentStore.setState('Active.DownloadIncomplete')
      assert(torrentStore.isDownloading)
      assert(!torrentStore.isFullyDownloaded)
    })

    it('isFullyDownloaded', function () {
      torrentStore.setState('Active.FinishedDownloading')
      assert(torrentStore.isFullyDownloaded)
      assert(!torrentStore.isDownloading)
    })

    it('isUploading', function () {
      torrentStore.setState('Active.FinishedDownloading.Uploading')
      assert(torrentStore.isUploading)
      assert(!torrentStore.isDownloading)
    })
  })

  describe('starters and stoppers', function () {
    it('start', function () {
      assert(!initialValues.starter.called)
      torrentStore.start()
      assert(initialValues.starter.called)
    })

    it('stop', function () {
      assert(!initialValues.stopper.called)
      torrentStore.stop()
      assert(initialValues.stopper.called)
    })

    it('startPaidDownload', function () {
      assert(!initialValues.paidDownloadStarter.called)
      torrentStore.startPaidDownload()
      assert(initialValues.paidDownloadStarter.called)
    })

    it('beginUploading', function () {
      assert(!initialValues.uploadBeginner.called)
      torrentStore.beginUploading()
      assert(initialValues.uploadBeginner.called)
    })

    it('endUploading', function () {
      assert(!initialValues.uploadStopper.called)
      torrentStore.endUploading()
      assert(initialValues.uploadStopper.called)
    })

  })

})
