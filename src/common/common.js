/**
 * Created by bedeho on 15/05/17.
 */

import btcConvert from 'bitcoin-convert'
import bytes from 'bytes'
import humanizeDuration from 'humanize-duration'
import assert from 'assert'

function computeOptimumPricePerPiece (alpha, pieceLength, numPieces, satoshiPerMb, settlementFee, distortPMin = true) {
  if (alpha > 1 || alpha < 0) {
    throw new Error('alpha must be a number between 0 and 1')
  }

  if (pieceLength < 0 || numPieces < 0) {
    throw new Error('invalid pieceLength or numPieces')
  }

  if (satoshiPerMb < 0) {
    throw new Error('invalid satoshiPerMb rate')
  }

  if (settlementFee < 0) {
    throw new Error('invalid settlementFee')
  }

  const DUST = 547

  const fileSizeMB = (pieceLength * numPieces) / (1024 * 1024)

  const totalPaidAtAlpha = Math.max(alpha * fileSizeMB * satoshiPerMb, DUST)

  let pMin = (totalPaidAtAlpha + settlementFee) / (numPieces * alpha)

  /**
   * `distortPrice` is part of hack security fix in 1.0.3
   */

  if(distortPMin)
    return Math.ceil(pMin) + 1
  else
    return pMin
}

/**
const BitcoinUnit = {
    BTC : 0,
    mBTC : 1,
    uBTC : 2,
    Satoshis : 3
}


class BitcoinQuantity {

    constructor(amount, unit) {

        // Is non-negative integer
        this.amount = amount

        this.unit = unit

    }

    // quality operator

    isEqualTo(quanitt) {

    }

    toUnit() {

    }

    toCompactUnit() {
        // compact in what sense?
    }
}
 */


// bcoin
//var base58 = require('bcoin').base58

// /utils/base58

/**
 * Converts a BCash p2pkh address string to a public key hash.
 * @param {String} string - BCash p2pkh address string
 * @return {Hash}
 */
function BCashP2PKHAddressStringToPubKeyHash(string) {

  if(string.length === 2)
    throw new Error('example of random error')

  /**
  assert(typeof data === 'string')

  let decoded = base58.decode(data)

  this.fromRaw()



  if (network && !this.verifyNetwork(network))
    throw new Error('Network mismatch for address.');
  return this;
   */
}

/**
 * Concerts
 * @return {String} address string
 */
function PubKeyHashToBCashP2PKHAddressString(pubKeyHash) {


  if(pubKeyHash.length === 2)
    throw new Error('example of random error')



}

/**
 * Most compact Bitcoin unit string for given representation
 *
 * Comment: yes, this is quite hacky, but couldn´ find
 * a suitable thing for it, replace in the future.
 */
function getCompactBitcoinUnits(satoshis) {

    if(typeof satoshis !== 'number' || satoshis < 0) {
      debugger
      throw new Error('Invalid parameters passed: ' + satoshis)
    }

    let value = 0
    let unit = null

    switch (Math.ceil(Math.log(satoshis + 1) / Math.LN10)) {
        case 1:
        case 2:
            value = satoshis
            unit = 'sat'
            break
        case 3:
        case 4:
        case 5:
            if (satoshis % 100 === 0) {
                value = btcConvert(satoshis, 'Satoshi', 'μBTC')
            } else {
                value = btcConvert(satoshis, 'Satoshi', 'μBTC').toFixed(2)
            }
            unit = 'bits' //'μBTC'
            break
        case 6:
        case 7:
        case 8:
            if (satoshis % 100000 === 0) {
                value = btcConvert(satoshis, 'Satoshi', 'mBTC')
            } else {
                value = btcConvert(satoshis, 'Satoshi', 'mBTC').toFixed(2)
            }
            unit = 'mBCH'
            break
        default:
            if (satoshis % 100000000 === 0) {
                value = btcConvert(satoshis, 'Satoshi', 'BTC')
            } else {
                value = btcConvert(satoshis, 'Satoshi', 'BTC').toFixed(2)
            }
            unit = 'BCH'
            break
    }

    return {
        value : value,
        unit : unit
    }
}

function getCompactBitcoinUnitsString(satoshis) {

    // Find most compact representation
    var result = compactBitcoinUnits(satoshis)

    // Convert to string and return
    return result.value + " " + result.units
}

/**
 * Wrapper for bytes package, which gives units and value
 * separately, as a result the unitSeparator option key is no
 * longer supported
 *
 * @param value
 * @param options
 */
function convenientBytes(value, options) {

    let splittingToken = '?'

    options = options || {}

    options.unitSeparator = splittingToken

    let representation = bytes(value, options)

    let array = representation.split(splittingToken)

    return {
        value : array[0],
        unit : array[1]
    }
}

/**
 *
 * @param language
 * @returns {{round: boolean, units: [string,string,string,string,string,string], language: string, languages: {shortEn: {y: languages.shortEn.y, mo: languages.shortEn.mo, w: languages.shortEn.w, d: languages.shortEn.d, h: languages.shortEn.h, m: languages.shortEn.m, s: languages.shortEn.s, ms: languages.shortEn.ms}}}}
 */
function standardHumanizeDurationOptions(language) {

    // language ?

    return {
        round: true,
        units: ['y', 'mo', 'w', 'd', 'h', 'm'],
        language: 'shortEn',
        languages: {
            shortEn: {
                y: function() { return 'y' },
                mo: function() { return 'mo' },
                w: function() { return 'w' },
                d: function() { return 'd' },
                h: function() { return 'h' },
                m: function() { return 'm' },
                s: function() { return 's' },
                ms: function() { return 'ms' },
            }
        }
    }
}

/**
 *
 * @param seconds
 * @param options
 * @returns {Array}
 */
function convenientHumanizeDuration(seconds, options) {

    var delimiter = '-'
    let valueUnitDelimiter = '?'

    options = options || {}
    options.spacer = valueUnitDelimiter // String to display between each value and unit.
    options.delimiter = delimiter

    // Factor out humanizer setup, instead get humanizer injected or something
    let totalMilliseconds = seconds * 1000
    var FullHumanizedString = humanizeDuration(totalMilliseconds, options)

    // Trim off anything beyond second unit
    var humanizedTokens = FullHumanizedString.split(delimiter)

    var ETA = []

    // split up each duration component into a value and unit component
    for(var i = 0;i < humanizedTokens.length;i++) {

        let array = humanizedTokens[i].split(valueUnitDelimiter)

        ETA.push({
            value: array[0],
            unit: array[1]
        })
    }

    return ETA
}

/**
 * Validates non-negative integers
 * @param n

function isNonNegativeInteger(n) {
    return Number.isInteger(n) && n >= 0
}


 * Human readable ETA for download of given number of bytes
 * at a given rate.
 *
 * @param bytes {Number} Total number of bytes to be downloaded
 * @param bytes_per_second {Numbre} Byte rate, per second, at which bytes are downloaded
 * @param max_tokens {Number} Maximum number of tokens to be used in humanized string
 */


/**
 *
function convenientHumanizeDuration(seconds) {

    var delimiter = '-'
    let valueUnitDelimiter = '?'

    // Factor out humanizer setup, instead get humanizer injected or something
    var FullHumanizedETAString = humanizeDuration(total_ms, {
        spacer: valueUnitDelimiter, // String to display between each value and unit.
        delimiter: delimiter, //
        round: true,
        units: ['y', 'mo', 'w', 'd', 'h', 'm'],
        language: 'shortEn',
        languages: {
            shortEn: {
                y: function() { return 'y' },
                mo: function() { return 'mo' },
                w: function() { return 'w' },
                d: function() { return 'd' },
                h: function() { return 'h' },
                m: function() { return 'm' },
                s: function() { return 's' },
                ms: function() { return 'ms' },
            }
        }
    })

    // Trim off anything beyond second unit
    var humanizedTokens = FullHumanizedETAString.split(delimiter)

    var ETA = []

    // split up each duration component into a value and unit component
    for(var i = 0;i < Math.min(max_tokens, humanizedTokens.length);i++) {

        let array = humanizedTokens[i].split(valueUnitDelimiter)

        ETA.push({
            value: array[0],
            unit: array[1]
        })
    }

    return ETA
}
 */

export {
    getCompactBitcoinUnits,
    getCompactBitcoinUnitsString,
    convenientBytes,
    convenientHumanizeDuration,
    standardHumanizeDurationOptions,
    computeOptimumPricePerPiece
}
