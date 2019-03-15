/**
 * Created by bedeho on 10/02/2018.
 */

import { observable, action, computed } from 'mobx'
import { BEPSupportStatus } from 'joystream-node'

class PeerStore {

  /**
   * {String} Peer identifier
   */
  peerId

  /**
   * {String} State of peer
   */
  state

  /**
   * {joystream-node.PeerPluginStatus} Status of plugin on peer
   */
  @observable peerPluginStatus

  /**
   * Constructor
   * @param peerId {String} - Peer identifier
   * @param state {String} - State of peer
   * @param peerPluginStatus {joystream-node.PeerPluginStatus} - Status of plugin on peer
   */
  constructor(peerId, state, peerPluginStatus) {
    this.peerId = peerId
    this.setState(state)
    this.setPeerPluginStatus(peerPluginStatus)
  }

  @action.bound
  setState(state) {
    this.state = state
  }

  @action.bound
  setPeerPluginStatus(peerPluginStatus) {
    this.peerPluginStatus = peerPluginStatus
  }

  @computed get
  peerSupportsProtocol() {
    return this.peerPluginStatus.peerBitSwaprBEPSupportStatus === BEPSupportStatus.supported
  }

  @computed get
  peerIsBuyer() {
    return hasConnection(this.peerPluginStatus) && this.peerPluginStatus.connection.announcedModeAndTermsFromPeer.buyer
  }

  @computed get
  peerIsSeller() {
    return hasConnection(this.peerPluginStatus) && this.peerPluginStatus.connection.announcedModeAndTermsFromPeer.seller
  }

  @computed get
  peerIsObserver() {
    return hasConnection(this.peerPluginStatus) && this.peerPluginStatus.connection.announcedModeAndTermsFromPeer.observer
  }

}

function hasConnection(status) {
  return (status.peerBitSwaprBEPSupportStatus === BEPSupportStatus.supported) && status.connection
}

export default PeerStore
