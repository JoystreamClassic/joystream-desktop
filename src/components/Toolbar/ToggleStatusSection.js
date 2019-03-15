/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const ToggleStatus = observer((props) => {

    // Derive ButtonSection props
    let className
    let onClick
    let tooltip

    if(props.canStart) {
        className = "toggle_status-start"
        onClick = props.start
        tooltip = "Start"
    } else if(props.canStop) {
        className = "toggle_status-stop"
        onClick = props.stop
        tooltip = "Stop"
    } else
        return null //

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

ToggleStatus.propTypes = {
  canStart : PropTypes.bool.isRequired,
  canStop : PropTypes.bool.isRequired,
  start : PropTypes.func.isRequired,
  stop : PropTypes.func.isRequired
}

export default ToggleStatus