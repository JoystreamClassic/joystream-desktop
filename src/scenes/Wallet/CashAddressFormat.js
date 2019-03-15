'use strict'

const bcoin = require('bcoin')
const assert = require('assert')
const bchaddr = require('bchaddrjs')

/*
 * Utility class for encoding and decoding Bitcoin Cash Addresses
 */
class CashAddressFormat {

  /**
  * Represents a Bitcoin Cash Address
  * @constructor
  * @param bcoinAddress {bcoin.address} - a bcoin address
  */
  constructor (bcoinAddress) {
    if (!(bcoinAddress instanceof bcoin.address)) {
      throw new Error('CashAddressFormat expects bcoin.address')
    }

    // Make sure it is not a segwit program address
    assert(bcoinAddress.version === -1)

    // Network must be set
    assert(bcoinAddress.network)

    // Check valid type
    if (!(
      bcoinAddress.type === bcoin.address.types.PUBKEYHASH ||
      bcoinAddress.type === bcoin.address.types.SCRIPTHASH)
    ) {
      throw new Error('CashAddress types can only be PUBKEYHASH or SCRIPTHASH')
    }

    this._address = bcoinAddress
  }

  /**
   * toString - converts address to bech32 ecoded string
   * @returns {string} - bech32 encoded Bitcoin Cash address
   */
  toString () {
    const legacyAddress = this._address.toBase58()
    return bchaddr.toCashAddress(legacyAddress)
  }

  /**
   * bcoinAddress - return the underlying bcoin.address object
   * @returns {bcoin.address}
   */
  bcoinAddress () {
    return this._address
  }

  /**
   * fromString - static constructor
   * Decodes a bech32 encoded string
   * @param address {String} - bech32 encoded Bitcoin Cash Address
   * @returns {CashAddressFormat}
   */
  static fromString (address) {
    if (!bchaddr.isCashAddress(address)) {
      throw new Error('address is not a bitcoin cash address')
    }

    const network = bchaddr.detectAddressNetwork(address)

    // verify the address matches bcoin primary network type
    if (network === bchaddr.Network.Mainnet) {
      if (bcoin.network.primary.type !== 'bitcoincash') {
        throw new Error('expecting bitcoincash mainnet address')
      }
    } else if (network === bchaddr.Network.Testnet) {
      if (bcoin.network.primary.type !== 'bitcoincashtestnet') {
        throw new Error('expecting bitcoincash testnet address')
      }
    } else {
      throw new Error('unsupported bitcoin cash network type')
    }

    const legacyAddress = bchaddr.toLegacyAddress(address)

    const bcoinAddress = new bcoin.address.fromString(legacyAddress, bcoin.network.primary.type)

    return new CashAddressFormat(bcoinAddress)
  }
}

export default CashAddressFormat
