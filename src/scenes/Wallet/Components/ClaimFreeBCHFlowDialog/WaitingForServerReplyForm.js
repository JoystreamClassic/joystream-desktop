/**
 * Created by bedeho on 16/03/2018.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import CircularProgress from 'material-ui/CircularProgress'

const WaitingForServerReplyForm = (props) => {

  let styles = {
    root : {
      display : 'flex',
      flexDirection : 'column'
    },
    iconContainer : {
      display : 'flex',
      alignItems : 'center',
      justifyContent : 'center',
      height : '250px'
    },
    icon: {
      width : '150px',
      height : '150px'
    }
  }

  return (
    <div style={styles.root}>

      <div style={styles.iconContainer}>
        <CircularProgress size={100}
                          thickness={6}
                          color={"#ffc107"}
        />
      </div>

    </div>
  )
}

export default WaitingForServerReplyForm