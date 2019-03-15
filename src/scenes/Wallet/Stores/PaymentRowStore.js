/**
 * Created by bedeho on 06/12/2017.
 */

import {observable, action, runInAction, computed} from 'mobx'

class PaymentRowStore {

  /**
   * @property {PaymentStore} Store for this
   */
  paymentStore

  constructor(paymentStore, priceFeedStore, numberOfUnitsPerCoin, viewPayment) {
    this.paymentStore = paymentStore
    this._priceFeedStore = priceFeedStore
    this._numberOfUnitsPerCoin = numberOfUnitsPerCoin
    this._viewPayment = viewPayment
  }

  @computed get
  date() {

    // If the transaction is confirmed, we used the
    // mined time, otherwise we use the observation time.

    let date

    if(this.paymentStore.confirmed)
      date = this.paymentStore.minedDate
    else
      date = this.paymentStore.seenDate

    return date
  }

  /**
   * {Number} Balance in relevant fiat currency
   */
  @computed get
  amountInFiat() {

    let balance = this.paymentStore.amount
    let cryptoToUsdExchangeRate = this._priceFeedStore.cryptoToUsdExchangeRate

    return ((balance * cryptoToUsdExchangeRate) / this._numberOfUnitsPerCoin)
  }

  click() {
    this._viewPayment(this.paymentStore.txId, this.paymentStore.outputIndex)
  }

}

export default PaymentRowStore
