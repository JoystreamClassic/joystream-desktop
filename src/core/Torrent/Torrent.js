/**
 * Created by bedeho on 11/07/17.
 */

import {EventEmitter} from 'events'
var TorrentStatemachine = require('./Statemachine/Torrent')
import FileSegmentStreamFactory from './FileSegmentStreamFactory'
import {
  deepInitialStateFromActiveState,
  isUploading,
  isPassive,
  isDownloading,
  isStopped} from './Statemachine/DeepInitialState'
import ViabilityOfPaidDownloadingSwarm from './ViabilityOfPaidDownloadingSwarm'

var debug = require('debug')('torrent')

/**
 * Torrent
 *
 * Note: This is a bad library interface,
 * https://github.com/JoyStream/joystream-desktop/issues/665
 *
 * emits loaded({DeepInitialState}) -  torrent has been loaded with given state
 * emits viabilityOfPaidDownloadInSwarm({ViabilityOfPaidDownloadInSwarm})
 * emits buyerTerms({BuyerTerns}) - updated terms of client side
 * emits sellerTerms({SellerTerms})
 * emits resumeData({Buffer})
 * emits torrentInfo({TorrentInfo}) - updated metadata
 * emits progress({Number})
 * emits downloadedSize({Number})
 * emits uploadedTotal({Number})
 * emits uploadSpeed({Number})
 * emits numberOfSeeders({Number})
 * emits validPaymentReceived(paymentIncrement, totalNumberOfPayments, totalAmountPaid)
 * emits paymentSent(paymentIncrement, totalNumberOfPayments, totalAmountPaid, pieceIndex)
 * emits lastPaymentReceived(settlementTx {tx}) -
 * emits failedToMakeSignedContract({err , tx}) - when
 *
 * These two are not reliable, as they are based on
 * snapshots of plugin state at regular intervals.
 * The arrival & disappearance of peer plugins may be missed
 * in theory:
 * emits peerAdded({Peer}) - when peer plugin is first seens as present
 * emits peerRemoved({PID}) - when peer plugin is first seens as gone
 */
class Torrent extends EventEmitter {

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

  constructor(settings, privateKeyGenerator, publicKeyHashGenerator, contractGenerator, broadcastRawTransaction) {

    super()

    this.state = this._compositeStateAsString()
    this.infoHash = settings.infoHash
    this.name = settings.name
    this.savePath = settings.savePath
    this.resumeData = settings.resumeData
    this.torrentInfo = settings.metadata
    this._deepInitialState = settings.deepInitialState
    this.progress = 0
    this.downloadedSize = 0
    this.downloadSpeed = 0
    this.uploadSpeed = 0
    this.numberOfSeeders = 0
    this.uploadedTotal = 0

    this.peers = new Map()
    this.viabilityOfPaidDownloadInSwarm = new ViabilityOfPaidDownloadingSwarm.NoJoyStreamPeerConnections()

    // Check that compatibility in deepInitialState and {buyerTerms, sellerTerms},
    // and store terms on client
    if(isDownloading(settings.deepInitialState)) {

      if(settings.extensionSettings.buyerTerms)
        this.buyerTerms = settings.extensionSettings.buyerTerms
      else
        throw Error('DownloadIncomplete state requires buyer terms')

    } else if(isUploading(settings.deepInitialState)) {

      if(settings.extensionSettings.sellerTerms)
        this.sellerTerms = settings.extensionSettings.sellerTerms
      else
        throw Error('Uploading state requires seller terms')

    }

    this._joystreamNodeTorrent = null
    this.fileSegmentStreamFactory = null

    // Hooks for state machine
    this._privateKeyGenerator = privateKeyGenerator
    this._publicKeyHashGenerator = publicKeyHashGenerator
    this._contractGenerator = contractGenerator
    this._broadcastRawTransaction = broadcastRawTransaction

    // Hook into Machinajs state transitions in the machine
    TorrentStatemachine.on('transition', (data) => {

      // Check that the transition is on this torrent
      if (data.client != this)
        return

      // Get current state
      let stateString = this._compositeStateAsString()

      // Update public state
      this.state = stateString

      debug('entering state: ' + stateString)

      this.emit('state', stateString)
      this.emit(stateString, data)
    })

  }

  start() {
    this._submitInput('start')
  }

  stop() {
    this._submitInput('stop')
  }

  updateBuyerTerms(buyerTerms) {
    this._submitInput('updateBuyerTerms', buyerTerms)
  }

  updateSellerTerms(sellerTerms) {
    this._submitInput('updateSellerTerms', sellerTerms)
  }

  provideMissingBuyerTerms(buyerTerms) {
    this._submitInput('missingBuyerTermsProvided', buyerTerms)
  }

  startPaidDownload(cb = () => {}) {
    /**
     * API HACK
     * https://github.com/JoyStream/joystream-desktop/issues/665
     */

    this._submitInput('startPaidDownload', cb)
  }

  beginUpload(sellerTerms){
    this._submitInput('goToStartedUploading', sellerTerms)
  }

  endUpload() {
    this._submitInput('goToPassive')
  }

  /**
   * Create a stream factory
   * Only possible when active, and a stream not already active.
   *
   * @param fileIndex {Number} - index of file
   * @returns {FileSegmentStreamFactory}
   */
  createStreamFactory(fileIndex) {

    /**
     * API HACK
     * https://github.com/JoyStream/joystream-desktop/issues/665
     */

    if(!this.state.startsWith('Active'))
      throw Error('Cannot be done in current state')
    else if(this.fileSegmentStreamFactory)
      throw Error('A stream factory is already active')

    // Check that index of file is valid
    let numFiles = this._joystreamNodeTorrent.handle.torrentFile().files().numFiles()

    if(fileIndex >= numFiles)
      throw Error('Invalid file index, max index: ' + (numFiles - 1))

    // Determine
    let completed = this.state.startsWith('Active.FinishedDownloading')

    // Create factory
    return new FileSegmentStreamFactory(this._joystreamNodeTorrent, fileIndex, completed)
  }

  deepInitialState() {
    return deepInitialStateFromActiveState(this.state)
  }

  isTerminating() {
    return Torrent.isTerminating(this.state)
  }

  static isTerminating (state) {
    return state.startsWith('StoppingExtension') || state.startsWith('GeneratingResumeData')
  }

  _addedToSession(torrent) {
    this._submitInput('addedToSession', torrent)
  }

  _terminate(generateResumeData) {
    this._submitInput('terminate', generateResumeData)
  }

  _submitInput(...args) {
    TorrentStatemachine.queuedHandle(this, ...args)
  }

  _compositeStateAsString() {
    return TorrentStatemachine.compositeState(this)
  }

  _setViabilityOfPaidDownloadInSwarm(viabilityOfPaidDownloadInSwarm) {
    this.viabilityOfPaidDownloadInSwarm = viabilityOfPaidDownloadInSwarm
    this.emit('viabilityOfPaidDownloadInSwarm', viabilityOfPaidDownloadInSwarm)
  }

  _setBuyerTerms(terms) {
    this.buyerTerms = terms
    this.emit('buyerTerms' , terms)
  }

  _setSellerTerms(terms) {
    this.sellerTerms = terms
    this.emit('sellerTerms', terms)
  }

  _setResumeData(resumeData) {
    this.resumeData = resumeData
    this.emit('resumeData', resumeData)
  }

  _setTorrentInfo(torrentInfo) {
    this.torrentInfo = torrentInfo
    this.emit('torrentInfo', torrentInfo)
  }

  _setProgress(progress) {
    this.progress = progress
    this.emit('progress', progress)
  }

  _setDownloadedSize(downloadedSize) {
    this.downloadedSize = downloadedSize
    this.emit('downloadedSize', downloadedSize)
  }

  _setDownloadSpeed(downloadSpeed) {
    this.downloadSpeed = downloadSpeed
    this.emit('downloadSpeed', downloadSpeed)
  }

  _setUploadedTotal(uploadedTotal) {
    this.uploadedTotal = uploadedTotal
    this.emit('uploadedTotal', uploadedTotal)
  }

  _setUploadSpeed(uploadSpeed) {
    this.uploadSpeed = uploadSpeed
    this.emit('uploadSpeed', uploadSpeed)
  }

  _setNumberOfSeeders(numberOfSeeders) {
    this.numberOfSeeders = numberOfSeeders
    this.emit('numberOfSeeders', numberOfSeeders)
  }

  _setJoystreamNodeTorrentStatus(status) {

    this._setProgress(status.progress)
    this._setDownloadedSize(status.totalDone)
    this._setDownloadSpeed(status.downloadRate)
    this._setUploadedTotal(status.totalUpload)
    this._setUploadSpeed(status.uploadRate)
    this._setNumberOfSeeders(status.numSeeds)
  }

  _handleValidPaymentReceivedAlert(alert) {
    this.emit('validPaymentReceived', alert.paymentIncrement, alert.totalNumberOfPayments, alert.totalAmountPaid)
  }

  _handlePaymentSentAlert(alert) {
    this.emit('paymentSent', alert.paymentIncrement, alert.totalNumberOfPayments, alert.totalAmountPaid, alert.pieceIndex)
  }

  _lastPaymentReceived(alert) {
    this.emit('lastPaymentReceived', alert.settlementTx)
  }

}

export default Torrent
