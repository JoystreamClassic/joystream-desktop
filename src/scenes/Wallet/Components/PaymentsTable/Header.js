/**
 * Created by bedeho on 18/11/2017.
 */

import React, { Component } from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

function getStyles(props) {

  return {
    root : {
      display : 'flex',
      flex : '0 0 5px',
      //backgroundColor: 'hsla(218, 41%, 66%, 1)',
      //backgroundColor: 'hsla(218, 41%, 77%, 1)', //'hsla(0, 0%, 94%, 1)',
      backgroundColor: '#89a2d5', //'white',
      borderRadius: '7px 7px 0px 0px'
    },
    paymentsTitleContainer: {
      display : 'flex',
      flex: '0 0 130px',
      alignItems : 'center',
      justifyContent: 'center',
      fontFamily: 'helvetica',
      fontSize: '16px',
      color: 'white',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    searchFieldContainer : {
      display : 'flex',
      flexGrow : '1',
      alignItems : 'center',
      justifyContent: 'center'
    },
    counterContainer : {
      display : 'flex',
      flex: '0 0 180px',
      alignItems : 'center',
      justifyContent: 'center',
    },
    counterBox : {
      backgroundColor: 'rgb(45, 68, 108)',
      padding: '4px',
      borderRadius: '4px',
      fontSize: '21px',
      color: 'white',
      fontWeight: 'bold',
      paddingLeft: '10px',
      paddingRight: '10px'
    },
    inputField : {
      width: '400px',
      padding: '8px',
      borderRadius: '31px',
      border: '0px solid hsla(218, 41%, 64%, 1)',
      paddingLeft: '20px',
      backgroundColor: 'hsla(218, 41%, 49%, 1)' //'hsla(218, 41%, 90%, 1)'
    }

  }
}

const Header = observer((props) => {

  let styles = getStyles(props)

  return (
    <div style={styles.root}>

      { /**

       <div style={styles.paymentsTitleContainer}>
       Payments
       </div>

       <div style={styles.searchFieldContainer}>
       <input value={props.walletSceneStore.searchString}
       onChange={(e) => { props.walletSceneStore.setSearchString(e.target.value)}}
       style={styles.inputField}
       />
       </div>
       <div style={styles.counterContainer}>
       <div style={styles.counterBox}>
       {props.walletSceneStore.sortedAndFilteredPaymentRowStores.length}
       </div>
       </div>

       */
      }
    </div>
  )

})

Header.propTypes = {
  walletSceneStore : PropTypes.object.isRequired // SendDialogStore instance
}

export default Header