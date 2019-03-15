/**
 * Created by bedeho on 02/11/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import Header from './Header'
import PaymentsTableBody from './PaymentsTableBody'

function getStyles(props) {

   let styles = {
    root : {
      display : 'flex',
      flexDirection : 'column',
      width : '930px' //'100%'
    },
    footer :{
      flex: '0 0 5px',
      backgroundColor: '#89a2d5', //'white',
      borderRadius : '0px 0px 7px 7px',
      marginBottom : '40px'
    }
  }

  if(props.height)
    styles.root.height = props.height

  return styles
}

const PaymentsTable = observer((props) => {

  let styles = getStyles(props)

  return (
    <div style={styles.root}>
      <Header walletSceneStore={props.walletSceneStore}/>
      <PaymentsTableBody paymentRowStores={props.walletSceneStore.filteredPaymentRowStores}/>
      <div style={styles.footer}></div>
    </div>
  )

})

PaymentsTable.propTypes = {
  walletSceneStore : PropTypes.object.isRequired, // WalletSceneStore
  height: PropTypes.string
}

export default PaymentsTable
