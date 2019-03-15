/**
 * Created by bedeho on 29/09/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AlertDialog from './AlertDialog'

const InvalidTorrentFileAlertDialog = (props) => {

  let okLabelText = "OK"
  const tryAgainLabelText = "TRY AGAIN"

    let buttonClicked = (title) => {

        if(title === okLabelText) {
            props.onAcceptClicked()
        } else if(title === tryAgainLabelText) {
            props.onRetryClicked()
        }

    }

    let buttonTitles
    let bodyText = ''

    if(props.canRetry) {
      bodyText = 'Would you like to try picking another file?'
      okLabelText = 'NO'
      buttonTitles = [okLabelText, tryAgainLabelText]
    } else {
      bodyText = 'Try another file.'
      buttonTitles = [okLabelText]
    }

    return (
        <AlertDialog
            title="Torrent file is invalid"
            body={bodyText}
            open={props.open}
            buttonTitles={buttonTitles}
            buttonClicked={buttonClicked}
        />
    )
}

InvalidTorrentFileAlertDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    onAcceptClicked : PropTypes.func.isRequired,
    onRetryClicked : PropTypes.func.isRequired,
}

export default InvalidTorrentFileAlertDialog
