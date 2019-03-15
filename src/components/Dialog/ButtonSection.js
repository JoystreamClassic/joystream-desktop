/**
 * Created by bedeho on 24/11/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

const ButtonSection = (props) => {

  let styles = {
    root : {
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'center',
      padding : '26px',
      paddingRight: '36px',
      backgroundColor : '#39f', //rgb(33, 50, 80)' //'hsla(210, 100%, 80%, 1)' //'#EAEAEA'
    }
  }

  return (
    <div style={styles.root}>
      {props.children}
    </div>
  )
}

export default ButtonSection