/**
 * Created by bedeho on 18/12/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'

import {InputField} from '../../../../../components/Dialog'

const HIGHLIGHT_COLOR = '#007bff'
const BASE_COLOR = 'rgba(0, 123, 255, 0.11)'

function getStyle(props) {

  return {
    root : {
      display : 'flex',
      justifyContent: 'center',
      margin: '0 80px'
    },
    inputField : {
      inputStyle : {
        fontSize : '20px',
        width : '500px'
      },
      style : {
        flexGrow : '1'
      }
    }

  }
}

const AddressInputField = (props) => {

  let styles = getStyle(props)

  return (
    <div style={styles.root}>
      <InputField onInputChange={props.onChange}
                  errorMessage={props.errorMessage}
                  highlightColor={HIGHLIGHT_COLOR}
                  baseColor={BASE_COLOR}
                  inputStyle={styles.inputField.inputStyle}
                  style={styles.inputField.style}

      />
    </div>
  )
}

AddressInputField.propTypes = {
  errorMessage : PropTypes.string,
  onChange : PropTypes.func.isRequired
}

export default AddressInputField
