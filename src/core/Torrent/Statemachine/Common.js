/**
 * Created by bedeho on 14/07/17.
 */

var Peer = require('../../Peer')

function processPeerPluginStatuses(client, statuses) {

    /**
     * Poor way of doing peer list maintenance, but
     * this is all we have without proper/reliable peer level events.
     */
    
    // Peer Ids for peers we are getting status snapshot for
    var peersInSnapshot = new Set()

    // Tell client to either add new peer
    // based on status, or tell about new status
    // if it already exits
    for(var i in statuses) {

        var s = statuses[i]

        let peer = client.peers.get(s.pid)

        if(peer) {

            // Update status
            peer.newStatus(s)

        } else {

            let newPeer = new Peer(s.pid, client._joystreamNodeTorrent, s, client._privateKeyGenerator, client._publicKeyHashGenerator)

            client.peers.set(s.pid, newPeer)

            client.emit('peerAdded', newPeer)
        }

        // Mark as present

        peersInSnapshot.add(s.pid)
    }

    // Iterate old peer Ids and drop the ones which pid
    // are not part of this new snapshot
    for (let [pid, peer] of client.peers) {

        if(!peersInSnapshot.has(pid)) {

          client.peers.delete(pid)

          client.emit('peerRemoved', pid)
        }

    }

}

function stopExtension(client) {

  client._joystreamNodeTorrent.stopPlugin( (err) => {

    LOG_ERROR("stopExtension", err)

    client._submitInput('stopExtensionResult', err)

  })

}

function startExtension(client) {

  client._joystreamNodeTorrent.startPlugin((err) => {

    LOG_ERROR("startExtension", err)

    client._submitInput('startExtensionResult', err)

  })
}

function setLibtorrentInteraction(client, mode) {

  client._joystreamNodeTorrent.setLibtorrentInteraction (mode, (err) => {

    LOG_ERROR("setLibtorrentInteraction", err)

    client._submitInput('setLibtorrentInteractionResult', err)

  })
}

function toObserveMode(client) {

  client._joystreamNodeTorrent.toObserveMode((err) => {

    LOG_ERROR("toObserveMode", err)

    client._submitInput('toObserveModeResult', err)

  })
}

function toSellMode(client, sellerTerms) {

  client._joystreamNodeTorrent.toSellMode(sellerTerms, (err) => {

    LOG_ERROR("toSellMode", err)

    client._submitInput('toSellModeResult', err)

  })
}

function toBuyMode(client, buyerTerms) {

  client._joystreamNodeTorrent.toBuyMode(buyerTerms, (err) => {

    LOG_ERROR("toBuyMode", err)

    client._submitInput('toBuyModeResult', err)

  })
}

function LOG_ERROR(source, err) {

  if(err)
    console.error(source,": Error found in callback:", err)
}

export {
  processPeerPluginStatuses,
  stopExtension,
  startExtension,
  setLibtorrentInteraction,
  toObserveMode,
  toSellMode,
  toBuyMode
}
