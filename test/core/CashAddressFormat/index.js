var assert = require('chai').assert

import CashAddressFormat from '../../../src/scenes/Wallet/CashAddressFormat'

// bcoin config
import config from '../../../src/config'
import bcoin from 'bcoin'

// https://github.com/bitcoincashorg/spec/blob/master/cashaddr.md
const testVectors = [
  // P2PKH
  ['1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu', 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a'],
  ['1KXrWXciRDZUpQwQmuM1DbwsKDLYAYsVLR', 'bitcoincash:qr95sy3j9xwd2ap32xkykttr4cvcu7as4y0qverfuy'],
  ['16w1D5WRVKJuZUsSRzdLp9w3YGcgoxDXb', 'bitcoincash:qqq3728yw0y47sqn6l2na30mcw6zm78dzqre909m2r'],
  // P2SH
  ['3CWFddi6m4ndiGyKqzYvsFYagqDLPVMTzC', 'bitcoincash:ppm2qsznhks23z7629mms6s4cwef74vcwvn0h829pq'],
  ['3LDsS579y7sruadqu11beEJoTjdFiFCdX4', 'bitcoincash:pr95sy3j9xwd2ap32xkykttr4cvcu7as4yc93ky28e'],
  ['31nwvkZwyPdgzjBJZXfDmSWsC4ZLKpYyUw', 'bitcoincash:pqq3728yw0y47sqn6l2na30mcw6zm78dzq5ucqzc37']
]

describe('CashAddressFormat', function (){
  it('toString returns CashAddress formatted address', function () {
    const network = 'bitcoincash'

    testVectors.forEach(function (test) {
      const legacyAddress = test[0]
      const newCashAddress = test[1]

      // create bcoin address from legacy string
      var boinAddr = bcoin.address.fromString(legacyAddress, network)

      var cashAddr = new CashAddressFormat(boinAddr)

      assert.equal(cashAddr.toString(), newCashAddress)
    })
  })

  it('fromString decodes CashAddress formatted address', function () {
    testVectors.forEach(function (test) {
      const legacyAddress = test[0]
      const newCashAddress = test[1]

      var cashAddr = new CashAddressFormat.fromString(newCashAddress)

      assert.equal(cashAddr._address.toBase58(), legacyAddress)
    })
  })
})
