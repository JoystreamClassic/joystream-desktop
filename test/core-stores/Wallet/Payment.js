import PaymentStore from '../../../src/core-stores/Wallet/PaymentStore'
import {assert} from 'chai'

const createInitialValues = () => {
  return {
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
}

describe('Payment Store', function () {
  let initialValues, paymentStore

  beforeEach(function () {
    initialValues = createInitialValues()
    paymentStore = new PaymentStore(initialValues)
  })

  it('constructor initializes observables', function () {
    function checkInitialValue (store, valuesMap, observableName) {
      assert.deepEqual(store[observableName], valuesMap[observableName])
    }

    const check = checkInitialValue.bind(null, paymentStore, initialValues)

    const observables = [
      'type', 'txId', 'outputIndex', 'seenDate', 'minedDate', 'toAddress',
      'amount', 'fee', 'confirmed', 'blockIdOfBlockHoldingTransaction',
      'blockHeightOfBlockHoldingTransaction', 'note'
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
      ['setType', 'type'],
      ['setTxId', 'txId'],
      ['setOutputIndex', 'outputIndex'],
      ['setSeenDate', 'seenDate'],
      ['setMinedDate', 'minedDate'],
      ['setToAddress', 'toAddress'],
      ['setAmount', 'amount'],
      ['setFee', 'fee'],
      ['setConfirmed', 'confirmed'],
      ['setBlockIdOfBlockHoldingTransaction', 'blockIdOfBlockHoldingTransaction'],
      ['setBlockHeightOfBlockHoldingTransaction', 'blockHeightOfBlockHoldingTransaction'],
      ['setNote', 'note']
    ])

    actionToObvservableMap.forEach(function (observableName, actionName) {
      it(actionName, function () {
        testActionSetsObservable(paymentStore, actionName, observableName, 'testValue')
      })
    })
  })
})
