/**
 * Created by bedeho on 13/12/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

const FeeBadge = observer((props) => {

  let styles = {
    root : {
      display : 'flex',
      flexDirection : 'column',
      width: '158px',
      height: '76px',
      backgroundColor: 'rgba(255, 255, 255, 0.5)', //'white', //'hsla(0, 0%, 97%, 1)',
      //border: '2px solid #D5D5D5',
      borderRadius: '4px',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily : 'Arial',
    },
    title : {
      color : '#959595'
    },
    currentyPrefix : {
      fontSize : '20px',
      color : '#B8B8B8',
      marginRight: '5px'
    },
    fee : {
      fontWeight : 'bold'
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.title}>additional fee</div>
      <div>
        <span style={styles.currentyPrefix}>USD</span>
        <span style={styles.fee}>${props.dollarFee}</span>
      </div>
    </div>
  )
})

FeeBadge.propTypes = {
  dollarFee : PropTypes.number.isRequired
}

export default FeeBadge