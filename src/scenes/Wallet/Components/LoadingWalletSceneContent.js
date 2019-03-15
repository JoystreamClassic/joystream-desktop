import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import Wallet from '../../../core/Wallet'

function getStyles (props) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'rgb(73, 109, 175)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      color: 'white',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '30px',
      backgroundColor: 'hsla(219, 41%, 40%, 1)',
      padding: '10px 40px',
      borderRadius: '50px'
    }
  }
}

const LoadingWalletSceneContent = observer((props) => {
  
  let styles = getStyles(props)
  
  let stateText = makeWalletStateText(props.walletStore)
  
  return (
    <div style={styles.root}>
      <div style={styles.title}> {stateText} </div>
    </div>
  )
  
})

LoadingWalletSceneContent.propTypes = {
  walletStore : PropTypes.object // can't use instanceof due to HMR bug
}

function makeWalletStateText(walletStore) {
  
  let text
  
  if(!walletStore)
    text = 'Initializing'
  else {
    
    switch(walletStore.state) {
      case Wallet.STATE.STOPPED:
        text = 'Stopped'
        break
      case Wallet.STATE.OPENING_SPV_NODE:
        text = 'Opening SPV node'
        break
      case Wallet.STATE.GETTING_WALLET:
        text = 'Getting wallet database'
        break
      case Wallet.STATE.GETTING_BALANCE:
        text = 'Getting balance'
        break
      case Wallet.STATE.CONNECTING_TO_NETWORK:
        text = 'Connecting to peers'
        break
      case Wallet.STATE.STARTED:
        text = 'Started'
        break
      case Wallet.STATE.STOPPING:
        text = 'Stopping'
        break
      case Wallet.STATE.CATASTROPHIC_ERROR:
        text = 'Error'
        break
      default:
        assert(false)
    }
  }
  
  return text
}

export default LoadingWalletSceneContent
export {
  makeWalletStateText
}