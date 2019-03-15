/**
 * Created by bedeho on 29/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import AlertDialog from './AlertDialog'

const dropItLabelText = "DROP IT"
const continueLabelText = "OK CONTINUE"

const IncompleteDownloadAlertDialog = (props) => {

    let buttonClicked = (title) => {

        if(title === dropItLabelText) {
            props.onDropDownloadClicked()
        } else if(title === continueLabelText) {
            props.onContinueDownloadClicked()
        }

    }

    return (
        <AlertDialog
            title="Complete download not found"
            body={"Seeding requires a full download, a download has therefore been started."}
            open={props.open}
            buttonTitles={[dropItLabelText, continueLabelText]}
            buttonClicked={buttonClicked}
        />
    )
}

IncompleteDownloadAlertDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    onDropDownloadClicked : PropTypes.func.isRequired,
    onContinueDownloadClicked : PropTypes.func.isRequired
}

export default IncompleteDownloadAlertDialog