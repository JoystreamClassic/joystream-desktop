import OnboardingStore from '../../../src/scenes/Onboarding/Stores/'
import UIStore from '../../../src/scenes/UIStore'
import {MockApplication} from '../../core/Mocks'
import Application from '../../../src/core/Application'

var assert = require('chai').assert


describe('OnboardingStore', function () {
  
  let mockedApplication = new MockApplication(Application.STATE.STARTING, ['t1', 't2'], true)
  let uiStore = new UIStore(mockedApplication)
  let onboardingStore
  
  it('constructor initializes observables', function () {
    
    onboardingStore = new OnboardingStore(uiStore, OnboardingStore.STATE.WelcomeScreen, true, null)
    
    assert.equal(onboardingStore.state, OnboardingStore.STATE.WelcomeScreen)
    assert.equal(onboardingStore.showBCHNoticeInWallet, true)
  })
  
  /**
   * We should really test skipping adding example torrents
   * also
   */
  
  it('adds example torrents', function() {
    
    onboardingStore.acceptAddingExampleTorrents()
    
    assert.equal(onboardingStore.state, OnboardingStore.STATE.BalanceExplanation)
    assert.isTrue(mockedApplication.addExampleTorrents.calledOnce)
    
  })
  
  it('accepts balance explanation', function() {
    
    onboardingStore.balanceExplanationAccepted()
    
    assert.equal(onboardingStore.state, OnboardingStore.STATE.DisabledFeaturesExplanation)
    
  })
  
  it('accepts disabled features explanation', function() {
  
    onboardingStore.disabledFeaturesExplanationAccepted()
    
    assert.equal(onboardingStore.state, OnboardingStore.STATE.Silent)
  })
  
  it('displays shutdown message', function() {
    
    onboardingStore.displayShutdownMessage()
    
    assert.equal(onboardingStore.state, OnboardingStore.STATE.DepartureScreen)
  
  })
  
  it('accepts shutdown message', function() {
    
    onboardingStore.shutDownMessageAccepted()
    
    assert.equal(onboardingStore.state, OnboardingStore.STATE.Silent)
    assert.isTrue(mockedApplication.stop.calledOnce)
    
  
  })

  it('accepts BCH information notice acceptance', function() {

    onboardingStore.acceptBCHInformationNotice()

    assert.isFalse(onboardingStore.showBCHNoticeInWallet)
  })

})
