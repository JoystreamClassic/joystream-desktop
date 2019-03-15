/**
 * Created by bedeho on 01/11/2017.
 */

import {observable, action, computed} from 'mobx'

import UserProvidingAmountFormStore from './UserProvidingAmountFormStore'
import UserProvidingRecipientAddressFormStore from './UserProvidingRecipientAddressFormStore'

import assert from 'assert'

/**
 * Model for send dialog.
 */
class SendDialogStore {

  /**
   * Possible states for sending dialog
   * @type {{EMPTY_WALLET_WARNING: number, TAKING_USER_INPUTS: number, PROCESSING_PAYMENT: number, PAYMENT_COMPLETED: number, PAYMENT_FAILED: number}}
   */
  static FORM = {
    EMPTY_WALLET_WARNING : 0,
    USER_PROVIDING_AMOUNT : 1,
    USER_PROVIDING_RECIPIENT_ADDRESS : 2,
    USER_PROVIDING_NOTE : 3,
    ATTEMPTING_TO_SEND_PAYMENT : 4,
    PAYMENT_COMPLETED : 5,
    PAYMENT_FAILED : 6
  }

  /**
   * {FORM} Currently active form in this dialog
   */
  @observable activeForm

  /**
   * {UserProvidingAmountFormStore}
   */
  userProvidingAmountFormStore

  /**
   * {UserProvidingRecipientAddressFormStore}
   */
  userProvidingRecipientAddressFormStore

  /**
   * {String}
   */
  paymentFailureErrorMessage

  /**
   * Constructor
   * @param {WalletSceneStore} walletSceneStore - store for wallet scene
   * @param {String} paymentFailureErrorMessage - error message from failed payment
   * @param {Number} satsPrkBFee - number of satoshis per kB.
   * @param {Number} minimumPaymentAmount - minimum number of satoshis
   */
  constructor(walletSceneStore, cryptoToFiatExchangeRate, walletStore, paymentFailureErrorMessage, satsPrkBFee, minimumPaymentAmount) {

    this._walletSceneStore = walletSceneStore
    this._walletStore = walletStore
    this.paymentFailureErrorMessage = paymentFailureErrorMessage
    this._satsPrKbFee = satsPrkBFee
    this._minimumPaymentAmount = minimumPaymentAmount

    // Determine whether there are enough funds to show the normal form,
    // or if the wallet is empty.
    let activeForm

    if(this._walletStore.totalBalance === 0)
      activeForm = SendDialogStore.FORM.EMPTY_WALLET_WARNING
    else
      activeForm = SendDialogStore.FORM.USER_PROVIDING_AMOUNT

    this.setActiveForm(activeForm)

    // Generous rough estimate for a payment tx fee
    const totalFee = Math.ceil((350 / 1024) * this._satsPrKbFee)

    // Create sub stores
    this.userProvidingAmountFormStore = new UserProvidingAmountFormStore(this, '', UserProvidingAmountFormStore.INPUT_CURRENCY.FIAT, cryptoToFiatExchangeRate, this._walletStore, totalFee, this._minimumPaymentAmount)
    this.userProvidingRecipientAddressFormStore = new UserProvidingRecipientAddressFormStore(this, '')
  }

  @action.bound
  setActiveForm(activeForm) {
    this.activeForm = activeForm
  }

  /// Navigators when on USER_PROVIDING_AMOUNT form

  finishedProvidingAmount() {

    // Check that we are in the right state
    if(this.activeForm !== SendDialogStore.FORM.USER_PROVIDING_AMOUNT)
      throw new Error('Only allowed when on form: SendDialogStore.FORM.USER_PROVIDING_AMOUNT')
    else
      this.setActiveForm(SendDialogStore.FORM.USER_PROVIDING_RECIPIENT_ADDRESS)

  }

  /// Navigators for USER_PROVIDING_RECIPIENT_ADDRESS form

  finishedProvidingRecipientAddress = (skipProvidingNote = true) => {

    // Check that we are in the right state
    if(this.activeForm !== SendDialogStore.FORM.USER_PROVIDING_RECIPIENT_ADDRESS)
      throw new Error('Only allowed when on form: SendDialogStore.FORM.USER_PROVIDING_RECIPIENT_ADDRESS')
    else {

      if(skipProvidingNote) {

        this.setActiveForm(SendDialogStore.FORM.ATTEMPTING_TO_SEND_PAYMENT)

        this._initiatePayment(this.userProvidingRecipientAddressFormStore.lastProposedAddress, this.userProvidingAmountFormStore.lastProposedAmount, null)

      } else
        this.setActiveForm(SendDialogStore.FORM.USER_PROVIDING_NOTE)
    }

  }

  /// Navigators for USER_PROVIDING_NOTE

  finishedProvidingNote = (note) => {

    if(this.activeForm !== SendDialogStore.FORM.USER_PROVIDING_NOTE)
      new Error('Only allowed when on form: SendDialogStore.FORM.USER_PROVIDING_NOTE')
    else {

      this.setActiveForm(SendDialogStore.FORM.ATTEMPTING_TO_SEND_PAYMENT)

      this._initiatePayment(this.userProvidingRecipientAddressFormStore.lastProposedAddress, this.userProvidingAmountFormStore.lastProposedAmount, note)
    }

  }

  _initiatePayment(addressString, amountString, note) {

    /// Recover params from forms

    // bcoin.Address from addressString
    let address = UserProvidingRecipientAddressFormStore.validatedAddress(addressString)

    // amount

    // In the future, deduct estimate of full tx fee based on
    // this.totalFee, for now we just omit, since its not clear
    // how to do this in bcoin
    let maximumPaymentAmount = this._walletStore.totalBalance - 0

    let amount = UserProvidingAmountFormStore.validatedAmount(this.userProvidingAmountFormStore.amountToSatoshiRate, amountString, this._minimumPaymentAmount, maximumPaymentAmount)

    // If we get this far, update form
    this.setActiveForm(SendDialogStore.FORM.ATTEMPTING_TO_SEND_PAYMENT)

    this._walletStore.pay(address, amount, this._satsPrKbFee, note)
      .then((paymentStore) => {

        // We should still be in the same state
        assert(this.activeForm === SendDialogStore.FORM.ATTEMPTING_TO_SEND_PAYMENT)

        // Update state
        this.setActiveForm(SendDialogStore.FORM.PAYMENT_COMPLETED)

      })
      .catch((err) => {

        console.log('[_initiatePayment] walletStore.pay failed:')
        console.log(err)

        // We should still be in the same state
        assert(this.activeForm === SendDialogStore.FORM.ATTEMPTING_TO_SEND_PAYMENT)

        // Store error message
        this.paymentFailureErrorMessage = err.message

        // Update state
        this.setActiveForm(SendDialogStore.FORM.PAYMENT_FAILED)

      })

  }

  @action.bound
  close = () => {
    this._walletSceneStore.closeCurrentDialog()
  }

}

export default SendDialogStore
