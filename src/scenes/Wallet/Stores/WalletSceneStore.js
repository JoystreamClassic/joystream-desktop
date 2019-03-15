/**
 * Created by bedeho on 30/10/2017.
 */

import {observable, action, computed} from 'mobx'

import SendDialogStore from './SendDialogStore/SendDialogStore'
import ReceiveDialogStore from './ReceiveDialogStore'
import PaymentRowStore from './PaymentRowStore'
import ClaimFreeBCHFlowStore from './ClaimFreeBCHFlowStore'
import ViewHDSeedDialogStore from './ViewHDSeedDialogStore'

/**
 * Model for wallet scene.
 */
class WalletSceneStore {

  /**
   * {SendDialogStore|ReceiveDialogStore|ClaimFreeBCHFlowStore|null} store for currently visible modal dialog,
   * which is send, receive and view seed dialog
   */
  @observable visibleDialog

  /**
   * {String}
   */
  @observable searchString

  /**
   * {Boolean}
   */
  @observable allowAttemptToClaimFreeBCH

  /**
   * Constructor
   * @param {WalletStore} walletStore -
   * @param {PriceFeedStore} priceFeedStore -
   * @param {Number} satsPrkBFee
   * @param {SendDialogStore|ReceiveDialogStore} visibleDialog - currently visible dialog
   * @param {String} searchString - search string
   * @param {Boolean} allowAttemptToClaimFreeBCH - whether to allow user attempt to claim free BCH from faucet
   * @param {Func} launchExternalTxViewer
   * @param {Func} claimFreeBCHAttemptHandler - handler for attempts to claim free BCH
   * @param {Number} numberOfUnitsPerCoin -  the number of base unit in coin
   */
  constructor(walletStore, priceFeedStore, satsPrkBFee, visibleDialog, searchString, allowAttemptToClaimFreeBCH, launchExternalTxViewer, claimFreeBCHAttemptHandler, numberOfUnitsPerCoin) {

    this._walletStore = walletStore
    this._priceFeedStore = priceFeedStore
    this._satsPrkBFee = satsPrkBFee
    this.setVisibleDialog(visibleDialog)
    this.setSearchString(searchString)
    this.setAllowAttemptToClaimFreeBCH(allowAttemptToClaimFreeBCH)
    this._launchExternalTxViewer = launchExternalTxViewer
    this._claimFreeBCHAttemptHandler = claimFreeBCHAttemptHandler
    this._numberOfUnitsPerCoin = numberOfUnitsPerCoin
  }

  @action.bound
  setVisibleDialog(visibleDialog) {
    this.visibleDialog = visibleDialog
  }

  @action.bound
  setSearchString(string) {
    this.searchString = string
  }

  @action.bound
  setAllowAttemptToClaimFreeBCH(allowAttemptToClaimFreeBCH) {
    this.allowAttemptToClaimFreeBCH = allowAttemptToClaimFreeBCH
  }

  @action.bound
  sendClicked() {

    if(this.visibleDialog !== null)
      throw new Error('Dialog already visible')

    // Create dialog store

    let cryptoToFiatExchangeRate = parseFloat(this._priceFeedStore.cryptoToUsdExchangeRate)
    let paymentFailureErrorMessage = ''
    let minimumPaymentAmount = 547 // pass in dust limit

    // Its critical that the actual fee rate is compatible with bcoin.util.isNumber, which requires that its a safe integer,
    // hence we just take ceiling to be sure.
    let satsPrKbFee = Math.ceil(this._satsPrkBFee)

    let sendDialogStore = new SendDialogStore(this,cryptoToFiatExchangeRate, this._walletStore, paymentFailureErrorMessage, satsPrKbFee, minimumPaymentAmount)

    // set it
    this.setVisibleDialog(sendDialogStore)
  }

  @action.bound
  receiveClicked() {

    if(this.visibleDialog !== null)
      throw new Error('Dialog already visible')

    // Create store for receive dialog
    let store = new ReceiveDialogStore(this, this._walletStore)

    this.setVisibleDialog(store)
  }

  @action.bound
  viewWalletSeedClicked() {

    if(this.visibleDialog !== null)
      throw new Error('Dialog already visible')

    let store = new ViewHDSeedDialogStore(this, this._walletStore.masterKey)

    this.setVisibleDialog(store)
  }

  @action.bound
  closeCurrentDialog() {
    this.setVisibleDialog(null)
  }

  @action.bound
  viewPayment(txId, outputIndex) {

    this._launchExternalTxViewer(txId, outputIndex)
  }

  @action.bound
  claimFreeBCH = () => {

    this._claimFreeBCHAttemptHandler()

  }

  @computed get
  synchronizationPercentage() {
    return 100*this._walletStore.synchronizedBlockHeight/this._walletStore.blockTipHeight
  }

  @computed get
  pendingBalance() {
    let pendingBalance = this._walletStore.totalBalance - this._walletStore.confirmedBalance

    if (pendingBalance < 0) {
      debugger
    }

    return pendingBalance
  }

  @computed get
  totalBalance() {
    return this._walletStore.totalBalance
  }

  @computed get
  inboundPayments() {
    this._walletStore.paymentStores.filter((paymentStore) => { return paymentStore.type === Payment.Type.INBOUND})
  }

  @computed get
  outboundPayments() {
    this._walletStore.paymentStores.filter((paymentStore) => { return paymentStore.type === Payment.Type.OUTBOUND})
  }

  @computed get
  filteredPayments() {

    // If no search string is available, then we just return
    // unfiltered set of payments
    if(!this.searchString || this.searchString.length === 0)
      return this._walletStore.paymentStores
    else
      return this._walletStore.paymentStores.filter((paymentStore) => {

        let foundMatchingPayment =

        // Match note
        (paymentStore.note && paymentStore.note.indexOf(this.searchString) != -1) ||

        // Match destination address
        (paymentStore.toAddress && paymentStore.toAddress.indexOf(this.searchString) != -1) ||

        // Match txId
        (paymentStore.txId && paymentStore.txId.indexOf(this.searchString) != -1)


        return foundMatchingPayment
    })
  }

  @computed get
  paymentRowStores() {

    return this.filteredPayments.map((paymentStore) => {
      return new PaymentRowStore(paymentStore, this._priceFeedStore, this._numberOfUnitsPerCoin, this.viewPayment)
    })
  }

  @computed get
  filteredPaymentRowStores() {

    return this.paymentRowStores
      .sort(comparePayments)
  }

  @computed get
  sortedAndFilteredPaymentRowStores() {

    return this.paymentRowStores.sort((a, b) => {
      return b.date - a.date
    })
  }

}

/**
 * Comparer for two payments by `date` property, ranking
 * more recent dates first.
 *
 * @param p1
 * @param p2
 * @returns {Number} - value follows normal comparer sementics
 */
function comparePayments(p1, p2) {

  if(!p1.date)
    return -1 // p1 first
  else if(!p2.date)
    return 1 // p2 first
  else
    return p2.date - p1.date // elapsed time in ms
}

export default WalletSceneStore
