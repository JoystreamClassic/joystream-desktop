/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const RemoveAndDeleteSection = observer((props) => {

    // Derive ButtonSection props
    let className = "trash"
    let tooltip = "Remove & delete data"
    let onClick = props.onClick

    if (props.enabled) {
      onClick = props.onClick
    } else {
      onClick = () => {}

      if (props.working) {
        // show spinner
        className = 'trash_working'
      } else {
        // show disabled
        className = 'trash_disabled'
      }
    }

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

RemoveAndDeleteSection.propTypes = {
    onClick : PropTypes.func.isRequired,
    working : PropTypes.bool
}

export default RemoveAndDeleteSection
