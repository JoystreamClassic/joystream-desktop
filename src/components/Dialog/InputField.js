/**
 * Created by bedeho on 18/12/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Radium from 'radium'

function getStyle(props) {

  return {
    root : {
      position : 'relative',
    },
    errorMessage : {
      display : props.errorMessage ? 'block' : 'none',
      position: 'absolute',
      top : '-39px',
      borderTop: '4px solid ' + props.highlightColor,
      padding: '4px 12px',
      borderRadius: '4px 4px 0px 0px',
      backgroundColor: 'rgba(227, 241, 255, 0.66)',
      color : props.highlightColor,
      marginLeft: '10px',
      textAlign: 'center'
    },
    inputContainer : {
      display : 'flex',
      alignItems : 'center',
      //justifyContent : 'center',
      backgroundColor : props.baseColor,
      borderRadius : '4px',
      border : 'none',
      paddingTop : '10px',
      paddingBottom : '10px',
      paddingLeft : '30px',
      paddingRight : '30px'
    },
    title : {
      display : props.title ? 'block' : 'none',
      marginRight: '20px',
      fontFamily: 'helvetica neue',
      fontSize: '28px',
      color: props.highlightColor,
      fontWeight: 'bold'
    },
    input : {
      fontFamily : 'helvetica neue',
      fontSize : '48px',
      fontWeight : '100',
      color : props.highlightColor,
      width : '230px',
      border: 'none',
      backgroundColor: 'transparent',

      ':focus' : {
        outline: 'none'
      }
    },
  }
}

const InputField = Radium((props) => {

  let styles = getStyle(props)

  return (
    <div style={[styles.root, props.style]}>

      <span style={[styles.errorMessage, props.errorStyle]}>
        {props.errorMessage}
      </span>

      <div style={styles.inputContainer}>

        <span style={[styles.title, props.titleStyle ]}>
        { props.title }
        </span>

        <input style={[styles.input, props.inputStyle]}
               onChange={props.onInputChange ? props.onInputChange : null}
               ref={props.inputRef ? props.inputRef : null}
        />

        {props.children}

      </div>
    </div>
  )
})

InputField.propTypes = {
  title : PropTypes.node,
  inputRef : PropTypes.func,
  errorMessage : PropTypes.string,
  onInputChange : PropTypes.func,

  highlightColor : PropTypes.string.isRequired,
  baseColor : PropTypes.string.isRequired,

  style : PropTypes.object,
  errorStyle : PropTypes.object,
  titleStyle : PropTypes.object,
  inputStyle : PropTypes.object
}

export default InputField