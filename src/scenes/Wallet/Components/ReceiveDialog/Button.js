/**
 * Created by bedeho on 19/12/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'

function getStyle(props) {

  return {
    root : {
      backgroundColor : 'white',
      border: '2px solid hsl(0, 0%, 40%)',
      color : 'hsl(0, 0%, 40%)',
      padding: '10px 20px',
      borderRadius: '40px',

      ':hover' : {
        backgroundColor : 'hsl(0, 0%, 40%)',
        color : 'white'
      }
    }
  }
}

const Button = Radium((props) => {

  let styles = getStyle(props)

  // add hover
  // add arrow >

  return (
    <input type="submit"
           value={props.title}
           onClick={props.onClick}
           style={styles.root}
    />
  )
})

Button.propTypes = {
  title : PropTypes.string.isRequired,
  onClick : PropTypes.func.isRequired
}

export default Button