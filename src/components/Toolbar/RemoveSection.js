/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const RemoveSection = observer((props) => {

    // Derive ButtonSection props
    let className = "remove"
    let tooltip = "Remove"
    let onClick

    if (props.enabled) {
      onClick = props.onClick
    } else {
      onClick = () => {}

      if (props.working) {
        // show spinner
        className = 'remove_working'
      } else {
        // show disabled
        className = 'remove_disabled'
      }
    }

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

RemoveSection.propTypes = {
    onClick : PropTypes.func.isRequired,
    working : PropTypes.bool
}

export default RemoveSection
