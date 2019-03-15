/**
 * Created by bedeho on 19/09/17.
 */

import React from 'react'
import SimpleLabel from  './SimpleLabel'
import PropTypes from 'prop-types'

const TorrentCountLabel = (props) => {

    let value = (
        <span style={{ fontWeight : 'bold'}}>{props.count}</span>
    )

    return (
        <SimpleLabel labelNode="TORRENTS"
                     valueNode={value}
                     valueFieldWidth="50px"
                     {...props}
        />
    )
}

TorrentCountLabel.propTypes = {
    count : PropTypes.number.isRequired,
    backgroundColorLeft : PropTypes.string.isRequired,
    backgroundColorRight : PropTypes.string.isRequired
}

export default TorrentCountLabel