/**
 * Created by bedeho on 16/03/2018.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

const assert = require('assert')

import ClaimFreeBCHFlowStore from '../../Stores/ClaimFreeBCHFlowStore'

import Dialog from '../../../../components/Dialog'
import WaitingForServerReplyForm from './WaitingForServerReplyForm'
import SuccessForm from './SuccessForm'
import FailedForm from './FailedForm'

const ClaimFreeBCHFlowDialog = observer((props) => {

  let visible = !!props.claimFreeBCHFlowDialogStore
  let form = null
  let title = null
  let onRequestClose = () => {}

  if(visible) {

    onRequestClose = props.claimFreeBCHFlowDialogStore.close

    if(props.claimFreeBCHFlowDialogStore.stage === ClaimFreeBCHFlowStore.STAGE.WAITING_FOR_SERVER_REPLY) {
      title = "Claiming your coins"
      form = <WaitingForServerReplyForm />
    }
    else if(props.claimFreeBCHFlowDialogStore.stage === ClaimFreeBCHFlowStore.STAGE.DISPLAY_SUCCESS_MESSAGE) {
      title = "Coins acquired"
      form = <SuccessForm onClick={props.claimFreeBCHFlowDialogStore.close}/>
    }
    else if(props.claimFreeBCHFlowDialogStore.stage === ClaimFreeBCHFlowStore.STAGE.DISPLAY_FAILURE_MESSAGE) {
      title = "Couldn't get your coins"
      form = <FailedForm error={props.claimFreeBCHFlowDialogStore.error}
                         onClick={props.claimFreeBCHFlowDialogStore.close}
      />
    }
    else
      assert(false, 'Invalid ClaimFreeBCHFlowStore.STAGE')

  }

  return (
    <Dialog title={title}
            open={visible}
            onRequestClose={onRequestClose}
            width="500px"
    >
      {
        form
      }
    </Dialog>
  )
})

ClaimFreeBCHFlowDialog.propTypes = {
  claimFreeBCHFlowDialogStore : PropTypes.object // HMR breaks => PropTypes.instanceOf(ClaimFreeBCHFlowDialogStore)
}

export default ClaimFreeBCHFlowDialog
