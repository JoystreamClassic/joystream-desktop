/**
 * Created by bedeho on 09/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

import JoyStreamNameSvgIcon from '../../components/JoyStreamNameSvgIcon'

const UpdaterWindowFrame = (props) => {

    let styles = {
        root : {
            backgroundColor: '#1C262B',
            height: '100%',
            width: '100%',
            //borderRadius: '8px', // can't have this until we have transparent windows
            overflow: 'hidden'
        },
        windowBar : {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#141B1F',
            height: '55px'
        }
    }

    return (
        <div style={styles.root}>

            <div style={styles.windowBar}>
                <JoyStreamNameSvgIcon />
            </div>

            {props.children}

        </div>
    )
}

export default UpdaterWindowFrame