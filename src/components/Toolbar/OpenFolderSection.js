/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const OpenFolderSection = observer((props) => {

    return (
        <ButtonSection className={"open-folder"} tooltip="Open folder" onClick={props.onClick} />
    )
})

OpenFolderSection.propTypes = {
    onClick : PropTypes.func.isRequired
}

export default OpenFolderSection