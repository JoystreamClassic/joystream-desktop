
function MakePeerPluginStatus(pid,
                              endPoint,
                              peerBEP10SupportStatus,
                              peerBitSwaprBEPSupportStatus,
                              connection) {

    return {
        pid : pid,
        endPoint : endPoint,
        peerBEP10SupportStatus : peerBEP10SupportStatus,
        peerBitSwaprBEPSupportStatus : peerBitSwaprBEPSupportStatus,
        connection : connection
    }
}

module.exports = MakePeerPluginStatus
