/**
 * Created by bedeho on 01/10/17.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'

// Ths is an improved version of SvgIcon component which also sets
// th hoverColor on stroke property of svg tag
class ImprovedSvgIcon extends Component {

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

    render () {

        let color = this.state.hover ? this.props.hoverColor : this.props.color

        return (
            <svg style={this.props.style}
                 viewBox={this.props.viewBox}
                 fill={color}
                 stroke={color}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseLeave={this.handleMouseLeave}
            >
                {this.props.children}
            </svg>
        )
    }
}

ImprovedSvgIcon.propTypes = {
    color : PropTypes.string.isRequired,
    hoverColor: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired,
    viewBox : PropTypes.string.isRequired
}

export default ImprovedSvgIcon