/**
 * Created by bedeho on 02/10/17.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'

function getButtonFaceLighting(buttonState, props) {

    if(buttonState.pressed && props.lightingLevels.length > 2)
        return props.lightingLevels[2]
    else if(buttonState.hover && props.lightingLevels.length > 1)
        return props.lightingLevels[1]
    else
        return props.lightingLevels[0]
}

function getBottomBorderWidth(buttonState, props) {

    if(buttonState.pressed && props.elevationLevels.length > 1)
        return props.elevationLevels[1]
    else
        return props.elevationLevels[0]
}

function getStyles(props, state) {

    let hsColorPart = props.hue + ',' + props.saturation + '%'
    let backgroundColor = 'hsl(' + hsColorPart + ', ' + getButtonFaceLighting(state, props) + '%)'
    let borderBottomWidth = getBottomBorderWidth(state, props)

    let style = {
        border : 'none',
        borderRadius : '15px',
        borderBottom : borderBottomWidth + 'px solid hsl(' + hsColorPart + ', ' + props.borderShadowLightingLevel + '%)',
        backgroundColor : backgroundColor,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: '28px',
        color: 'white',
    }

    if(props.height)
        style.height = props.height + 'px'
    else {
        style.paddingLeft = '35px'
        style.paddingRight = '35px'
    }

    if(props.width)
        style.width = props.width + 'px'
    else {
        style.paddingTop = '20px'
        style.paddingBottom = '20px'
    }

    // Add final override user styles
    Object.assign(style, props.style)

    return {

        root : style
    }
}

class ElevatedAutoLitButton extends Component {

    constructor(props) {
        super(props)

        this.state = {
            hover : false,
            pressed : false
        }
    }

    handleMouseEnter = (e) => {
        this.setState({hover : true})
    }

    handleMouseLeave = (e) => {
        this.setState({hover : false, pressed : false})
    }

    handleMouseDown = (e) => {
        this.setState({pressed : true})
    }

    handleMouseUp = (e) => {
        this.setState({pressed : false})
    }

    render () {

        let styles = getStyles(this.props, this.state)

        return (
            <button style={styles.root}
                    onClick={this.props.onClick}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                    onMouseDown={this.handleMouseDown}
                    onMouseUp={this.handleMouseUp}>
                {this.props.title}
                {this.props.children}
            </button>
        )

    }
}

ElevatedAutoLitButton.propTypes = {
    title : PropTypes.node.isRequired,
    onClick : PropTypes.func.isRequired,
    hue: PropTypes.number.isRequired,
    saturation: PropTypes.number.isRequired,

    /**
     * Three percentage numbers [0, 100]
     * representing the lightning level for
     * Normal/Hover/Pressed button states
     */
    lightingLevels: PropTypes.array,

    /**
     * Two numbers, pixels of bottom border
     * of button in normal and pressed state.
     */
    elevationLevels: PropTypes.array,

    borderShadowLightingLevel : PropTypes.number,
    height : PropTypes.number,
    width : PropTypes.number,


    style : PropTypes.object,

}

ElevatedAutoLitButton.defaultProps = {
    hue: 0,
    saturation:0,
    lightingLevels: [60, 50, 40],
    elevationLevels: [3, 2],
    borderShadowLightingLevel: 25 //  45%
}

export default ElevatedAutoLitButton