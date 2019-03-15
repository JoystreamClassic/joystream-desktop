/**
 * Created by bedeho on 14/10/2017.
 */

// We need to group all the inviable states, to support deeper
// semantics in higher layers

/**
 * There are no connections with peers having (a suitable version) of the JoyStream extension protocol
 * @constructor
 */
function NoJoyStreamPeerConnections() {
}

/**
 * There are such connections, but no peers are in seller mode
 * @constructor
 * @param {Array} statuses of peers which are JoyStream peers, none of which are sellers
 */
function NoSellersAmongJoyStreamPeers(joyStreamPeers) {
    this.joyStreamPeers = joyStreamPeers
}

/**
 * There are not enough seller peers with compatible terms, hence we cannot invite to a full contract
 * @constructor
 * @param invited {Array} status of peers which have been invited, inclu
 */
function InSufficientNumberOfSellersInvited(invited) {
    this.invited = invited
}

/**
 * There are enough such terms, but enough have not joined, yet.
 * @constructor
 * @param joined {Array} peers which have joined
 * @praam invited {Array} peers which have not joined yet, yet have been invited (and thus must be suitable)
 */
function InSufficientNumberOfSellersHaveJoined(joined, invited) {
    this.joined = joined
    this.invited = invited
}

/**
 * There are enough suitable peers which have joined
 * @constructor
 * @param suitableAndJoined {Array} the subset of such suitable joined peers which is being suggested
 * @param estimate {Number} Amount of funds (satoshis) required to fund a contract with said peers
 */
function Viable(suitableAndJoined, estimate) {
    this.suitableAndJoined = suitableAndJoined
    this.estimate = estimate
}

export default {
    NoJoyStreamPeerConnections,
    NoSellersAmongJoyStreamPeers,
    InSufficientNumberOfSellersInvited,
    InSufficientNumberOfSellersHaveJoined,
    Viable
}
