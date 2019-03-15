/**
 * Created by bedeho on 15/03/2018.
 */

import {observable, action, computed} from 'mobx'

class ClaimFreeBCHFlowStore {

  /**
   * Possible stages for claim flow.
   * @type {{WAITING_FOR_SERVER_REPLY: number, DISPLAY_FAILURE_MESSAGE: number, DISPLAY_SUCCESS_MESSAGE: number}}
   */
  static STAGE = {
    WAITING_FOR_SERVER_REPLY : 0,
    DISPLAY_FAILURE_MESSAGE : 1,
    DISPLAY_SUCCESS_MESSAGE : 2
  }

  /**
   * {ClaimFreeBCHFlowStore.STAGE}
   */
  @observable stage

  /**
   * {ErrorCodes|null} possible error cause when at stage `STAGE.DISPLAY_FAILURE_MESSAGE`
   */
  error

  constructor(walletSceneStore, stage, error) {
    this._walletSceneStore = walletSceneStore
    this.setStage(stage)
    this.error = error
  }

  @action.bound
  setStage(stage) {
    this.stage = stage
  }

  @action.bound
  close = () => {
    this._walletSceneStore.closeCurrentDialog()
  }

}

export default ClaimFreeBCHFlowStore