// Use of pure js bcoin crypto library because electron doesn't compile with openssl
// which is needed.
process.env.BCOIN_NO_NATIVE = '1'
// We can optionally turn off native secp256k1 implementation but since it doesn't
// depend on openssl it should work fine
// process.env.BCOIN_NO_SECP256K1 = '1'

const bcoin = require('bcoin')

const protocolVersion = require('joystream-node').protocolVersion

// Determine which bcoin network to use based on the protocolVersion
let network
if (protocolVersion) {
  // Only newer version of joystream-node export the protocolVersion
  if (protocolVersion > 3) {
    network = 'bitcoincash'
  } else {
    throw new Error('unable to determine network to use from protocolVersion', protocolVersion)
  }
} else {
  // Older versions of joystream-node used by the app did not export
  // the protocol version and were configured to run on bitcoin testnet.

  // Not Supported
  throw new Error('version of joystream-node being used is not supported')
}

// Set primary network in bcoin (oyh vey, what a singlton horrible pattern)
// NB: This should be considered a global configuration, make sure not to change
// the primary network after starting the Application.
// Use bcoin.network.primary in the reset of the codebase to determine what network
// was configured.
// This will fail if the wrong version of bcoin is used.
bcoin.set(network)

// Application config
var config = {
  // currently only used by bcoin logger
  logLevel: 'info'
}

// Environment variables override configuration settings
// var bitTorrentPort = parseInt(process.env.LIBTORRENT_PORT)
// if(Number.isInteger(bitTorrentPort)) {
//   config.bitTorrentPort = bitTorrentPort
// }
//
// // Environment variables override configuration settings
// var APD = process.env.ASSISTED_PEER_DISCOVERY
// if (APD !== '') {
//   if (APD === 'yes' || APD === 'true' || APD === '1') {
//     config.assistedPeerDiscovery = true
//   } else if (APD === 'no' || APD === 'false' || APD === '0') {
//     config.assistedPeerDiscovery = false
//   }
// }

module.exports = config
