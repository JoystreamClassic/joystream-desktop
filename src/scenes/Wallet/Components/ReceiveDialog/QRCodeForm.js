/**
 * Created by bedeho on 19/12/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from './Button'
import QRCode from 'qrcode-react'

import {
  ButtonSection,
  PrimaryButton
} from '../../../../components/Dialog'

function getStyle(props) {

  return {
    root : {
      display : 'flex',
      flexDirection : 'column'
    },
    addressContainer : {
      display: 'flex',
      alignItems : 'center',
      justifyContent : 'center',
      height : '300px'
    },
    buttonContainer : {
      display: 'flex',
      alignItems : 'center',
      justifyContent : 'center',
      padding: '40px',
      paddingTop: '0px'
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
    }
  }
}

const QRCodeForm = (props) => {

  let styles = getStyle(props)

  return (
    <div style={styles.root}>

      <div style={styles.addressContainer}>
        <QRCode value={props.address}
                size={170}
                fgColor={'hsl(0, 0%, 40%)'}
        />
      </div>


      { /**
       <div style={styles.buttonContainer}>
       <Button title={"Show as string"}
       onClick={props.onFlipClick}
       />
       </div>
       **/
      }

      <ButtonSection>

        <PrimaryButton label="Show string"
                       onClick={props.onFlipClick}
                       disabled={false}

        />

      </ButtonSection>
    </div>
  )

}

QRCodeForm.propTypes = {
  address : PropTypes.string.isRequired,
  onFlipClick : PropTypes.func.isRequired,
  onClose : PropTypes.func.isRequired
}

export default QRCodeForm