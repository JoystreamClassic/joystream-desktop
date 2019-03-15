/**
 * Created by bedeho on 13/09/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

function getStyles() {

    return {
        root : {
            position: 'relative',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: '40px',
            //borderBottom: '3px solid hsla(120, 39%, 47%, 1)',
            //borderRadius: '6px',
            overflow: 'hidden'
            //backgroundColor: state.mouseIsOver ? 'hsl(120, 39%, 55%)' : 'hsl(120, 39%, 65%)',
        }
    }
}

const Toolbar = (props) => {

    let styles = getStyles(props)

    return (
        <div style={styles.root}>
            {props.children}
        </div>
    )
}

export default Toolbar