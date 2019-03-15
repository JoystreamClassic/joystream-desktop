/**
 * Created by bedeho on 22/11/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {
  ButtonSection,
  PrimaryButton,
  Subtitle
} from '../../../../components/Dialog'

import SvgIcon from 'material-ui/SvgIcon'

// Styling generator
function getStyles(props) {

  return {
    root : {
      display : 'flex',
      flexDirection : 'column'
    },
    iconContainer : {
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'center',
      height : '150px'
    },
    icon: {
      width : '90px',
      height : '90px'
    },
    message : {
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'center',
      paddingBottom : '30px',
      paddingLeft : '60px',
      paddingRight : '60px',
      fontSize: '24px',
      fontFamily: 'Helvetica',
      textAlign: 'center',
      fontWeight: '100'
    }
  }
}

const FailIcon = (props) => {

  return (
    <SvgIcon viewBox="0 0 64 64" style={props.style}>
      <circle fill="none" stroke={props.strokeColor} strokeWidth="4" strokeLinecap="square" strokeMiterlimit="10" cx="32" cy="32" r="30" strokeLinejoin="miter"></circle>
      <circle fill="none" stroke={props.strokeColor} strokeWidth="4" strokeLinecap="square" strokeMiterlimit="10" cx="32" cy="48" r="3" strokeLinejoin="miter"></circle>
      <line fill="none" stroke={props.strokeColor} strokeWidth="4" strokeLinecap="square" strokeMiterlimit="10" x1="32" y1="12" x2="32" y2="36" strokeLinejoin="miter"></line>
    </SvgIcon>
  )
}

const PaymentFailedForm = (props) => {

  let styles = getStyles(props)

  return (
    <div style={styles.root}>

      <div style={styles.iconContainer}>
        <FailIcon style={styles.icon}
                  strokeColor="#F44336"
        />
      </div>

      <div style={styles.message}>
        {props.paymentFailureErrorMessage}
      </div>

      <ButtonSection>

        <PrimaryButton label="Ok"
                       onClick={props.onClick}
                       disabled={false}

        />

      </ButtonSection>

    </div>
  )
}

PaymentFailedForm.propTypes = {
  paymentFailureErrorMessage : PropTypes.string.isRequired,
  onClick : PropTypes.func.isRequired
}

export default PaymentFailedForm