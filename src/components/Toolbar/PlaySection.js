/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const PlaySection = observer((props) => {

    // Derive ButtonSection props
    let className
    let onClick

    if(props.canPlay) {
        className = "play"
        
        // Will later let the user pick which file to play. By default it is the first one.
        onClick = props.play
    } else {
        className = "play-disabled"
        onClick = null
    }

    return (
        <ButtonSection className={className} tooltip="Play content" onClick={onClick} />
    )
})

PlaySection.propTypes = {
  canPlay : PropTypes.bool.isRequired,
  play : PropTypes.func.isRequired
}

export default PlaySection
