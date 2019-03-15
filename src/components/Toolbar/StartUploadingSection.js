/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const StartUploadingSection = observer((props) => {

    // Derive ButtonSection props
    let className

    let onClick
    if(props.canBeginPaidUploadWidthDefaultTerms) {
        className = "start-sell"
        onClick = props.onClick
    } else {
        className = "start-sell-disabled"
        onClick = null
    }

    let tooltip = "Start paid uploading"

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

StartUploadingSection.propTypes = {
  canBeginPaidUploadWidthDefaultTerms : PropTypes.bool.isRequired,
  onClick : PropTypes.func.isRequired
}

export default StartUploadingSection