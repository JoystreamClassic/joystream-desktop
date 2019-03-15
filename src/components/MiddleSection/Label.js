/**
 * Created by bedeho on 13/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

const Label = (props) => {

    let style = {

        root : {
            display : 'flex',
            direction : 'row',
            borderRadius: '5px',
            overflow: 'hidden',
            height: props.height,
            marginLeft: '20px'
        },

        left : {
            display : 'flex',
            direction : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor : props.backgroundColorLeft,
            height: props.height,
        },

        right : {
            display : 'flex',
            direction : 'row',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor : props.backgroundColorRight,
            height: props.height,
        },
    }

    return (
        <div style={style.root}>
            <div style={style.left}>{props.leftField}</div>
            <div style={style.right}>{props.rightField}</div>
        </div>
    )
}

Label.propTypes = {
    leftField : PropTypes.node.isRequired,
    rightField : PropTypes.node.isRequired,
    //height : PropTypes.string.isRequired,
    backgroundColorLeft: PropTypes.string.isRequired,
    backgroundColorRight: PropTypes.string.isRequired
}

export default Label