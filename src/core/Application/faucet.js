var request = require('request')

const FAUCET_URLS = {
  // Bitcoin testnet
  'testnet': 'http://45.79.102.125:7099/withdraw/',
  // Bitcoin Cash testnet
  'bitcoincashtestnet': 'http://45.79.102.125:7098/withdraw/',
  // Bitcoin Cash Mainnet
  'bitcoincash': 'http://45.79.102.125:7097/withdraw/'
}

const ErrorCodes = {
  // Errors generated locally
  NETWORK_ERROR: 10, // network request failed
  RESPONSE_PARSE_ERROR: 11, // failed to parse the response from faucet
  NO_FAUCET_FOR_NETWORK: 12,

  // Error codes from faucet
  RATE_LIMIT_SERVER: 1,  // server withdrawl limit reached
  RATE_LIMIT_CLIENT: 2, // user withdrawal limit reached
  WALLET_OFFLINE: 3, // server wallet is offline
  NO_FUNDS: 4, // faucet out of funds
  ADDRESS_MISSING: 5,
  ADDRESS_INVALID: 6,
  SERVER_INTERNAL_ERROR: 7 // internal error sending coins
}

/**
  * Makes a request to testnet faucet to get some free coins
  * @address - address to send coins to (bcoin.Address)
  */
function getCoins (address, callback = () => {}) {
  // Determine faucet service to use from network
  const url = FAUCET_URLS[address.network.type]

  if (!url) {
    return callback({code: ErrorCodes.NO_FAUCET_FOR_NETWORK, message: 'unsupported network'})
  }

  _getCoins(url, address.toString(), callback)
}

/**
  * Makes a request to testnet faucet to get some free coins
  * @faucetUrl - URL to joystream faucet web service (string)
  * @address - address to send coins to (string: base58 encoded)
  */
function _getCoins (faucetUrl, address, callback = () => {}) {
  var query = {
    address: address
  }

  request({url: faucetUrl, qs: query}, (err, response, body) => {
    if (err) {
      // network error
      callback({code: ErrorCodes.NETWORK_ERROR, message: err.message})
    } else {
      // Success
      if (response.statusCode === 200) {
        return callback()
      }

      // Faucet rejected request - details in data.message
      try {
        var error = JSON.parse(body).data
      } catch (e) {
        // error parsing json response
        return callback({code: ErrorCodes.RESPONSE_PARSE_ERROR,
                         message: 'unable to parse error message in response'})
      }

      callback(error)
    }
  })
}

export default getCoins
export {
  ErrorCodes
}
