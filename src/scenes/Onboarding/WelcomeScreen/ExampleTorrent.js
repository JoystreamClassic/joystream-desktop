/**
 * Created by bedeho on 06/10/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {convenientBytes} from '../../../common'

function getStyles(props) {

    return {
        root : {
            border : '2px solid rgb(230, 230, 230)',
            borderRadius: '4px',
            backgroundColor: 'hsla(0, 0%, 98%, 1)',
        },
        image : {
            height : props.imageHeight + 'px',
            width : props.imageWidth + 'px'
        },
        informationContainer : {
            //display: 'flex',
            padding : '10px'
        },
        title : {
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'black',
            flexGrow: 1
        },
        size : {
            fontSize: '14px'
        },
        value: {
            fontWeight : 'bold'
        },
        unit: {
            marginLeft: '2px'
        }
    }
}

const ExampleTorrent = (props) => {

    let styles = getStyles(props)

    let representation = convenientBytes(props.byteSize)

    return (
        <div style={styles.root}>
            <img src={props.imageSrc} style={styles.image}/>
            <div style={styles.informationContainer}>
                <div style={styles.title}>{props.title}</div>
                <div style={styles.size}>
                    <span style={styles.value}>{representation.value}</span>
                    <span style={styles.unit}>{representation.unit}</span>
                </div>
            </div>
        </div>
    )

}

ExampleTorrent.propTypes = {
    title : PropTypes.string.isRequired,
    byteSize : PropTypes.number.isRequired,
    imageSrc : PropTypes.string.isRequired,
    imageHeight : PropTypes.number.isRequired,
    imageWidth : PropTypes.number.isRequired
}

export default ExampleTorrent