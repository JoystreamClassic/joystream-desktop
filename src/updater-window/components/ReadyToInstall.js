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

const ReadyToInstall = (props) => {

    let message = (
        <div>
            Application will be closed and the new version will be installed automatically.
        </div>
    )

    return (
        <DialogBody title="Download successful"
                    message={message}>

            <VerticalSpacer height="25px"/>

            <ButtonGroup>

                <PrimaryButton title="Install"
                               width={186}
                               onClick={props.onInstallClicked}
                />

            </ButtonGroup>
        </DialogBody>
    )
}

ReadyToInstall.propTypes = {
    onInstallClicked : PropTypes.func.isRequired
}

export default ReadyToInstall