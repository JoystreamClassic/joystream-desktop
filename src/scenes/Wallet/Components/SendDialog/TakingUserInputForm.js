/**
 * Created by bedeho on 22/11/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

/// Sub-components
import TextField from 'material-ui/TextField'
import {ButtonSection, PrimaryButton} from '../../../../components/Dialog'

/// Wallet
import {SendDialogStore} from '../../Stores'

// Styling generator
function getStyles(props) {

  return {
    root : {
      display : 'flex',
      flexDirection : 'column'
    }
  }
}

const TakingUserInputForm = observer((props) => {

  let styles = getStyles(props)

  // todo
  // * set default text values
  // --> hook into validation of addresses
  // --> only enable send when all values are set
  // units for satoshis? => for mainnet we need to add some sort of exhange rate thing
  // allow setting _all_ for funds
  // detect when value exceeds total in wallet

  // restyle (severly)
  // much larger text
  // other color and dimensions
  // other font

  return (
    <div style={styles.root}>
      <TextField
        hintText="for example 1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2 "
        floatingLabelText="RECIPIENT ADDRESS"
        errorText={props.sendDialogStore.warnAboutInvalidityOfLastProposedAddress ? 'Please provide a valid address' : null}
        fullWidth={true}
        onBlur={(e) => {props.sendDialogStore.setLastProposedAddress(e.target.value)}}
      />

      <TextField
        hintText="for example 0.0013"
        floatingLabelText="TOTAL AMOUNT (BCH)"
        errorText={props.sendDialogStore.warnAboutInvalidityOfLastProposedAmount ? 'Please provide a valid amount' : null}
        fullWidth={true}
        onBlur={(e) => {props.sendDialogStore.setLastProposedAmount(e.target.value)}}
      />

      <ButtonSection>

        <PrimaryButton label="Send"
                       onClick={props.sendDialogStore.send}
                       disabled={!props.sendDialogStore.enableSend}

        />

      </ButtonSection>
    </div>
  )
})

TakingUserInputForm.propTypes = {
  sendDialogStore : PropTypes.object // HMR breaks instanceOf(SendDialogStore)
}

export default TakingUserInputForm