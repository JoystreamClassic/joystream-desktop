/**
 * Created by bedeho on 19/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const StopUploadingSection = observer((props) => {

    return (
        <ButtonSection className={'stop-sell'} tooltip={'Stop paid uploading'} onClick={props.onClick} />
    )
})

StopUploadingSection.propTypes = {
    onClick : PropTypes.func.isRequired,
}

export default StopUploadingSection