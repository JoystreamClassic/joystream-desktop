/**
 * Created by bedeho on 01/11/2017.
 */

import {observable, action, runInAction, computed, autorun} from 'mobx'
const {clipboard} = require('electron')

import CashAddressFormat from '../CashAddressFormat'

class ReceiveDialogStore {

  /**
   * {Bool} Whether address should be displayed as QR code,
   * or alternatively, as a string
   */
  @observable showAddressAsQRCode

 /**
  * {Bool} Wether to show a copied to clipboard alert to user
  * or not
  */
  @observable displayCopiedToClipBoardAlert

  /**
   * Constructor
   * @param {WalletSceneStore} walletSceneStore -
   */
  constructor(walletSceneStore, walletStore, showAddressAsQRCode) {
    this._walletSceneStore = walletSceneStore
    this._walletStore = walletStore
    this.hideCopiedToClipBoardAlert()
    this.setShowAddressAsQRCode(showAddressAsQRCode)
  }

  @action.bound
  setShowAddressAsQRCode(showAddressAsQRCode) {
    this.showAddressAsQRCode = showAddressAsQRCode
  }

  @action.bound
  flipAddressDisplayMode = () => {
    this.setShowAddressAsQRCode(!this.showAddressAsQRCode)
    this.hideCopiedToClipBoardAlert()
  }

  @action.bound
  copyToClipBoard() {
    console.log('copied address to clipboards')
    clipboard.writeText(this.receiveAddress)

    this.showCopiedToClipBoardAlert()
  }

  @action.bound
  showCopiedToClipBoardAlert () {
    this.displayCopiedToClipBoardAlert = true
  }

  @action.bound
  hideCopiedToClipBoardAlert () {
    this.displayCopiedToClipBoardAlert = false
  }

  /**
   * {String} Receive address encoded as Bitcoin Cash CashAddress encoded string
   */
  @computed get
  receiveAddress () {
    return (new CashAddressFormat(this._walletStore.receiveAddress)).toString()
  }

  @action.bound
  close = () => {
    this._walletSceneStore.closeCurrentDialog()
    this.hideCopiedToClipBoardAlert()
  }

}

export default ReceiveDialogStore
