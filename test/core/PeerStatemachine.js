/**
 * Created by bedeho on 08/07/17.
 */
var assert = require('chai').assert
var sinon = require('sinon')
var Peer = require('../../src/core/Peer')
var Mocks = require('./Mocks')

var ConnectionInnerState = require('joystream-node').ConnectionInnerState

describe('Peer state machine', function () {

    let pid = "my_peer_id"
    let endpoint = "my_endpoint"
    let peerBEP10SupportStatus = "peerBEP10SupportStatus"
    let peerBitSwaprBEPSupportStatus = "peerBitSwaprBEPSupportStatus"
    let torrent = new Mocks.MockJSNodeTorrent({})
    let peer = null

    let privateKeyGenerator = sinon.stub()
    let contractSk = "this is my private key"
    privateKeyGenerator.returns(contractSk)

    let pubKeyHashGenerator = sinon.stub()
    let finalPkHash = "this is my public key hash"
    pubKeyHashGenerator.returns(finalPkHash)

    it('is properly constructed', function () {

        peer = new Peer(pid, torrent, {}, privateKeyGenerator, pubKeyHashGenerator)

        assert.equal(peer.compositeState(), "ReadyForStartPaidUploadAttempt")
    })

    it('ignores state updates in wrong mode', function () {

        let s = Mocks.PeerPluginStatus(pid, null, null, null,
            Mocks.ConnectionStatus(pid, ConnectionInnerState.ReadyForInvitation, null, null, null)
        )

        peer.newStatus(s)

        assert.equal(peer.compositeState(), "ReadyForStartPaidUploadAttempt")
        assert.equal(torrent.startUploading.callCount, 0)

    })

    let buyerTerms = { xxx : 222}

    it('updates state: tries to start paid uploading', function () {

        let s = Mocks.PeerPluginStatus(pid, null, null, null,
            Mocks.ConnectionStatus(pid, ConnectionInnerState.Invited, null, null,
                Mocks.AnnouncedModeAndTerms.Buy(buyerTerms))
        )

        peer.newStatus(s)

        assert.equal(peer.compositeState(), "StartingPaidUploading")
        assert.equal(torrent.startUploading.callCount, 1)

        let firstCall = torrent.startUploading.getCall(0)

        assert.equal(firstCall.args[0], pid)
        assert.equal(firstCall.args[1], buyerTerms)
        assert.equal(firstCall.args[2], contractSk)
        assert.equal(firstCall.args[3], finalPkHash)

    })

    it('goes to paid upload start', function () {

        var startUploadingCallback = torrent.startUploading.getCall(0).args[4]

        // Make callback with successful start of selling
        startUploadingCallback(false)

        assert.equal(peer.compositeState(), "PaidUploadingStarted")
    })

    it('detects reset', function () {

        peer.newStatus({})

        assert.equal(peer.compositeState(), "ReadyForStartPaidUploadAttempt")

    })

})
