/**
 * Created by bedeho on 20/08/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

import SvgIcon from 'material-ui/SvgIcon'
import Badge from 'material-ui/Badge'
import {blue500, red500, greenA200} from 'material-ui/styles/colors'

import AbsolutePositionChildren from '../AbsolutePositionChildren/AbsolutePositionChildren'

function getStyles(props, state) {

    let rootColor
    let contentColor

    if(props.disabled) {
        rootColor = props.rootColors.disabled
        contentColor = props.contentColors.disabled
    } else if(props.selected) {
        rootColor = props.rootColors.selected
        contentColor = props.contentColors.selected
    } else {

        // not selected

        if(state.hover) { //
            rootColor = props.rootColors.hover
            contentColor = props.contentColors.hover
        } else { // normal
            rootColor = props.rootColors.normal
            contentColor = props.contentColors.normal
        }
    }

    return {

        root : Object.assign({
            position: 'relative', // needed to absolute position countContainer
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width : '110px',
            //height: '80px',
            backgroundColor: rootColor,
            //borderBottom : '2px solid ' + ,
        }, props.style),

        countContainer : {
            display : 'none', // disabling this for now, failed attempt
            position : 'absolute',
            left : '60px',
            top : '10px',
            backgroundColor: 'hsl(198, 8%, 83%)',
            borderRadius: '2px',
            fontSize: '10px',
            fontWeight: 'bold',
            paddingLeft: '2px',
            paddingRight: '4px',
        },

        contentContainer : {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },

        notification : {
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            position: 'relative',
            top: '0px',
            right: '0px',
            fontWeight: '500',
            fontSize: '10px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            color: 'white',
            background: props.notificationColor,
            border: '2px solid ' + rootColor,
        },

        icon : {
            height: '24px',
            width: '24px',
            svgIconColor : contentColor
        },

        title : {
            display : props.title ? 'block' : 'none',
            color: contentColor,
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '0px',
            paddingLeft: '8px',
            paddingRight: '8px',
            //borderRadius: '100px',
            backgroundColor : 'none',
            cursor: 'default',
            marginTop: '10px',
            textTransform : 'uppercase'
        }
    }
}

class Button extends Component {

    constructor(props) {
        super(props)

        this.state = {hover : false}
    }

    handleMouseEnter = () => {

        if(!this.props.disabled)
            this.setState({hover : true})
    }

    handleMouseLeave = () => {

        if(!this.props.disabled)
            this.setState({hover : false})
    }

    render() {

        var style = getStyles(this.props, this.state)

        return (
            <div style={style.root}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseLeave={this.handleMouseLeave}
                 onClick={this.props.onClick}>

                <div style={style.countContainer}>
                    123
                </div>

                <div style={style.contentContainer}>

                    <NotificationCount count={this.props.notificationCount} style={style.notification}/>

                    <SvgIcon color={style.icon.svgIconColor}
                             viewBox={this.props.viewBox}
                             style={style.icon}>
                        {this.props.children}
                    </SvgIcon>

                    <span style={style.title}>{this.props.title}</span>

                </div>

            </div>
        )

    }

}

const NotificationCount = (props) => {

    if(!props.count || props.count == 0)
        return null
    else
        return (
            <AbsolutePositionChildren left={5} top={-10}>
                <div style={props.style}>
                    {props.count}
                </div>
            </AbsolutePositionChildren>
        )
}

Button.propTypes = {
    disabled : PropTypes.bool,
    selected : PropTypes.bool,
    title : PropTypes.string.isRequired,
    onClick : PropTypes.func.isRequired,

    rootColors : PropTypes.object.isRequired,
    contentColors : PropTypes.object.isRequired,
    notificationColor : PropTypes.string.isRequired,

    viewBox : PropTypes.string,

    notificationCount : PropTypes.number
}

Button.defaultProps = {
    disabled : false,
    selected : false,
    onClick : () => {},
}


export default Button