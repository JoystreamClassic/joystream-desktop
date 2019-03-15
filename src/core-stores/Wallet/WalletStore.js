/**
 * Created by bedeho on 06/11/2017.
 */

import {observable, action, computed} from 'mobx'

import PaymentStore from './PaymentStore'

import bcoin from 'bcoin'
import assert from 'assert'

class WalletStore {

  /**
   * {Wallet.STATE} Status of the wallet store
   */
  @observable state

  /**
   * {Amount}
   */
  @observable totalBalance

  /**
   * {Amount}
   */
  @observable confirmedBalance

  /**
   * {Address} Current receive address for wallet
   */
  @observable receiveAddress

  /**
   * {Number}
   */
  @observable blockTipHeight

  /**
   * {Number}
   */
  @observable synchronizedBlockHeight

  /**
   * {Array.<PaymentStore>} Payment stores for all payments
   */
  @observable paymentStores

  /**
   * {Object} HD master key object of wallet,
   * see `Wallet.getMasterKey` for when this is set
   */
  @observable masterKey

  constructor(state, totalBalance, confirmedBalance, receiveAddress, blockTipHeight, synchronizedBlockHeight, paymentStores, pay, masterKey) {

    this.setState(state)
    this.setTotalBalance(totalBalance)
    this.setConfirmedBalance(confirmedBalance)
    this.setReceiveAddress(receiveAddress)
    this.setBlockTipHeight(blockTipHeight)
    this.setSynchronizedBlockHeight(synchronizedBlockHeight)
    this.paymentStores = paymentStores

    this._pay = pay
    this._pendingPaymnetStoreResolvers = new Map()
    this.setMasterKey(masterKey)

  }

  @action.bound
  addPaymentStore (paymentStore) {
    this.paymentStores.push(paymentStore)

    // resolve pending promises
    const paymentId = paymentStore.txId + ':' + paymentStore.outputIndex
    const resolver = this._pendingPaymnetStoreResolvers.get(paymentId)

    if (resolver) {
      this._pendingPaymnetStoreResolvers.delete(paymentId)
      resolver(paymentStore)
    }
  }


  _awaitPaymentStoreAddition (payment) {
    const paymentId = payment.txId + ':' + payment.outputIndex

    return new Promise((resolve) => {
      this._pendingPaymnetStoreResolvers.set(paymentId, resolve)
    })
  }

  @action.bound
  setState(state) {
    this.state = state
  }

  @action.bound
  setTotalBalance(totalBalance) {
    this.totalBalance = totalBalance
  }

  @action.bound
  setConfirmedBalance(confirmedBalance) {
    this.confirmedBalance = confirmedBalance
  }

  @action.bound
  setReceiveAddress(receiveAddress) {
    this.receiveAddress = receiveAddress
  }

  @action.bound
  setBlockTipHeight(blockTipHeight) {
    this.blockTipHeight = blockTipHeight
  }

  @action.bound
  setSynchronizedBlockHeight(synchronizedBlockHeight) {
    this.synchronizedBlockHeight = synchronizedBlockHeight
  }

  @action.bound
  setMasterKey(masterKey) {
    this.masterKey = masterKey
  }

  /**
   * Make a payment
   * @param {bcoin.Address} address - for destination
   * @param {Number} amount - number of satoshis
   * @param {Number} satsPrkBFee - number of satoshis per kB.
   * @param {String} note - note to be attached to the payment
   * @returns {Promise} - Returns {@link PaymentStore}
   */
  @action.bound
  async pay(address, amount, satsPrkBFee, note) {

    if(!bcoin.util.isNumber(satsPrkBFee))
      throw new Error('satsPrkBFee is not a valid number')

    // Pay
    let payment = await this._pay(address, amount, satsPrkBFee, note)

    // By the time we get here the a paymentStore may have already been added to this.paymentStores,
    // return it if found.
    let paymentStore = this.paymentStores.find(function (store) {
      return store.txId === payment.txId && store.outputIndex === payment.outputIndex
    })

    if (paymentStore) return paymentStore

    paymentStore = await this._awaitPaymentStoreAddition(payment)

    return paymentStore
  }

}

export default WalletStore
