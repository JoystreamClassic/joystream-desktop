/**
 * Created by bedeho on 21/03/2018.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import Dialog from '../../../../components/Dialog'

import {ViewHDSeedDialogStore} from '../../Stores'

function getStyles(props) {

  return {
    formRoot : {
      display: 'flex',
      flexDirection: 'column',
      padding: '60px',
      paddingTop: '30px',
      backgroundColor: '#39f' //'#47b76f'
    },
    explainerContainer : {
      fontSize: '16px',
      color: 'rgb(133, 133, 133)',
      fontWeight: '100',
      margin: '40px 60px',
      border: '1px solid #cdcdcd',
      padding: '10px 16px',
      borderRadius: '5px'
    },
    subtitle : {
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      marginLeft: '10px'
    },
    spacer: {
      height: '30px'
    },
    seedContainer : {
      fontSize: '16px',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      backgroundColor: '#0078f0', //'#399359',
      padding: '10px',
      borderRadius: '4px',

    },
    pathContainer : {
      fontSize: '20px',
      color: 'rgba(255, 255, 255, 0.7)',
      textAlign: 'center',
      backgroundColor: '#0078f0', //'#399359',
      padding: '10px',
      borderRadius: '4px',
    }
  }
}

const ViewHDSeedDialog = observer((props) => {

  let visibleDialog = !!props.viewHDSeedDialogStore
  let onRequestClose = () => {}
  let form = null

  if(visibleDialog) {

    onRequestClose = props.viewHDSeedDialogStore.close

    let styles = getStyles(props)

    const explainerText = `Write down, and safely and privately store, the recovery phrase below. \
                           In the future the phrase can be used to restore your JoyStream wallet.`

    form = (
      <div>

        <div style={styles.explainerContainer}>
          {explainerText}
        </div>

        <div style={styles.formRoot}>
          
          <div style={styles.seedContainer}>
            {props.viewHDSeedDialogStore.masterKey.mnemonic.phrase}
          </div>

          {/*
          <div style={styles.spacer}> </div>
          <span style={styles.subtitle}>DERIVATION PATH</span>
          <div style={styles.pathContainer}>
            {"m/44/0'/0'"}
          </div>
          */}
        </div>

      </div>
    )
  }

  return (
    <Dialog title={'Backup'}
            open={visibleDialog}
            onRequestClose={onRequestClose}
            width={'650px'}
    >
      {form}
    </Dialog>
  )
})

ViewHDSeedDialog.propTypes = {
  viewHDSeedDialogStore : PropTypes.object // HMR breaks instanceOf(ViewHDSeedDialogStore)
}

export default ViewHDSeedDialog
