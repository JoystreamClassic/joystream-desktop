/**
 * Created by bedeho on 24/11/2017.
 */

import {observable, action, computed} from 'mobx'

import bcoin from 'bcoin'
import CashAddressFormat from '../../CashAddressFormat'

class UserProvidingRecipientAddressForm {

  /**
   * Result from attempting to validate address
   * @type {{EMPTY: number, INVALID_NON_EMPTY_FORMATTING: number, VALID: number}}
   */
  static ADDRESS_VALIDATION_RESULT_TYPE = {
    EMPTY : 0,
    INVALID_NON_EMPTY_FORMATTING : 1,
    VALID : 2,
  }

  /**
   * {String} Last proposed recipient address
   */
  @observable lastProposedAddress

  /**
   * Constructor
   * @param sendDialogStore {SendDialogStore} -
   * @param lastProposedAddress {String} -
   */
  constructor(sendDialogStore, lastProposedAddress) {

    this._sendDialogStore = sendDialogStore

    if(typeof lastProposedAddress !== 'string')
      throw new Error('Bad argument type ' + (typeof lastProposedAddress) + ' of lastProposedAddress: must be String')

    this.setLastProposedAddress(lastProposedAddress)
  }

  @action.bound
  setLastProposedAddress(lastProposedAddress) {
    this.lastProposedAddress = lastProposedAddress
  }

  @computed get
  addressValidationResult() {

    try {
      UserProvidingRecipientAddressForm.validatedAddress(this.lastProposedAddress)
    } catch(validationResult) {
      return validationResult
    }

    return UserProvidingRecipientAddressForm.ADDRESS_VALIDATION_RESULT_TYPE.VALID
  }

  @action.bound
  next() {

    // Attempt to recover address, otherwise throws.
    // Any component which guards calling this function by looking at `addressValidationResult`
    // will be guaranteed to not trigger this exception.
    let address = UserProvidingRecipientAddressForm.validatedAddress(this.lastProposedAddress)

    this._sendDialogStore.finishedProvidingRecipientAddress(address)
  }

  @action.bound
  close() {
    this._sendDialogStore.close()
  }

  // NB: This should probably not be here,
  // Its nos possible to reuse this store, or the corresponding
  // component for a different address type or network.

  /**
   * Validated address conversion.
   * Gives rich validation, with detailed explanations of possible failures
   * @param {String} addressText -
   * @returns {Address}
   */
  static validatedAddress(addressText) {

    if(!addressText || addressText.length === 0)
      throw UserProvidingRecipientAddressForm.ADDRESS_VALIDATION_RESULT_TYPE.EMPTY

    // Try to recover bcoin address
    let address

    try {
      address = CashAddressFormat.fromString(addressText).bcoinAddress()
    } catch (err) {
      throw UserProvidingRecipientAddressForm.ADDRESS_VALIDATION_RESULT_TYPE.INVALID_NON_EMPTY_FORMATTING
    }

    return address

  }

}

export default UserProvidingRecipientAddressForm
