import PriceFeedStore from '../../../src/core-stores/PriceFeed'

var assert = require('chai').assert

describe('PriceFeed Store', function () {
  it('constructor sets exchange rate', function () {
    const exchangeRate = 5000

    let store = new PriceFeedStore(exchangeRate)

    assert.equal(store.cryptoToUsdExchangeRate, exchangeRate)
  })

  it('setCryptoToUsdExchangeRate action sets exchange rate', function () {
    const exchangeRate = 5000

    let store = new PriceFeedStore()

    store.setCryptoToUsdExchangeRate(exchangeRate)

    assert.equal(store.cryptoToUsdExchangeRate, exchangeRate)
  })
})
