/**
 * Created by bedeho on 21/11/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

const assert = require('assert')

/// Wallet
import {SendDialogStore} from '../../Stores'

/// Sub-components
import Dialog from '../../../../components/Dialog'
import EmptyWalletWarningForm from './EmptyWalletWarningForm'
import UserProvidingAmountForm from './UserProvidingAmountForm/UserProvidingAmountForm'
import UserProvidingRecipientAddressForm from './UserProvidingRecipientAddressForm/UserProvidingRecipientAddressForm'
import AttemptingToSendPayment from './AttemptingToSendPayment'
import PaymentCompletedForm from './PaymentCompletedForm'
import PaymentFailedForm from './PaymentFailedForm'

const SendDialog = observer((props) => {

  let visibleSendDialog = !!props.sendDialogStore

  let form = null
  let onRequestClose = () => {}
  let title = 'Send'

  if(visibleSendDialog) {

    switch(props.sendDialogStore.activeForm) {

      case SendDialogStore.FORM.EMPTY_WALLET_WARNING:
        form = <EmptyWalletWarningForm onClick={props.sendDialogStore.close}/>
        title = 'Wallet is empty'
        break

      case SendDialogStore.FORM.USER_PROVIDING_AMOUNT:
        form = <UserProvidingAmountForm userProvidingAmountFormStore={props.sendDialogStore.userProvidingAmountFormStore}/>
        title = 'Amount'
        break

      case SendDialogStore.FORM.USER_PROVIDING_RECIPIENT_ADDRESS:
        form = <UserProvidingRecipientAddressForm userProvidingRecipientAddressFormStore={props.sendDialogStore.userProvidingRecipientAddressFormStore} />
        title = 'Recipient'
        break

      case SendDialogStore.FORM.USER_PROVIDING_NOTE:
        form = <UserProvidingNoteForm {...props} />
        title = 'foo'
        break

      case SendDialogStore.FORM.ATTEMPTING_TO_SEND_PAYMENT:
        form = <AttemptingToSendPayment {...props} />
        title = 'Submitting payment'
        break

      case SendDialogStore.FORM.PAYMENT_COMPLETED:
        form = <PaymentCompletedForm {...props} onClick={props.sendDialogStore.close}/>
        title = 'Payment completed'
        break

      case SendDialogStore.FORM.PAYMENT_FAILED:
        form = <PaymentFailedForm paymentFailureErrorMessage={props.sendDialogStore.paymentFailureErrorMessage}
                                  onClick={props.sendDialogStore.close}/> // mhiAJ2EHEK2WG6ubNuCvwDwxdrzMZUftGb
        title = 'Payment failed'
        break

      default:
        assert(false)
    }

    onRequestClose = props.sendDialogStore.close

  }

  return (
    <Dialog title={title}
            open={visibleSendDialog}
            onRequestClose={onRequestClose}
            width="650px"
    >
      {form}
    </Dialog>
  )
})

SendDialog.propTypes = {
  sendDialogStore : PropTypes.object // HMR breaks => PropTypes.instanceOf(SendDialogStore)
}

export default SendDialog
