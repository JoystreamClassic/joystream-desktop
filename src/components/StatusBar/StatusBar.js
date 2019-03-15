/**
 * Created by bedeho on 16/08/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

const StatusBar = (props) => {

    if(!props.show)
        return null

    let styles = {
        root : {
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            width: '100%',

            //borderTop : '1px solid #eab214'
        },

        statusContainer: {
            borderRadius: '4px 4px 0px 0px',
            //width: '100%',
            overflow: 'hidden'
        }
    }

    if(props.bottom)
        styles.root.bottom = '0px'
    else
        styles.root.top = '0px'

    return (
        <div style={styles.root}>
            <div style={styles.statusContainer}>
                {props.children}
            </div>
        </div>
    )

}

StatusBar.propTypes = {
    show : PropTypes.bool.isRequired,
    bottom : PropTypes.bool.isRequired
}

export default StatusBar