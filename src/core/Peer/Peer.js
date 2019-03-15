/**
 * Created by bedeho on 13/07/17.
 */

var PeerStatemachine = require('./Statemachine')

import EventEmitter from 'events'
import util from 'util'

util.inherits(Peer, EventEmitter)

/// Peer class

/**
 * Constructor
 * @param pid
 * @param torrent
 * @param status
 * @constructor
 */
function Peer(pid, torrent, status, privateKeyGenerator, publicKeyHashGenerator) {

    this._client = new PeerStatemachineClient(pid, torrent, privateKeyGenerator, publicKeyHashGenerator)
    this.newStatus(status)
}

Peer.prototype.newStatus = function(status) {
     this._client._submitInput('newStatus', status)

  /**
   * HACK, adding these three functions until this PR can be done.
   * https://github.com/JoyStream/joystream-desktop/issues/684
   */
  this.emit('peerPluginStatus', status)
}

Peer.prototype.compositeState = function() {
    return PeerStatemachine.compositeState(this._client)
}

Peer.prototype.anchorAnnounced = function (alert) {
  this._client._submitInput('anchorAnnounced', alert)
}

Peer.prototype.uploadStarted = function (alert) {
  this._client._submitInput('uploadStarted', alert)
}

/**
 * HACK, adding these three functions until this PR can be done.
 * https://github.com/JoyStream/joystream-desktop/issues/684
 */

Peer.prototype.pid = function () {
  return this._client.pid
}

Peer.prototype.state = function () {
  return this.compositeState()
}

Peer.prototype.peerPluginStatus = function () {
  return this._client.status
}

/// PeerStatemachineClient class

function PeerStatemachineClient(pid, torrent, privateKeyGenerator, publicKeyHashGenerator) {

    this.pid = pid
    this.torrent = torrent
    this._privateKeyGenerator = privateKeyGenerator
    this._publicKeyHashGenerator = publicKeyHashGenerator
}

PeerStatemachineClient.prototype._submitInput = function (...args) {
  PeerStatemachine.queuedHandle(this, ...args)
}

PeerStatemachineClient.prototype.generateContractPrivateKey = function() {
    return this._privateKeyGenerator()
}

PeerStatemachineClient.prototype.generatePublicKeyHash = function() {
    return this._publicKeyHashGenerator()
}

module.exports = Peer
