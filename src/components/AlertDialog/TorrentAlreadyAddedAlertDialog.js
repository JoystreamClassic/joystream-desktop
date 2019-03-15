/**
 * Created by bedeho on 29/09/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import AlertDialog from './AlertDialog'

const TorrentAlreadyAddedAlertDialog = (props) => {

    let buttonClicked = (title) => { props.onOkClicked() }

    return (
        <AlertDialog
            title="Torrent already added"
            body={"You cannot add it twice."}
            open={props.open}
            buttonTitles={["OK"]}
            buttonClicked={buttonClicked}
        />
    )
}

TorrentAlreadyAddedAlertDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    onOkClicked : PropTypes.func.isRequired,
}

export default TorrentAlreadyAddedAlertDialog