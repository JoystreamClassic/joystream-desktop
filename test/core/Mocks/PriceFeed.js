/**
 * Created by bedeho on 15/03/2018.
 */

import EventEmitter from 'events'
import sinon from 'sinon'

class MockPriceFeed extends EventEmitter {

  /**
   * @property {PriceFeed.STATE} state of the feed
   */
  state

  /**
   * @property {Number} Dollar value of one full coin (e.g. 1 btc, not sats)
   */
  cryptoToUsdExchangeRate

  /**
   * Constructor
   * @param cryptoToUsdExchangeRate {Number} initial exchange rate
   * @param exchangeRateFetcher {Func}
   */
  constructor(cryptoToUsdExchangeRate, start = sinon.spy(), stop = sinon.spy()) {

    super()

    this.cryptoToUsdExchangeRate = cryptoToUsdExchangeRate

    this.start = start
    this.stop = stop
  }

  updateCryptoExchangeRate(rate) {
    this.cryptoToUsdExchangeRate = rate
    this.emit('tick', rate)
  }

  error(err) {
    this.emit('error', err)
  }


}

export default MockPriceFeed
