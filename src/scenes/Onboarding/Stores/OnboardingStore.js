/**
 * Created by bedeho on 04/10/17.
 */

import { observable, action } from 'mobx'
import {WHY_BCH} from '../../../constants'

/**
 * (MOBX) User interface store for the onboarding
 */
class OnboardingStore {

  static STATE = {
    WelcomeScreen: 0,
    BalanceExplanation: 1,
    DisabledFeaturesExplanation: 2,
    Silent: 3,
    DepartureScreen: 4
  }

  /**
   * {OnboardingState} State of onboarding
   */
  @observable state

  /**
   * {Boolean} Whether the BCH notice should be displayed on the wallet scene
   */
  @observable showBCHNoticeInWallet

  constructor (uiStore, state, showBCHNoticeInWallet, linkOpener) {
    this._uiStore = uiStore
    this.setState(state)
    this.setShowBCHNoticeInWallet(showBCHNoticeInWallet)
    this._linkOpener = linkOpener
  }

  @action.bound
  setState (state) {
    this.state = state
  }

  @action.bound
  setShowBCHNoticeInWallet(showBCHNoticeInWallet) {
    this.showBCHNoticeInWallet = showBCHNoticeInWallet
  }

  @action.bound
  skipAddingExampleTorrents () {
    if (this.state === OnboardingStore.STATE.WelcomeScreen) {
      this.setState(OnboardingStore.STATE.BalanceExplanation)
    }
  }

  @action.bound
  acceptAddingExampleTorrents () {

    if (this.state === OnboardingStore.STATE.WelcomeScreen) {

      this._uiStore.addExampleTorrents()

      this.setState(OnboardingStore.STATE.BalanceExplanation)
    }
  }

  @action.bound
  balanceExplanationAccepted () {
    if (this.state === OnboardingStore.STATE.BalanceExplanation) {
      this.setState(OnboardingStore.STATE.DisabledFeaturesExplanation)
    }
  }

  @action.bound
  disabledFeaturesExplanationAccepted () {
    if (this.state === OnboardingStore.STATE.DisabledFeaturesExplanation) {
      this.setState(OnboardingStore.STATE.Silent)
    }
  }

  @action.bound
  displayShutdownMessage () {
    // Regardless of what state we are in, we always allow shutting down
    this.setState(OnboardingStore.STATE.DepartureScreen)
  }

  @action.bound
  shutDownMessageAccepted () {
    if (this.state === OnboardingStore.STATE.DepartureScreen) {
      this.setState(OnboardingStore.STATE.Silent)
      this._uiStore.closeApplication()
    }
  }

  @action.bound
  acceptBCHInformationNotice = () => {
    this.setShowBCHNoticeInWallet(false)
  }

  @action.bound
  whyBCH = () => {
    this._linkOpener(WHY_BCH)
  }
}

export default OnboardingStore
