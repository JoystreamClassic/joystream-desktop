/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'

import ButtonSection from './ButtonSection'

const ChangeBuyerTermsSection = observer((props) => {

    // Derive ButtonSection props
    let className
    let onClick
    let tooltip = "Change price"

    if(props.torrent.canChangeBuyerTerms) {
        className = "change_buyer_terms"
        onClick = () => { props.torrent.changeBuyerTerms() }
    } else {
        className = "change_buyer_terms-disabled"
        onClick = null
    }

    return (
        <ButtonSection className={className} tooltip={tooltip} onClick={onClick} />
    )
})

ChangeBuyerTermsSection.propTypes = {
    torrent : PropTypes.object.isRequired, // TorrentStore really
}

export default ChangeBuyerTermsSection