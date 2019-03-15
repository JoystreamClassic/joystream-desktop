/**
 * Created by bedeho on 25/07/17.
 */

var TerminatingState = {
    TerminatingTorrents : 0,
    DisconnectingFromBitcoinNetwork : 1,
    ClosingWallet : 2,
    StoppingSpvNode : 3,
    ClosingApplicationDatabase : 4,
    ClearingResources : 5
}

export default TerminatingState