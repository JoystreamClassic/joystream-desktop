import WalletStore from '../../../src/core-stores/Wallet/WalletStore'
import PaymentStore from '../../../src/core-stores/Wallet/PaymentStore'

import {assert} from 'chai'
var PromiseMock = require('promise-mock')

var sinon = require('sinon')
var ControlledPromise = require('../../util/controlled_promise')

const createInitialValues = () => {
  // (state, totalBalance, confirmedBalance, receiveAddress, blockTipHeight, synchronizedBlockHeight, paymentStores, pay)
  return [
    'a',
    100,
    50,
    '1abcakjhf',
    10000,
    500,
    [1, 2],
    sinon.spy(function () {
      return ControlledPromise()
    })
  ]
}

describe('Wallet Store', function () {
  let initialValues, walletStore

  beforeEach(function () {
    initialValues = createInitialValues()
    walletStore = new WalletStore(...initialValues)
  })

  it('constructor initializes observables', function () {

    assert.equal(walletStore.state, initialValues[0])
    assert.equal(walletStore.totalBalance, initialValues[1])
    assert.equal(walletStore.confirmedBalance, initialValues[2])
    assert.equal(walletStore.receiveAddress, initialValues[3])
    assert.equal(walletStore.blockTipHeight, initialValues[4])
    assert.equal(walletStore.synchronizedBlockHeight, initialValues[5])
    assert.equal(walletStore.paymentStores.length, initialValues[6].length)

  })

  describe('pay', function() {
    beforeEach(function () {
      PromiseMock.install()
    })

    afterEach(function () {
      PromiseMock.uninstall()
    })

    it('invokes user supplied pay function', function () {
      const payment = {
        type: 0,
        txId: 1,
        outputIndex: 2,
        seenDate: 3,
        minedDate: 4,
        toAddress: 5,
        amount: 6,
        fee: 7,
        confirmed: 8,
        blockIdOfBlockHoldingTransaction: 9,
        blockHeightOfBlockHoldingTransaction: 10,
        note: 11
      }

      // user supplied pay function which actually makes payments
      const pay = initialValues[7]

      const numPaymentStores = walletStore.paymentStores.length

      assert(!pay.called)

      let paymentStorePromise = walletStore.pay('hash', 1, 10, 'note')

      assert(pay.called)

      pay.returnValues[0].resolve(payment)

      // a payment store is created
      walletStore.addPaymentStore(new PaymentStore(payment))

      Promise.runAll()

      // pay method returns a new payment store from the payment
      assert.deepEqual(PromiseMock.getResult(paymentStorePromise), payment)

      // ... and adds the new payment store to the array of paymentStores
      assert.equal(walletStore.paymentStores.length, numPaymentStores + 1)
      assert.deepEqual(walletStore.paymentStores[numPaymentStores], payment)

    })

  })
})
