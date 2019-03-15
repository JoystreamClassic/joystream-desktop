/**
 * Created by bedeho on 22/12/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'

import {PaymentRowStore} from '../../Stores'

import PaymentRow from './PaymentRow'

const PaymentsTableBody = observer((props) => {

  let tableIsEmpty = props.paymentRowStores.length === 0

  let styles = {
    root : {
      display : 'flex',
      flexDirection : 'column',
      overflowY : 'scroll',
      flexGrow: '1',
      backgroundColor : 'white',
      alignItems : 'center', //tableIsEmpty ? 'center' : 'inherit',
      justifyContent : tableIsEmpty ? 'center' : 'inherit',
    },
    rowContainer : {
      display : 'flex',
      flexDirection : 'column',
      flex : '0 0 91px',
      width : '850px'
    },
    separator : {
      height : '1px',
      backgroundColor : 'hsl(219, 41%, 97%)',
      width : '100%'
    },
    hint : {
      textAlign: 'center',
      padding: '10px',
      paddingLeft: '30px',
      paddingRight: '30px',
      //border: '4px solid hsla(0, 0%, 93%, 1)',
      backgroundColor: 'hsla(0, 0%, 93%, 1)',
      fontSize: '30px',
      color: 'hsla(0, 0%, 70%, 1)',
      margin: 'auto',
      borderRadius: '50px'
    }
  }

  return (
    <div style={styles.root} className="osx_scrollbar">
      {
          tableIsEmpty
          ?
            <span style={styles.hint}>
              No payments made
            </span>
          :
          props.paymentRowStores.map((paymentRowStore, index) => {

            let paymentStore = paymentRowStore.paymentStore
            let paymentId = paymentStore.txId + ':' + paymentStore.outputIndex

            return (
              <div style={styles.rowContainer} key={paymentId}>
                <PaymentRow
                            paymentId={paymentId}
                            paymentRowStore={paymentRowStore}
                            backgroundColor={ false && index % 2 == 0 ? 'hsla(218, 42%, 96%, 0.6)' : 'white'}
                />
                <div style={styles.separator}> </div>
              </div>
            )
          })
      }
    </div>
  )
})

PaymentsTableBody.propTypes = {
  paymentRowStores : PropTypes.arrayOf(PropTypes.object) // inner should be instanceOf(PaymentRowStore)), but HMR breaks it
}

export default PaymentsTableBody