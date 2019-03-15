/**
 * Created by bedeho on 06/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyles(props) {

    return {
        root : Object.assign({
            display : props.show ? 'block' : 'none',
            position: 'absolute',
            left: '0px',
            top: '0px',
            flexDirection: "column",
            justifyContent: "center",
            alignItems: 'center',
            height: "100%", // quick hack
            width: "100%",
            zIndex: props.zIndex ? props.zIndex : 1
        }, props.style)
    }
}

const FullScreenContainer = (props) => {

    let styles = getStyles(props)

    return (
        <div style={styles.root} className={props.className ? props.className : ''}>
            {props.children}
        </div>
    )
}

FullScreenContainer.propTypes = {
    show : PropTypes.bool,
    className : PropTypes.string,
    style : PropTypes.object
}

FullScreenContainer.defaultProps = {
    show : true
}

export default FullScreenContainer