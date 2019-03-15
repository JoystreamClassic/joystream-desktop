/**
 * Created by bedeho on 21/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

const AbsolutePositionChildren = (props) => {

    return (
        <div style={{position: "relative"}}>
            <div style={{ position : "absolute", left: props.left,  top: props.top, zIndex: (props.zIndex ? props.zIndex : "auto")}}>
                {props.children}
            </div>
        </div>
    )

}

AbsolutePositionChildren.propTypes =  {
    left : PropTypes.number.isRequired,
    top : PropTypes.number.isRequired,
    zIndex : PropTypes.number
}

export default AbsolutePositionChildren