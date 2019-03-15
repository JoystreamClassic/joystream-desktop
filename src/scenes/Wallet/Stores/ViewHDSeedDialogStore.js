/**
 * Created by bedeho on 21/03/2018.
 */

import {observable, action, runInAction, computed, autorun} from 'mobx'

class ViewHDSeedDialogStore {

  /**
   * {Object}
   */
  @observable masterKey

  /**
   * Constructor
   * @param {WalletSceneStore} walletSceneStore -
   * @param {MasterKey} -
   */
  constructor(walletSceneStore, masterKey) {
    this._walletSceneStore = walletSceneStore
    this.setMasterKey(masterKey)
  }

  @action.bound
  setMasterKey(masterKey) {
    this.masterKey = masterKey
  }

  @action.bound
  close = () => {
    this._walletSceneStore.closeCurrentDialog()
  }

}

export default ViewHDSeedDialogStore
