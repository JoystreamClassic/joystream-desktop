import { observable, action, computed} from 'mobx'

class ApplicationStore {

  /**
   * {Application.STATE} State of application
   */
  @observable state

  /**
   * {Set.<Application.RESOURCE>} The resources which are currently started
   */
  @observable startedResources

  /**
   * {Array.<String>}
   */
  onboardingTorrents

  /**
   * {Bool} Whether onboarding is enabled
   */
  @observable onboardingIsEnabled

  /**
   * {ApplicationSettingsStore}
   * NB: Not a store yet, do later perhaps? wait and see, may turn into complex database of some sort
   */
  @observable applicationSettingsStore

  /**
   * @propety {WalletStore} Store for wallet
   */
  @observable walletStore

  /**
   * @propety {PriceFeedStore}
   */
  @observable priceFeedStore

  /**
   * {Map.<TorrentStore>} All torrent stores currently on application core
   * NB: Turn into Map later
   */
  @observable torrentStores

  /**
   * Constructor
   * @param state {String} - current state of application
   * @param startedResources - set of currently started resouces
   * @param onboardingTorrents - torrents to be outoloaded during onboarding
   * @param onboardingIsEnabled -  whether there should be onboarding as part of startup flow of app
   * @param applicationSettingsStore - settings for application
   * @param walletStore - {WalletStore}
   * @param priceFeedStore - {PriceFeedStore}
   * @param torrentStores - {Map.<String, TorrentStore>}
   * @param starter {Function} -
   * @param stopper {Function} -
   * @param torrentAdder {Function} -
   * @param torrentRemover {Function} -
   */
  constructor({
    state,
    startedResources,
    onboardingTorrents,
    onboardingIsEnabled,
    applicationSettingsStore,
    walletStore,
    priceFeedStore,
    starter,
    stopper,
    torrentAdder,
    torrentRemover}) {

    this.setState(state)
    this.setStartedResources(startedResources)
    this.onboardingTorrents = onboardingTorrents
    this.setOnboardingIsEnabled(onboardingIsEnabled)
    this.setApplicationSettingsStore(applicationSettingsStore)
    this.walletStore = walletStore
    this.setPriceFeedStore(priceFeedStore)
    this._setTorrentStores(new Map())
    this._starter = starter
    this._stopper = stopper
    this._torrentAdder = torrentAdder
    this._torrentRemover = torrentRemover

    /**
     * The purpose of this map is to provide a callback interface for `pay`,
     * which returns a `{@link TorrentStore}, but at the same time allows the
     * actual store to be created outside this store, fascilitating
     * design constraint (a)
     *
     * which at the same time allows payments to come in via
     * A call to `addTorrent` is considered pending when it has not yet
     * been matched with a corresponding call to `onNewTorrentStore`.
     * By matched, we mean for the same torrent, as identified by the hash.
     * This map contains the user supplied callback to `addTorrent`, recoverable
     * through the torrent has, for each such pending call.
     */
    this._pendingAddTorrentCallsMap = new Map()
    this._pendingRemoveTorrentCallsMap = new Map()
  }

  @action.bound
  setState(state) {
    this.state = state
  }

  @action.bound
  setStartedResources(startedResources) {
    this.startedResources = startedResources
  }

  @action.bound
  setOnboardingIsEnabled(onboardingIsEnabled) {
    this.onboardingIsEnabled = onboardingIsEnabled
  }

  @action.bound
  setApplicationSettingsStore(applicationSettingsStore) {
    this.applicationSettingsStore = applicationSettingsStore
  }

  @action.bound
  setWalletStore(walletStore) {
    this.walletStore = walletStore
  }

  @action.bound
  setPriceFeedStore(priceFeedStore) {
    this.priceFeedStore = priceFeedStore
  }

  @action.bound
  onNewTorrentStore(torrentStore) {

    const infoHash = torrentStore.infoHash

    // Check that we don't already
    if(this.torrentStores.has(infoHash))
      throw Error('Torrent already added')

    // Add to map
    this.torrentStores.set(infoHash, torrentStore)

    // Service any pending `addTorrent` user callback
    let userCallback = this._pendingAddTorrentCallsMap.get(infoHash)

    if(userCallback) {

      // cleanup
      this._pendingAddTorrentCallsMap.delete(infoHash)

      // make call
      userCallback(null, torrentStore)
    }

  }

  /**
   * Consider adding onAddTorrentFailed
   * in the future, to notify user of failed
   * attempts?
   */

  @action.bound
  onTorrentRemoved(infoHash) {

    if(!this.torrentStores.has(infoHash))
      throw Error('Torrent not present')

    // Its here, so lets remove it from the map
    this.torrentStores.delete(infoHash)

    // Service any pending `removeTorrent` user callbacks
    let userCallback = this._pendingRemoveTorrentCallsMap.get(infoHash)

    if(userCallback) {

      // cleanup
      this._pendingRemoveTorrentCallsMap.delete(infoHash)

      // make call
      userCallback(null)
    }

  }

  /**
   * Consider adding onTorrentRemoveFailed
   * in the future, to notify user of failed
   * attempts?
   */

  @action.bound
  _setTorrentStores(torrentStores) {
    this.torrentStores = torrentStores
  }

  @action.bound
  addTorrent (settings, onTorrentStoreAdded) {

    // We guard against duplicate pending calls
    if(this._pendingAddTorrentCallsMap.has(settings.infoHash)) {
      onTorrentStoreAdded('Cannot add a torrent while a prior call is still being resolved for the same torrent.')
      return
    }

    // Hold on to user callback
    this._pendingAddTorrentCallsMap.set(settings.infoHash, onTorrentStoreAdded)

    // Add
    this._torrentAdder(settings, (err, torrent) => {

      /**
       * The only reason we handle this callback is to catch when there is
       * a possible failure. In a success scenario, we must wait for the underlying
       * domain state manager to construct a `TorrentStore` instance and call
       * `onNewTorrentStore`
       */

      if(err)
        onTorrentStoreAdded(err)
    })
  }

  @action.bound
  removeTorrent (infoHash, deleteData, onTorrentRemoved) {

    if(this._pendingRemoveTorrentCallsMap.has(infoHash)) {
      onTorrentRemoved('Cannot remove torrent while pror call is still being respøved for the same torrent')
      return
    }

    // Hold on to user callback
    this._pendingRemoveTorrentCallsMap.set(infoHash, onTorrentRemoved)

    this._torrentRemover(infoHash, deleteData, (err) => {
      // Don't do anything here.. application will emit 'torrentRemoved', which is handled by UIStore
      // which will in turn call this.onTorrentRemoved()
    })
  }

  @action.bound
  start() {
    this._starter()
  }

  @action.bound
  stop () {
    this._stopper()
  }

}

export default ApplicationStore
