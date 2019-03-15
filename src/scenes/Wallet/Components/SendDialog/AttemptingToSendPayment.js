/**
 * Created by bedeho on 22/11/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

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
      height : '250px'
    },
    icon: {
      width : '150px',
      height : '150px'
    }
  }
}

import CircularProgress from 'material-ui/CircularProgress'

const AttemptingToSendPayment = (props) => {

  let styles = getStyles(props)

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

export default AttemptingToSendPayment