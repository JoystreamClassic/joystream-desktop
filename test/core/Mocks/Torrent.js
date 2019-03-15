/**
 * Created by bedeho on 21/07/17.
 */

import EventEmitter from 'events'
import sinon from 'sinon'
import ViabilityOfPaidDownloadingSwarm from "../../../src/core/Torrent/ViabilityOfPaidDownloadingSwarm";

class MockTorrent extends EventEmitter {
  
  /**
   * {String} Current state of the state machine
   */
  state
  
  /**
   * {String}
   */
  infoHash
  
  /**
   * {String}
   */
  name
  
  /**
   * {String}
   */
  savePath
  
  /**
   * {Buffer?}
   */
  resumeData
  
  /**
   * {TorrentInfo}
   */
  torrentInfo
  
  /**
   * {Number} Progress on torrent, referring to either progress
   * during checking resume data while starting, or download progress
   * otherwise.
   */
  progress
  
  /**
   * {Number} Number of bytes downloaded so far
   */
  downloadedSize
  
  /**
   * {Number} Bytes per second download rate
   */
  downloadSpeed
  
  /**
   * {Number} Bytes per second upload rate
   */
  uploadSpeed
  
  /**
   * {Number} Number of seeders
   * NB: For now we leave this here, but in the future
   * we should put information on each peer.
   */
  numberOfSeeders
  
  /**
   * {Number} Bytes uploaded so far
   */
  uploadedTotal
  
  /**
   * {SellerTerms}
   */
  sellerTerms
  
  /**
   * {BuyerTerms}
   */
  buyerTerms
  
  /**
   * {Map.<String, Peer>}
   */
  peers
  
  /**
   * {ViabilityOfPaidDownloadInSwarm}
   */
  viabilityOfPaidDownloadInSwarm
  
  /**
   * {FileSegmentStreamFactory} Current active file segment factory, only set iff
   * a stream has been started.
   *
   * NB: Only one allowed at a time
   */
  fileSegmentStreamFactory
  
  constructor(infoHash, state, opts = {}) {
      super()
  
    this.setInfoHash(infoHash)
    this.setState(state)
    
    this.name = ''
    this.progress = 0
    this.peers = new Map()
    this.downloadSpeed = 0
    this.uploadSpeed = 0
    this.numberOfSeeders = 0
    this.uploadedTotal = 0
    this.sellerTerms = {}
    this.buyerTerms = {}
    this.viabilityOfPaidDownloadInSwarm = new ViabilityOfPaidDownloadingSwarm.NoJoyStreamPeerConnections()
  
    this.start = opts.start ? opts.start.bind(this) : sinon.spy()
    this.stop = opts.stop ? opts.stop.bind(this) : sinon.spy()
    this.startPaidDownload = opts.startPaidDownload ? opts.startPaidDownload.bind(this) : sinon.spy()
    this.beginUpload = opts.beginUpload ? opts.beginUpload.bind(this) : sinon.spy()
    this.endUpload = opts.endUpload ? opts.endUpload.bind(this) : sinon.spy()
  }
  
  setState(state) {
    this.state = state
    this.emit('state', state)
  }
  
  setInfoHash(infoHash) {
    this.infoHash = infoHash
  }
  
  setName(name) {
    this.name = name
  }
  
  setTorrentInfo(torrentInfo) {
    this.torrentInfo = torrentInfo
    this.emit('torrentInfo', torrentInfo)
  }
  
}

export default MockTorrent