/**
 * Created by bedeho on 13/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyle(props) {

    return {

        root : {
            display: 'flex',
            flexDirection: 'row',
            marginRight: '40px',
            borderRadius: '50px'
        }
    }
}

const LabelContainer = (props) => {

    let style = getStyle(props)

    return (
        <div style={style.root}>
            {props.children}
        </div>
    )
}

export default LabelContainer