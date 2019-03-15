/**
 * Created by bedeho on 24/11/2017.
 */

import {observable, action, computed} from 'mobx'

import bcoin from 'bcoin'

/**
 * Model for form where user provides amount.
 */
class UserProvidingAmountFormStore {

  /**
   * Result from attempting to validate an amount proposed for the payment
   * @type {{VALID: number, EMPTY: number, INVALID_AMOUNT_FORMAT: number, AMOUNT_TOO_SMALL: number, AMOUNT_TOO_LARGE: number}}
   */
  static AMOUNT_VALIDATION_RESULT_TYPE = {
    EMPTY : 0,
    INVALID_AMOUNT_FORMAT : 1,
    AMOUNT_TOO_SMALL : 2,
    AMOUNT_TOO_LARGE : 3,
    VALID : 4,
  }

  static INPUT_CURRENCY = {
    CRYPTO : 0,
    FIAT : 1
  }

  /**
   * {Currency} Currency be used to input amount (LATER)
   */
  @observable inputCurrencyType

  /**
   * {String} Last amount, in units of `inputCurrencyType`
   */
  @observable lastProposedAmount

  /**
   * {Number}
   * NB: Notice that this is not an observable, as we do not intend
   * to update it during the lifetime of the store.
   */
  cryptoToFiatExchangeRate

  /**
   * {Number} Total fee (satoshis) for payment transactions
   */
  totalFee

  /**
   * {Number} Minimum amount of funds (satoshis) required
   */
  minimumPaymentAmount


  constructor(sendDialogStore, lastProposedAmount, inputCurrencyType, cryptoToFiatExchangeRate, walletStore, totalFee, minimumPaymentAmount) {

    this._sendDialogStore = sendDialogStore
    this.setLastProposedAmount(lastProposedAmount)
    this.setInputCurrencyType(inputCurrencyType)
    this.cryptoToFiatExchangeRate = cryptoToFiatExchangeRate

    this._walletStore = walletStore
    this.totalFee = totalFee
    this.minimumPaymentAmount = minimumPaymentAmount
  }

  @action.bound
  setLastProposedAmount(lastProposedAmount) {
    this.lastProposedAmount = lastProposedAmount
  }

  @action.bound
  setInputCurrencyType(inputCurrencyType) {

    // If new input type is crypto, but the existing one is fiat, then make conversion
    if(inputCurrencyType === UserProvidingAmountFormStore.INPUT_CURRENCY.CRYPTO &&
        this.inputCurrencyType === UserProvidingAmountFormStore.INPUT_CURRENCY.FIAT) {
      this.setLastProposedAmount(this.lastProposedAmount / this.cryptoToFiatExchangeRate)
    }

    // Likewise if new is fiat, but existing is crypto, then make opposite conversion
    if(inputCurrencyType === UserProvidingAmountFormStore.INPUT_CURRENCY.FIAT &&
        this.inputCurrencyType === UserProvidingAmountFormStore.INPUT_CURRENCY.CRYPTO) {
      this.setLastProposedAmount(this.lastProposedAmount * this.cryptoToFiatExchangeRate)
    }

    // Update actualy input currency type
    this.inputCurrencyType = inputCurrencyType
  }

  @computed get
  maximumPaymentAmountInSatoshis() {
    return Math.max(this._walletStore.totalBalance - this.totalFee, 0)
  }

  @computed get
  maximumPaymentAmount() {

    let maxInCRYPTO = this.maximumPaymentAmountInSatoshis / bcoin.protocol.consensus.COIN

    if(this.inputCurrencyType === UserProvidingAmountFormStore.INPUT_CURRENCY.FIAT)
      return maxInCRYPTO * this.cryptoToFiatExchangeRate
    else
      return maxInCRYPTO
  }

  @computed get
  amountValidationResult() {

    try {
      UserProvidingAmountFormStore.validatedAmount(this.amountToSatoshiRate, this.lastProposedAmount, this.minimumPaymentAmount, this.maximumPaymentAmountInSatoshis)
    } catch(validationResult) {
      return validationResult
    }

    return UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.VALID
  }

  @computed get
  secondaryAmount() {

    if(!this.lastProposedAmount)
      return null
    else if(this.amountValidationResult !== UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.VALID)
      return null
    else {

      if(this.inputCurrencyType === UserProvidingAmountFormStore.INPUT_CURRENCY.CRYPTO) {
        return this.lastProposedAmount * this.cryptoToFiatExchangeRate
      } else {
        return this.lastProposedAmount / this.cryptoToFiatExchangeRate
      }

    }
  }

  @computed get
  amountToSatoshiRate() {
    return bcoin.protocol.consensus.COIN * (this.inputCurrencyType === UserProvidingAmountFormStore.INPUT_CURRENCY.FIAT ? 1/this.cryptoToFiatExchangeRate : 1)
  }

  @action.bound
  maximizePayment() {
    this.setLastProposedAmount(this.maximumPaymentAmount)
  }

  @action.bound
  flipInputCurrency() {

    let other =
      this.inputCurrencyType === UserProvidingAmountFormStore.INPUT_CURRENCY.CRYPTO ?
      UserProvidingAmountFormStore.INPUT_CURRENCY.FIAT :
      UserProvidingAmountFormStore.INPUT_CURRENCY.CRYPTO

    this.setInputCurrencyType(other)
  }

  @action.bound
  next = () => {

    let amountInSatoshis = UserProvidingAmountFormStore.validatedAmount(this.amountToSatoshiRate, this.lastProposedAmount, this.minimumPaymentAmount, this.maximumPaymentAmountInSatoshis)

    this._sendDialogStore.finishedProvidingAmount(amountInSatoshis)
  }

  @action.bound
  close() {
    this._sendDialogStore.close()
  }

  /**
   * Validated payment amount
   * Gives rich validation, with detailed explanations of possible failures
   * @param amountToSatoshiRate {Number}
   * @param amount {Number} payment amount (in `inputCurrencyType`)
   * @param minimum {Number} minimum payment amount (in satoshis)
   * @param maximum {Number} maximum payment amount (in satoshis)
   * @returns {Number}
   */
  static validatedAmount(amountToSatoshiRate, amount, minimum, maximum) {

    if(!amount && amount !== 0)
      throw UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.EMPTY

    // Parse decimal amount
    let decimalAmount = filterFloat(amount)

    if(!decimalAmount)
      throw UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.INVALID_AMOUNT_FORMAT

    let amountInNumberOfSatoshis = Math.floor(decimalAmount * amountToSatoshiRate)

    if(amountInNumberOfSatoshis > maximum)
      throw UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.AMOUNT_TOO_LARGE
    else if(amountInNumberOfSatoshis < minimum)
      throw UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.AMOUNT_TOO_SMALL
    else
      return amountInNumberOfSatoshis

  }

}

var filterFloat = function(value) {
  if (/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(value))
    return Number(value);
  return NaN;
}

export default UserProvidingAmountFormStore
