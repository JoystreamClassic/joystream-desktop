/**
 * Created by bedeho on 23/11/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import {
  ButtonSection,
  PrimaryButton,
  Subtitle
} from '../../../../../components/Dialog'

import AddressInputField from './AddressInputField'

import assert from 'assert'

/// Wallet
import {
  UserProvidingRecipientAddressFormStore
} from '../../../Stores/SendDialogStore'

// Styling generator
function getStyles(props) {

  return {
    root : {
      display : 'flex',
      flexDirection : 'column'
    }
  }
}

const UserProvidingRecipientAddressForm = observer((props) => {

  let styles = getStyles(props)

  // Get error test
  let errorText = errorTextFromAddressValidationResult(props.userProvidingRecipientAddressFormStore.addressValidationResult)

  return (
    <div style={styles.root}>

      <div style={{ height : '50px'}}></div>

      <AddressInputField
        errorMessage={errorText}
        onChange={(e) => {props.userProvidingRecipientAddressFormStore.setLastProposedAddress(e.target.value)}}
      />

      <div style={{ height : '40px'}}></div>

      <ButtonSection>

        <PrimaryButton label="Make payment"
                       onClick={props.userProvidingRecipientAddressFormStore.next}
                       disabled={props.userProvidingRecipientAddressFormStore.addressValidationResult !== UserProvidingRecipientAddressFormStore.ADDRESS_VALIDATION_RESULT_TYPE.VALID}

        />

      </ButtonSection>

    </div>
  )
})

function errorTextFromAddressValidationResult(result) {

  let text = null

  switch(result) {

    case UserProvidingRecipientAddressFormStore.ADDRESS_VALIDATION_RESULT_TYPE.EMPTY:
      text = null
      break
    case UserProvidingRecipientAddressFormStore.ADDRESS_VALIDATION_RESULT_TYPE.INVALID_NON_EMPTY_FORMATTING:
      text = 'Invalid address'
      break
    case UserProvidingRecipientAddressFormStore.ADDRESS_VALIDATION_RESULT_TYPE.VALID:
      text = null
      break
    default:
      assert(false)
  }

  return text

}

UserProvidingRecipientAddressForm.propTypes = {
  userProvidingRecipientAddressFormStore : PropTypes.object // HMR breaks instanceOf(UserProvidingRecipientAddressFormStore)
}

export default UserProvidingRecipientAddressForm