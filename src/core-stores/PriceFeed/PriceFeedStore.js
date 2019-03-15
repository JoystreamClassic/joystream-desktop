/**
 * Created by bedeho on 20/12/2017.
 */

import {observable, action} from 'mobx'

class PriceFeedStore {

  /**
   * {Number} Dollar value of one full coin (e.g. 1 btc, not sats)
   */
  @observable cryptoToUsdExchangeRate

  /**
   * Constructor
   * @param cryptoToUsdExchangeRate {Number} - initial exchangerate
   */
  constructor(cryptoToUsdExchangeRate) {
    this.setCryptoToUsdExchangeRate(cryptoToUsdExchangeRate)
  }

  @action.bound
  setCryptoToUsdExchangeRate(cryptoToUsdExchangeRate) {
    this.cryptoToUsdExchangeRate = cryptoToUsdExchangeRate
  }


}

export default PriceFeedStore