/**
 * Created by bedeho on 16/03/2018.
 */

import EventEmitter from 'events'
import sinon from 'sinon'

class MockApplicationSettings extends EventEmitter {

  static STATE = {
    CLOSED : 0,
    OPENED : 1,
  }

  /**
   * @property {ApplicationSettings.STATE} State of settings database
   */
  state

  constructor (state = ApplicationSettings.STATE.CLOSED, filePath = '', opts = {}) {

    super()

    this.state = state

    // Initialize settings
    this._filePath = opts.filePath
    this._numberOfPriorSessions = opts.numberOfPriorSessions
    this._downloadFolder = opts.downloadFolder
    this._useAssistedPeerDiscovery = opts.useAssistedPeerDiscovery
    this._bittorrentPort = opts.bittorrentPort
    this._defaultSellerTerms = opts.defaultSellerTerms
    this._defaultBuyerTerms = opts.defaultBuyerTerms
    this._termsAccepted = opts.termsAccepted
    this._claimedFreeBCH = opts.claimedFreeBCH

    // Setup mutating calls
    this.open = opts.open ? opts.open.bind(this) : sinon.spy()
    this.close = opts.close ? opts.close.bind(this) : sinon.spy()
    this.setNumberOfPriorSessions = opts.setNumberOfPriorSessions ? opts.setNumberOfPriorSessions.bind(this) : sinon.spy()
    this.setDownloadFolder = opts.setDownloadFolder ? opts.setDownloadFolder.bind(this) : sinon.spy()
    this.setUseAssistedPeerDiscovery = opts.setUseAssistedPeerDiscovery ? opts.setUseAssistedPeerDiscovery.bind(this) : sinon.spy()
    this.setBittorrentPort = opts.setBittorrentPort ? opts.setBittorrentPort.bind(this) : sinon.spy()
    this.setDefaultSellerTerms = opts.setDefaultSellerTerms ? opts.setDefaultSellerTerms.bind(this) : sinon.spy()
    this.setDefaultBuyerTerms = opts.setDefaultBuyerTerms ? opts.setDefaultBuyerTerms.bind(this) : sinon.spy()
    this.setTermsAccepted = opts.setTermsAccepted ? opts.setTermsAccepted.bind(this) : sinon.spy()
    this.setClaimedFreeBCH = opts.setClaimedFreeBCH ? opts.setClaimedFreeBCH.bind(this) : sinon.spy()
  }

  filePath() {
    return this._filePath
  }

  numberOfPriorSessions() {
    return this._numberOfPriorSessions
  }

  downloadFolder () {
    return this._downloadFolder
  }

  useAssistedPeerDiscovery() {
    return this._useAssistedPeerDiscovery
  }

  bittorrentPort() {
    return this._bittorrentPort
  }

  defaultSellerTerms() {
    return this._defaultSellerTerms
  }

  defaultBuyerTerms() {
    return this._defaultBuyerTerms
  }

  termsAccepted() {
    return this._termsAccepted
  }

  claimedFreeBCH() {
    return this._claimedFreeBCH
  }


}

export default MockApplicationSettings
