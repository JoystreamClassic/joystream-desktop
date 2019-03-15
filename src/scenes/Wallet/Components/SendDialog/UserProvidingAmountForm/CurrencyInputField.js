/**
 * Created by bedeho on 13/12/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import Radium from 'radium'

import {InputField} from '../../../../../components/Dialog'

const HIGHLIGHT_COLOR = '#007bff'
const BASE_COLOR = 'rgba(0, 123, 255, 0.11)'

function getStyles(props) {

  return {
    root : {
      display : 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      margin: '0 80px'
    },
    maxButton : {
      fontFamily : 'Helvetica',
      fontSize : '18px',
      height : '28px',
      width : '60px',
      borderRadius : '30px',
      lineHeight: '0px',
      backgroundColor : 'rgb(227, 241, 255)',
      borderWidth : '1px',
      borderStyle : 'solid',
      marginLeft : '20px',
      borderColor : HIGHLIGHT_COLOR,
      color : HIGHLIGHT_COLOR,

      ':hover' :  {
        backgroundColor : HIGHLIGHT_COLOR,
        color : 'white'
      }
    },
    conversionContainer : {
      display: 'flex',
      alignItems: 'center',
      fontFamily : 'helvetica neue',
      paddingTop : '15px',
      paddingLeft : '30px',
      paddingRight : '30px',
      paddingBottom : '0px',
    },
    conversionPrefix : {
      fontSize: '20px',
      fontFamily: 'helvetica neue',
      fontWeight: 'bold',
      marginRight: '10px'
    },
    convertedValue : {
      fontSize: '20px',
      fontFamily: 'helvetica neue',
      fontWeight: '200',
      width: '210px',
      overflow: 'hidden'
    },
    spacer : {
      flexGrow : 1
    },
    inputCurrencyChangerButton : {
      alignItems: 'center',
      height : '28px',
      padding : '10px 16px',
      borderRadius : '30px',
      lineHeight: '0px',
      fontFamily : 'Helvetica',
      fontSize: '18px',
      backgroundColor : 'white',
      borderWidth : '1px',
      borderStyle : 'solid',
      borderColor : 'hsl(0, 0%, 40%)',
      color : 'hsl(0, 0%, 40%)',

      ':hover' :  {
        borderColor : 'hsl(0, 0%, 40%)',
        backgroundColor : 'hsl(0, 0%, 40%)',
        color : 'white'
      }
    }
  }
}

@observer
class CurrencyInputField extends Component {

  constructor(props) {
    super(props)

    // Reference to DOM element for input field,
    // which is set by ref callback
    this._inputDOMElement = null
  }

  handleMaxClick = () => {

    this.props.maxClicked()

    this._inputDOMElement.value = this.props.fetchLastAmount()
  }

  handleCurrencyInputSwitch = () => {

    this.props.switchCurrencyClicked()

    this._inputDOMElement.value = this.props.fetchLastAmount()
  }

  render() {

    let styles = getStyles(this.props)

    return (
      <div style={styles.root}>

        <InputField title={this.props.inputFiat ? this.props.fiatPrefix : this.props.cryptoPrefix}
                    onInputChange={this.props.onChange}
                    errorMessage={this.props.errorMessage}
                    inputRef={(input) => { this._inputDOMElement = input }}
                    highlightColor={HIGHLIGHT_COLOR}
                    baseColor={BASE_COLOR}

        >
          <button style={styles.maxButton}
                  onClick={this.handleMaxClick}
                  key="maxButton"
          >
            max
          </button>
        </InputField>

        <div style={styles.conversionContainer}>

            <span style={styles.conversionPrefix}>
              {(this.props.inputFiat ? this.props.cryptoPrefix : this.props.fiatPrefix)}
            </span>

          <span style={styles.convertedValue}>
              {this.props.secondaryAmount}
            </span>

          <div style={styles.spacer}></div>

          <button
            style={styles.inputCurrencyChangerButton}
            onClick={this.handleCurrencyInputSwitch}
            key="currencyChangerButton"
          >
            use {(this.props.inputFiat ? this.props.cryptoPrefix : this.props.fiatPrefix)}
          </button>

        </div>

      </div>
    )
  }
}

// Temporarily not used
const FeeBox = (props) => {

  return (
    <div style={{ padding : '0px 30px 0px'}}>
      <div style={{
        display: 'none', //'flex'
        backgroundColor: 'rgba(227, 241, 255, 0.5)',
        padding : '2px 7px',
        fontSize: '14px',
        width: '180px',
        borderRadius: '0px 0px 4px 4px',
        color: 'rgba(0, 123, 255, 0.6)',
        justifyContent: 'center'
      }}>
          <span style={{
            marginRight: '5px',
            fontWeight: '100',
          }}>Additional fee </span>
        <span style={{
          fontWeight: '600'
        }}>$1290</span>
      </div>
    </div>
  )
}

CurrencyInputField.propTypes = {
  fiatPrefix : PropTypes.string.isRequired,
  cryptoPrefix : PropTypes.string.isRequired,
  cryptoToFiatExchangeRate : PropTypes.number.isRequired,
  inputFiat : PropTypes.bool.isRequired,
  errorMessage : PropTypes.string,
  onChange : PropTypes.func.isRequired,
  maxClicked : PropTypes.func.isRequired,
  switchCurrencyClicked : PropTypes.func.isRequired,
  secondaryAmount : PropTypes.number,
  fetchLastAmount : PropTypes.func.isRequired,
}

CurrencyInputField = Radium(CurrencyInputField)

export default CurrencyInputField