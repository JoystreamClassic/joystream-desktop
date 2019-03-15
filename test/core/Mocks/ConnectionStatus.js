
function MakeConnectionStatus(pid, innerState, payor, payee, announcedModeAndTermsFromPeer) {

    return {
        pid : pid,
        innerState : innerState,
        payor: payor,
        payee: payee,
        announcedModeAndTermsFromPeer : announcedModeAndTermsFromPeer
    }
}

module.exports = MakeConnectionStatus
