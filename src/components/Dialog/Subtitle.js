/**
 * Created by bedeho on 18/12/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

function getStyle(props) {

  return {
    root : {
      //display : 'none',
      fontFamily: 'helvetica neue',
      fontWeight: '300',
      fontSize: '26px',
      textAlign: 'center',
      marginTop: '8px',
      color: 'hsla(0, 0%, 60%, 1)'
    },
  }

}

const Subtitle = (props) => {

  let styles = getStyle(props)

  return (
    <div style={styles.root}>
      {props.children}
    </div>
  )
}

export default Subtitle