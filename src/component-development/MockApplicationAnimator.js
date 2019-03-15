import Application from '../core/Application'
import Wallet, {Payment} from '../core/Wallet'
import ApplicationSettings from '../core/ApplicationSettings'
import {
  MockApplication,
  MockWallet,
  MockApplicationSettings,
  MockTorrent,
  MockPriceFeed,
  MockPayment
} from '../../test/core/Mocks'

import bcoin from 'bcoin'

/**
 * Case specific animator of mocked application.
 */
class MockApplicationAnimator {
  
  /**
   * {MockApplication} Mock application being animated
   */
  mockApplication
  
  constructor(withOnboarding) {
    
    this.mockApplication = new MockApplication(
      Application.STATE.STOPPED,
      [],
      withOnboarding,
      {
      
      }
    )
    
  }
  
  startApp() {
    this.mockApplication.setState(Application.STATE.STARTING)
  }

  startSettings(opts = { claimedFreeBCH : false }) {

    let mockApplicationSettings = new MockApplicationSettings(opts)

    this.mockApplication.applicationSettings = mockApplicationSettings
    this.mockApplication.emit('resourceStarted', Application.RESOURCE.SETTINGS)

    mockApplicationSettings.state = ApplicationSettings.STATE.OPENED
  }
  
  setWallet() {
    
    let mockWallet = new MockWallet(Wallet.STATE.STOPPED)

    this.mockApplication.startWallet(mockWallet)
  }

  setPriceFeed(defaultRate = 12312) {

    let priceFeed = new MockPriceFeed(defaultRate)

    this.mockApplication.startPriceFeed(priceFeed)
  }

  addSomePayments() {

    let mockPayments = [
      new MockPayment(
        Payment.TYPE.INBOUND,
        '2957403759', // txid
        1,
        new Date(),
        new Date(),
        new bcoin.address(),
        7894830293,
        123132,
        false,
        '57489023570834',
        2738921,
        'This is my note')
    ]

    mockPayments.forEach((p) => {
      this.mockApplication.wallet.addMockPayment(p)
    })

  }
  
  fastForwardWallet(state = Wallet.STATE.STARTED) {
    this.startApp()
    this.startSettings()
    this.setPriceFeed()
    this.setWallet()
    this.mockApplication.wallet.setState(state)
  }
  
  addTorrent(torrent) {
    this.mockApplication.torrents.set(torrent.infoHash, torrent)
    this.mockApplication.emit('torrentAdded', torrent)
  }
  
  /**
  addMockedTorrents(number = 5) {
    
    let torrents = []
  
    for(var i = 0;i  < number;i++) {
  
      let infoHash = 'hash:' + i + this.mockApplication.torrents.length
  
      let mockedTorrent = new MockTorrent()
  
      mockedTorrent.setInfoHash(infoHash)
  
      torrents.push(mockedTorrent)
    }
    
    this._addTorrents(torrents)
  }
   */
  
  addMockedDownloadingTorrents(number = 5) {
  
    let torrents = []
  
    for(var i = 0;i < number;i++) {
      
      let infoHash = 'hash:' + (i + this.mockApplication.torrents.size)
      
      let mockedTorrent = new MockTorrent(infoHash, 'Active.DownloadIncomplete')
      
      torrents.push(mockedTorrent)
    }
  
    this._addTorrents(torrents)
  
  }
  
  _addTorrents(torrents) {
    
    torrents.forEach((torrent) => {
      this.addTorrent(torrent)
    })
  }
}

export default MockApplicationAnimator