/**
 * Created by bedeho on 01/10/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

function getStyles(state, props) {

    let color = state.hover ? '60%' : '90%'

    return {
        root : {
            border : '3px solid hsla(0, 0%, ' + color + ', 1)',

            padding : '16px',
            paddingLeft : '30px',
            paddingRight : '30px',

            height : 'none',
            borderRadius : '15px',
            backgroundColor: 'white'
        },
        contentContainer : {
            display : 'column'
        },
        label : {
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: '28px',
            color: 'hsla(0, 0%, 50%, 1)'
        },
        minorLabel : {
            fontSize : '16px',
            fontWeight : 'bold',
            marginTop: '-5px',
            color: 'hsla(0, 0%, 85%, 1)',
            textAlign: 'center'
        }
    }
}

class TransparentButton extends Component {

    constructor(props) {
        super(props)

        this.state = {hover : false}
    }

    handleMouseEnter = (e) => {
        this.setState({hover : true})
    }

    handleMouseLeave = (e) => {
        this.setState({hover : false})
    }

    render() {

        let styles = getStyles(this.state, this.props)

        return (
            <button style={styles.root}
                    onClick={this.props.onClick}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
            >
                <div style={styles.contentContainer}>
                    <div style={styles.label}>{this.props.label}</div>
                    {
                        this.props.minorLabel
                            ?
                        <div style={styles.minorLabel}>{this.props.minorLabel}</div>
                            :
                        null
                    }
                </div>
            </button>
        )
    }
}

TransparentButton.propTypes = {
    onClick : PropTypes.func.isRequired,
    label : PropTypes.string.isRequired,
    minorLabel :PropTypes.string
}

export default TransparentButton