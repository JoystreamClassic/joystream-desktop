import WalletSceneStore from '../../../src/scenes/Wallet/Stores/WalletSceneStore'

var assert = require('chai').assert
var sinon = require('sinon')

import bcoin from 'bcoin'

const createInitialValues = () => {
  return [
    {}, // walletStore
    {}, // priceFeedStore
    5000, // satsPrkBFee
    {}, // visibleDialog
    'abc', // searchString
    sinon.spy(), // launchExternalTxViewer,
    sinon.spy(), // claimFreeBCHAttemptHandler,
    bcoin.protocol.consensus.COIN // numberOfUnitsPerCoin
  ]
}

describe('WalletSceneStore', function () {
  let initialValues, walletSceneStore

  beforeEach(function () {
    initialValues = createInitialValues()
    walletSceneStore = new WalletSceneStore(...initialValues)
  })

  it('constructor', function () {
    assert.deepEqual(walletSceneStore.visibleDialog, initialValues[3])
    assert.deepEqual(walletSceneStore.searchString, initialValues[4])
  })
})
