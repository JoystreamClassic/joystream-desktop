/**
 * Created by bedeho on 16/08/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import LinearProgress from 'material-ui/LinearProgress'

function getStyles(props) {
/**
    padding: '16px',
        paddingLeft: '20px',
        paddingRight: '20px',
   */

    return {
        root : {
            height : '50px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width : '600px',
        },

        title : {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            fontSize: '11px',
            fontWeight: 'bold',
            color: 'white',
            textTransform: 'uppercase',
            backgroundColor : 'rgb(94, 71, 8)',
            paddingRight: '20px',
            paddingLeft: '20px'
        },

        progressbarContainer : {
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#ffc521', //rgba(0, 0, 0, 0.87)', //#ffc521',
            paddingRight: '20px',
            paddingLeft: '20px',
            flexGrow: '1'
        },

        progressbar : {
            backgroundColor : 'hsla(44, 84%, 50%, 1)',
            height : '8px',
            borderRadius : '100px',
            width: '400px',
            alignSelf: 'center',
            flexGrow : '1'
        }
    }
}

const ProgressStatusPanel = (props) => {

    let styles = getStyles(props)

    return (
        <div style = {styles.root}>

            <span style={styles.title}>
                {props.title}
            </span>

            <div style={styles.progressbarContainer}>
                <LinearProgress mode="determinate"
                                value={props.percentageProgress}
                                style={styles.progressbar}
                                color='hsla(44, 84%, 40%, 1)'
                />
            </div>

        </div>
    )
}

ProgressStatusPanel.propTypes = {
    title : PropTypes.string.isRequired,
    percentageProgress : PropTypes.number.isRequired
}

export default ProgressStatusPanel