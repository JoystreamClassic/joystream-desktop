/**
 * Created by bedeho on 05/10/2017.
 */

import ElectronConfig from 'electron-config'
import { ipcRenderer, shell } from 'electron'
import EventEmitter from 'events'


/**
 * Be aware that
 */
const NUMBER_OF_PRIOR_SESSIONS = 'numberOfPriorSessions'
const DOWNLOAD_FOLDER = 'downloadFolder'
const USE_ASSISTED_PEER_DISCOVERY = 'useAssistedPeerDiscovery'
const BITTORRENT_PORT = 'bittorrentPort'
const DEFAULT_BUYER_TERMS = 'defaultBuyerTerms'
const DEFAULT_SELLER_TERMS = 'defaultSellerTerms'
const TERMS_ACCEPTED = 'termsAccepted'
const DEFAULT_CLIENT_PREFERENCE = 'defaultClientPreference'
const LAST_RAN_VERSION = 'lastRanVersion'
const CLAIMED_FREE_BCH = 'completedFreeBCH'

/**
 * ApplicationSettings.
 *
 * This is really quite a thin layer on top of ElectronConfig, bordering
 * on useless, however, it allowes reading & writing properties through
 * a runtime safe interface, while a simple type in ElectronConfig property
 * access will raise no issue.
 *
 * emits opened
 * emits closed
 */
class ApplicationSettings extends EventEmitter {

  static STATE = {
    CLOSED : 0,
    OPENED : 1,
  }

  /**
   * @property {STATE} State of settings database
   */
  state

  /**
   * Constructor
   * @param configFileName {String}
   */
  constructor (configFileName) {

    super()

    this.state = ApplicationSettings.STATE.CLOSED
    this._electronConfigStore = null
    this._configFileName = configFileName
  }

  /**
   * Open settings, with given default values for settings.
   *
   * @param numberOfPriorSessions
   * @param downloadFolder
   * @param useAssistedPeerDiscovery
   * @param bittorrentPort
   * @param termsAccepted {Boolean} - whether user has accepted the terms
   * @param defaultClientPreference {}
   * @param claimedFreeBCH {Boolean} -
   */

  open(numberOfPriorSessions,
       downloadFolder,
       useAssistedPeerDiscovery,
       bittorrentPort,
       defaultBuyerTerms,
       defaultSellerTerms,
       termsAccepted,
       defaultClientPreference,
       claimedFreeBCH) {

    if(this.state !== ApplicationSettings.STATE.CLOSED)
      throw Error('Can only open when closed')

    // Open store with default values
    let opts = {}

    // Set default values
    let defaults = {}
    defaults[NUMBER_OF_PRIOR_SESSIONS] = numberOfPriorSessions
    defaults[DOWNLOAD_FOLDER] = downloadFolder
    defaults[USE_ASSISTED_PEER_DISCOVERY]  = useAssistedPeerDiscovery
    defaults[BITTORRENT_PORT] = bittorrentPort
    defaults[DEFAULT_BUYER_TERMS] = defaultBuyerTerms
    defaults[DEFAULT_SELLER_TERMS] = defaultSellerTerms
    defaults[TERMS_ACCEPTED] = termsAccepted
    defaults[DEFAULT_CLIENT_PREFERENCE] = defaultClientPreference

    // LAST_RAN_VERSION:
    //
    // NB: This will be automatically fixed by having an optional
    // conveyeor for params.
    //
    // Notice that we are not setting a default value for LAST_RAN_VERSION
    // it must be kept unset so that it may be detected that this is first
    // time run after update to release which has this setting.

    defaults[CLAIMED_FREE_BCH] = claimedFreeBCH
    opts.defaults = defaults

    // Set file name
    if(this._configFileName)
      opts.name = this._configFileName

    this._electronConfigStore = new ElectronConfig(opts)

    this.state = ApplicationSettings.STATE.OPENED
    this.emit('opened')
  }

  close() {

    if(this.state !== ApplicationSettings.STATE.OPENED)
      throw Error('Must be opened')

    this._electronConfigStore = null

    this.state = ApplicationSettings.STATE.CLOSED
    this.emit('closed')
  }

  filePath() {

    if(this.state !== ApplicationSettings.STATE.OPENED)
      throw Error('Must be opened')

    return this._electronConfigStore.path
  }

  numberOfPriorSessions() {
    return this._get(NUMBER_OF_PRIOR_SESSIONS)
  }

  setNumberOfPriorSessions(numberOfPriorSessions) {
    this._set(NUMBER_OF_PRIOR_SESSIONS, numberOfPriorSessions, 'numberOfPriorSessions')
  }

  downloadFolder () {
    return this._get(DOWNLOAD_FOLDER)
  }

  setDownloadFolder (downloadFolder) {
    this._set(DOWNLOAD_FOLDER, downloadFolder, 'downloadFolder')
  }

  useAssistedPeerDiscovery() {
    return this._get(USE_ASSISTED_PEER_DISCOVERY)
  }

  setUseAssistedPeerDiscovery(useAssistedPeerDiscovery) {
    this._set(USE_ASSISTED_PEER_DISCOVERY, useAssistedPeerDiscovery, 'useAssistedPeerDiscovery')
  }

  bittorrentPort() {
    return this._get(BITTORRENT_PORT)
  }

  setBittorrentPort(bittorrentPort) {
    this._set(BITTORRENT_PORT, bittorrentPort, 'bitTorrentPort')
  }

  defaultSellerTerms() {
    return this._get(DEFAULT_SELLER_TERMS)
  }

  setDefaultSellerTerms(sellerTerms) {
    this._set(DEFAULT_SELLER_TERMS, sellerTerms, 'defaultSellerTerms')
  }

  defaultBuyerTerms() {
    return this._get(DEFAULT_BUYER_TERMS)
  }

  setDefaultBuyerTerms(buyerTerms) {
    this._set(DEFAULT_BUYER_TERMS, buyerTerms, 'defaultBuyerTerms')
  }

  termsAccepted() {
    return this._get(TERMS_ACCEPTED)
  }

  setTermsAccepted(termsAccepted) {
    this._set(TERMS_ACCEPTED, termsAccepted, 'termsAccepted')
  }

  defaultClientPreference() {
    return this._get(DEFAULT_CLIENT_PREFERENCE)
  }

  setDefaultClientPreference(preference) {
    this._set(DEFAULT_CLIENT_PREFERENCE, preference, 'defaultClientPreference')
  }


  setLastRanVersionOfApp (version) {
    this._set(LAST_RAN_VERSION, version, 'lastRanVersionOfApp')
  }

  lastRanVersionOfApp () {
    return this._get(LAST_RAN_VERSION)
  }

  claimedFreeBCH() {
    return this._get(CLAIMED_FREE_BCH)
  }

  setClaimedFreeBCH(claimedFreeBCH) {
    this._set(CLAIMED_FREE_BCH, claimedFreeBCH, 'claimedFreeBCH')
  }

  _delete (key) {
    if(this.state !== ApplicationSettings.STATE.OPENED)
      throw Error('Must be opened')

    this._electronConfigStore.delete(key)
  }

  _get(key) {

    if(this.state !== ApplicationSettings.STATE.OPENED)
      throw Error('Must be opened')

    return this._electronConfigStore.get(key)
  }

  _set(key, value, eventName) {

    if(this.state !== ApplicationSettings.STATE.OPENED)
      throw Error('Must be opened')

    this._electronConfigStore.set(key, value)

    this.emit(eventName, value)

  }
}

export default ApplicationSettings
