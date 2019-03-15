
var expect = require('chai').expect
import fs from 'fs'

import ApplicationSettings from '../../../src/core/ApplicationSettings'

const CONFIG_FILE_NAME = 'test-application-settings-store'

describe('ApplicationSettings', function() {

  let applicationSettings = null
  
  before(function() {
  
    /**
     * Make sure to delete any pre existing store,
     * e.g. from a prior run
     */
    
    let settings = new ApplicationSettings(CONFIG_FILE_NAME)
    
    settings.open()
    let filePath = settings.filePath()
    settings.close()
    
    fs.unlinkSync(filePath)
    
  })
  
  it('create', function() {
    
    // Check if file exists, if so, delete?
    
    applicationSettings = new ApplicationSettings(CONFIG_FILE_NAME)
    
    expect(applicationSettings.state).to.be.equal(ApplicationSettings.STATE.CLOSED)
    
  })
  
  it('open with defaults', function(done) {
  
    let DEFAULT_SETTINGS = {
      numberOfPriorSessions : 12312,
      downloadFolder : 'gello',
      useAssistedPeerDiscovery : false,
      bittorrentPort : 12387192,
      defaultBuyerTerms : {
        test: 98,
        is : false
      },
      defaultSellerTerms : {
        h: 'my-string',
      },
      termsAccepted : true,
      defaultClientPreference : 'not_set',
      claimedFreeBCH : false
    }
    
    // wait for opened signal,
    applicationSettings.on('opened', () => {
  
      expect(applicationSettings.state).to.be.equal(ApplicationSettings.STATE.OPENED)
  
      // and assert defaults being set
      expect(applicationSettings.numberOfPriorSessions()).to.be.equal(DEFAULT_SETTINGS.numberOfPriorSessions)
      expect(applicationSettings.downloadFolder()).to.be.equal(DEFAULT_SETTINGS.downloadFolder)
      expect(applicationSettings.useAssistedPeerDiscovery()).to.be.equal(DEFAULT_SETTINGS.useAssistedPeerDiscovery)
      expect(applicationSettings.bittorrentPort()).to.be.equal(DEFAULT_SETTINGS.bittorrentPort)
      expect(applicationSettings.defaultBuyerTerms()).to.deep.equal(DEFAULT_SETTINGS.defaultBuyerTerms)
      expect(applicationSettings.defaultSellerTerms()).to.deep.equal(DEFAULT_SETTINGS.defaultSellerTerms)
      expect(applicationSettings.termsAccepted()).to.deep.equal(DEFAULT_SETTINGS.termsAccepted)
      expect(applicationSettings.defaultClientPreference()).to.deep.equal(DEFAULT_SETTINGS.defaultClientPreference)
      expect(applicationSettings.claimedFreeBCH()).to.deep.equal(DEFAULT_SETTINGS.claimedFreeBCH)
      
      done()
      
    })
    
    // open with default values
    applicationSettings.open(
      DEFAULT_SETTINGS.numberOfPriorSessions,
      DEFAULT_SETTINGS.downloadFolder,
      DEFAULT_SETTINGS.useAssistedPeerDiscovery,
      DEFAULT_SETTINGS.bittorrentPort,
      DEFAULT_SETTINGS.defaultBuyerTerms,
      DEFAULT_SETTINGS.defaultSellerTerms,
      DEFAULT_SETTINGS.termsAccepted,
      DEFAULT_SETTINGS.defaultClientPreference,
      DEFAULT_SETTINGS.claimedFreeBCH
    )
    
  })
  
  it('checking get|set', function() {
    
    let NEW_SETTINGS = {
      numberOfPriorSessions : 123123253,
      downloadFolder : 'dghfsdfdsdfg',
      useAssistedPeerDiscovery : true,
      bittorrentPort : 76547,
      defaultBuyerTerms : {
        test: 11232,
        is : true
      },
      defaultSellerTerms : {
        h: 'masdfasdfasdfy-dsf',
      },
      termsAccepted : false,
      defaultClientPreference : 'set',
      claimedFreeBCH: true
    }
    
    // Set new values
    applicationSettings.setNumberOfPriorSessions(NEW_SETTINGS.numberOfPriorSessions)
    applicationSettings.setDownloadFolder(NEW_SETTINGS.downloadFolder)
    applicationSettings.setUseAssistedPeerDiscovery(NEW_SETTINGS.useAssistedPeerDiscovery)
    applicationSettings.setBittorrentPort(NEW_SETTINGS.bittorrentPort)
    applicationSettings.setDefaultBuyerTerms(NEW_SETTINGS.defaultBuyerTerms)
    applicationSettings.setDefaultSellerTerms(NEW_SETTINGS.defaultSellerTerms)
    applicationSettings.setTermsAccepted(NEW_SETTINGS.termsAccepted)
    applicationSettings.setDefaultClientPreference(NEW_SETTINGS.defaultClientPreference)
    applicationSettings.setClaimedFreeBCH(NEW_SETTINGS.claimedFreeBCH)
    
    // assert new values
    expect(applicationSettings.numberOfPriorSessions()).to.be.equal(NEW_SETTINGS.numberOfPriorSessions)
    expect(applicationSettings.downloadFolder()).to.be.equal(NEW_SETTINGS.downloadFolder)
    expect(applicationSettings.useAssistedPeerDiscovery()).to.be.equal(NEW_SETTINGS.useAssistedPeerDiscovery)
    expect(applicationSettings.bittorrentPort()).to.be.equal(NEW_SETTINGS.bittorrentPort)
    expect(applicationSettings.defaultBuyerTerms()).to.deep.equal(NEW_SETTINGS.defaultBuyerTerms)
    expect(applicationSettings.defaultSellerTerms()).to.deep.equal(NEW_SETTINGS.defaultSellerTerms)
    expect(applicationSettings.termsAccepted()).to.deep.equal(NEW_SETTINGS.termsAccepted)
    expect(applicationSettings.defaultClientPreference()).to.deep.equal(NEW_SETTINGS.defaultClientPreference)
    expect(applicationSettings.claimedFreeBCH()).to.deep.equal(NEW_SETTINGS.claimedFreeBCH)
    
  })
  
  it('close', function(done) {
    
    // wait for closed signal
    applicationSettings.on('closed', () => {
  
      expect(applicationSettings.state).to.be.equal(ApplicationSettings.STATE.CLOSED)
      
      done()
    })
    
    applicationSettings.close()
    
  })

})