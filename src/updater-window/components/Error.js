/**
 * Created by bedeho on 09/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

import DialogBody,  {
    PrimaryButton,
    SecondaryButton,
    ButtonGroup,
    VerticalSpacer
} from './DialogBody'

const Error = (props) => {

    return (
        <DialogBody title="Error encountered"
                    message={props.errorMessage}>

            <VerticalSpacer height="65px"/>

            <ButtonGroup>

                <PrimaryButton title="Close"
                               width={186}
                               onClick={props.onCloseClicked}
                />

            </ButtonGroup>
        </DialogBody>
    )
}

Error.propTypes = {
    errorMessage : PropTypes.string.isRequired,
    onCloseClicked : PropTypes.func.isRequired
}

export default Error