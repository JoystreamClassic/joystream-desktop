/**
 * Created by bedeho on 09/10/2017.
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


function getStyles(props, state) {

    let hsColorPart = props.hue + ',' + props.saturation + '%'
    let color = 'hsl(' + hsColorPart + ', ' + getButtonFaceLighting(state, props) + '%)'

    let style = {
        border : props.borderWidth + 'px solid ' + color,
        color: color,
        borderRadius : '8px',
        backgroundColor : props.backgroundColor,
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: '22px',
        height: props.height + 'px',
        width: props.width + 'px',
    }

    // Add final override user styles
    Object.assign(style, props.style)

    return {

        root : style
    }
}

class FlatBorderButton extends Component {

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
            </button>
        )

    }
}

FlatBorderButton.propTypes = {
    title : PropTypes.node.isRequired,
    onClick : PropTypes.func.isRequired,
    hue: PropTypes.number.isRequired,
    saturation: PropTypes.number.isRequired,
    borderWidth: PropTypes.number,
    backgroundColor: PropTypes.string.isRequired,
    height : PropTypes.number.isRequired,
    width : PropTypes.number.isRequired,

    /**
     * Three percentage numbers [0, 100]
     * representing the lightning level for
     * Normal/Hover/Pressed button states
     */
    lightingLevels: PropTypes.array,

    style : PropTypes.object,
}

FlatBorderButton.defaultProps = {
    hue: 0,
    saturation : 0,
    borderWidth : 3,
    lightingLevels: [60, 50, 40],

}

export default FlatBorderButton