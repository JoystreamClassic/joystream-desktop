/**
 * Created by bedeho on 11/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

/**
 * A generic context menu item component
 */
const Item = (props) => {

    return (
        <div className={"item " + (props.onClick ? "item-clickable " : "") + (props.className ? props.className : "")}
             onClick={props.onClick ? props.onClick : null}>
            <div className="icon"></div>
            <div className="body">
                {props.label ? <div className="label">{props.label}</div> : null }
                {props.description ? <div className="description"> {props.description} </div> : props.children }
            </div>
        </div>
    )
}

// how to make icons optional, and how to set icon font, and how to have hover?

Item.propTypes = {
    onClick : PropTypes.func,
    className : PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string
}

export default Item