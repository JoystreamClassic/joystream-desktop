/**
 * Created by bedeho on 23/11/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import {
  ButtonSection,
  PrimaryButton,
  ButtonSectionSpacer,
  Subtitle
} from '../../../../../components/Dialog'

import CurrencyInputField from './CurrencyInputField'

/// Wallet
import {
  UserProvidingAmountFormStore
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

const UserProvidingAmountForm = observer((props) => {

  let styles = getStyles(props)

  // Recovering error text
  let errorText = errorTextFromAmountValidationResult(props.userProvidingAmountFormStore.amountValidationResult)

  return (
    <div style={styles.root}>

      <div style={{ height : '50px'}}></div>

      <CurrencyInputField fiatPrefix={'USD'}
                          cryptoPrefix={'BCH'}
                          errorMessage={errorText}
                          cryptoToFiatExchangeRate={props.userProvidingAmountFormStore.cryptoToFiatExchangeRate}
                          inputFiat={props.userProvidingAmountFormStore.inputCurrencyType === UserProvidingAmountFormStore.INPUT_CURRENCY.FIAT}
                          onChange={(e) => {props.userProvidingAmountFormStore.setLastProposedAmount(e.target.value)}}
                          maxClicked={() => {props.userProvidingAmountFormStore.maximizePayment()}}
                          switchCurrencyClicked={() => {props.userProvidingAmountFormStore.flipInputCurrency()}}
                          secondaryAmount={props.userProvidingAmountFormStore.secondaryAmount}
                          fetchLastAmount={ () => { return props.userProvidingAmountFormStore.lastProposedAmount }}
      />

      <div style={{ height : '40px'}}></div>

      <ButtonSection>


        { /**

         <FeeBadge dollarFee={0.00127}/>

         <ButtonSectionSpacer />

         **/
        }

        <PrimaryButton label="Submit"
                       onClick={props.userProvidingAmountFormStore.next}
                       disabled={props.userProvidingAmountFormStore.amountValidationResult !== UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.VALID}

        />

      </ButtonSection>

    </div>
  )
})

function errorTextFromAmountValidationResult(result) {

  let text = null

  switch(result) {

    case UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.EMPTY:
      text = null
      break
    case UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.INVALID_AMOUNT_FORMAT:
      text = 'Not a valid amount'
      break
    case UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.AMOUNT_TOO_SMALL:
      text = 'Amount too small'
      break
    case UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.AMOUNT_TOO_LARGE:
      text = 'Amount too large'
      break
    case UserProvidingAmountFormStore.AMOUNT_VALIDATION_RESULT_TYPE.VALID:
      text = null
      break
    default:
      assert(false)
  }

  return text

}

UserProvidingAmountForm.propTypes = {
  userProvidingAmountFormStore : PropTypes.object // HMR breaks instanceOf(UserProvidingAmountFormStore)
}

export default UserProvidingAmountForm
