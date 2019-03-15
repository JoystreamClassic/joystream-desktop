import EventEmitter from 'events'
import sinon from 'sinon'

import Application from '../../../src/core/Application'

class MockApplication extends EventEmitter {
  
  /**
   * {Application.STATE} State of app
   */
  state
  
  /**
   * {Set.<Application.RESOURCES>} The resources which are currently started
   */
  startedResources
  
  /**
   * {Bool} Whether onboarding is enabled
   */
  onboardingIsEnabled
  
  /**
   * {Array.<String>} List of torrent file paths to use as examples in the onboarding
   */
  onboardingTorrents
  
  /**
   * @property {ElectronConfig} Application settings
   */
  applicationSettings
  
  /**
   * @property {Wallet}
   */
  wallet
  
  /**
   * @property {PriceFeed}
   */
  priceFeed
  
  /**
   * {Map<String.Torrent>} Map of torrents currently added
   */
  torrents
  
  constructor(state, onboardingTorrents, onboardingIsEnabled, opts = {}) {
    super()
    
    this.state = state
    this.startedResources = new Set()
    
    this.onboardingTorrents = onboardingTorrents
    this.onboardingIsEnabled = onboardingIsEnabled
    this.torrents = new Map()
    
    this.start = opts.start ? opts.start.bind(this) : sinon.spy()
    this.stop = opts.stop ? opts.stop.bind(this) : sinon.spy()
    this.addTorrent = opts.addTorrent ? opts.addTorrent.bind(this) : sinon.spy
    this.removeTorrent = opts.removeTorrent ? opts.removeTorrent.bind(this) : sinon.spy()
    this.addExampleTorrents = opts.addExampleTorrents ? opts.addExampleTorrents.bind(this) : sinon.spy()
  }
  
  setState(state) {
    this.state = state
    this.emit('state', state)
  }

  startWallet(mockWallet) {

    this.wallet = mockWallet
    this.emit('resourceStarted', Application.RESOURCE.WALLET)

  }

  startPriceFeed(priceFeed) {
    this.priceFeed = priceFeed
    this.emit('resourceStarted', Application.RESOURCE.PRICE_FEED)
  }
}

export default MockApplication