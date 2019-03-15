/**
 * Created by bedeho on 22/11/2017.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {
  ButtonSection,
  PrimaryButton,
  Subtitle
} from '../../../../components/Dialog'

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
    message : {
      display : 'flex',
      flexDirection : 'column',
      alignItems : 'center',
      justifyContent : 'center',
      paddingBottom : '30px',
      paddingLeft : '60px',
      paddingRight : '60px',
      fontSize: '24px',
      fontFamily: 'Helvetica',
      textAlign: 'center',
      fontWeight: '100'
    },
    icon : {
      height : '90px',
      width : '90px'
    }
  }
}

import SvgIcon from 'material-ui/SvgIcon'

const EmptyWalletIcon = (props) => {

  const {
    style,
    strokeColor
  } = props

  return (
    <SvgIcon viewBox="0 0 64 64" style={style}>
      <path fill="none" stroke={strokeColor} strokeWidth="4" strokeMiterlimit="10" d="M14,20L4.812,32.6 C2.979,35.35,2,38.582,2,41.888v0.003C2,51.139,8.752,58,18,58h28c9.248,0,16-6.861,16-16.109v-0.003 c0-3.306-0.979-6.538-2.812-9.289L50,20" strokeLinejoin="miter" strokeLinecap="butt"></path>
      <line fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="square" strokeMiterlimit="10" x1="6" y1="20" x2="58" y2="20" strokeLinejoin="miter"></line>
      <path fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="square" strokeMiterlimit="10" d="M18,7 c0-2.761,2.239-5,5-5s5,2.239,5,5s-5,7-5,7S18,9.761,18,7z" strokeLinejoin="miter"></path>
      <path fill="none" stroke={strokeColor} strokeWidth="4" strokeLinecap="square" strokeMiterlimit="10" d="M36,7 c0-2.761,2.239-5,5-5s5,2.239,5,5s-5,7-5,7S36,9.761,36,7z" strokeLinejoin="miter"></path>
    </SvgIcon>
  )
}

const EmptyWalletWarningForm = (props) => {

  let styles = getStyles(props)

  return (
    <div style={styles.root}>

      <div style={styles.iconContainer}>
        <EmptyWalletIcon style={styles.icon}
                         strokeColor="#4CAF50"/>
      </div>

      <div style={styles.message}>
        <div>No funds available for sending,</div>
        <div>please top up wallet first.</div>
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

export default EmptyWalletWarningForm