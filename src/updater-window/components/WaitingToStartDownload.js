/**
 * Created by bedeho on 09/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

import DialogBody,  {
    PrimaryButton,
    SecondaryButton,
    ButtonGroup,
    ButtonSeparator,
    VerticalSpacer
} from './DialogBody'

const WaitingToStartDownload = (props) => {

    let styles = {
        versionString : {
            fontWeight: 'bold'
        }
    }

    let message = (
        <div>
            Version <span style={styles.versionString}>{props.newVersionString}</span> found,
            you have version <span style={styles.versionString}>{props.installedVersionString}</span>.
        </div>
    )

    return (
        <DialogBody title="New version available!"
                    message={message}>

            <VerticalSpacer height="60px"/>

            <ButtonGroup>

                <SecondaryButton title="Use old version"
                                 width={186}
                                 onClick={props.onUseOldVersionClicked}
                />

                <ButtonSeparator />

                <PrimaryButton title="Update"
                               width={186}
                               onClick={props.onUpdateClicked}
                />

            </ButtonGroup>
        </DialogBody>
    )
}

WaitingToStartDownload.propTypes = {
    newVersionString : PropTypes.string.isRequired,
    installedVersionString : PropTypes.string,
    onUseOldVersionClicked : PropTypes.func.isRequired,
    onUpdateClicked : PropTypes.func.isRequired
}

export default WaitingToStartDownload