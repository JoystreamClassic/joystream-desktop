/**
 * Created by bedeho on 20/12/2017.
 */

// how to deal with cryptoToUsdExchangeRate from last run!
  // what about very first run???
import {EventEmitter} from 'events'

import assert from 'assert'

class PriceFeed extends EventEmitter {

  static STATE = {
    STOPPED: 0,
    STARTED: 2,
  }

  /**
   * @property {STATE} state of the feed
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
  constructor(cryptoToUsdExchangeRate, exchangeRateFetcher) {

    super()

    this.state = PriceFeed.STATE.STOPPED
    this.cryptoToUsdExchangeRate = cryptoToUsdExchangeRate
    this._exchangeRateFetcher = exchangeRateFetcher

    this.pollingIntervalId = null
  }

  /**
   * Start price feed.
   * Is only possible when the feed is stopped.
   * @param pollingPeriod {Number} Period between polls to feed provider
   */
  start(pollingPeriod) {

    if(this.state !== PriceFeed.STATE.STOPPED)
      throw Error('Can only start when stopped, currently not.')

    assert(!this.pollingIntervalId)

    this.pollingIntervalId = setInterval(() => { this._poll() }, pollingPeriod)

    this.state = PriceFeed.STATE.STARTED
    this.emit('state', this.state)

    // Make initial first call, in order to avoid
    // having to wait first full period to get initial
    // values
    this._poll()
  }

  /**
   * Stop
   */
  stop() {

    if(this.state !== PriceFeed.STATE.STARTED)
      throw Error('Can only stop when started, currently not.')

    assert(this.pollingIntervalId)

    clearInterval(this.pollingIntervalId)

    this.pollingIntervalId = null
    this.state = PriceFeed.STATE.STOPPED
    this.emit('state', this.state)
  }

  _poll() {

    if(!this._exchangeRateFetcher) {
      console.error('priceFeed polling with no exchange rate fetcher')
      return
    }


    this._exchangeRateFetcher()
      .then((newExchangeRate) => {

        this.cryptoToUsdExchangeRate = newExchangeRate

        this.emit('tick', this.cryptoToUsdExchangeRate)
      })
      .catch((err) => {
        this.emit('error', err)
      })
  }

}

export default PriceFeed
