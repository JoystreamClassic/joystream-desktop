/**
 * Created by bedeho on 26/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import ImprovedSvgIcon from '../ImprovedSvgIcon'
import IconButton from 'material-ui/IconButton'

function getStyles(props) {

    return {
        root :  {
            display : props.open ? 'block' : 'none',
            height : '100%',
            width : '100%',
            position: 'absolute',
            left: '0px',
            top: '0px',
            backgroundColor: 'white',
            zIndex: 2000,
            transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms'
        },
        buttonRoot : {
            right: '16px',
            top: '16px',
            position: 'absolute',
            display: props.enableCloseButton ? 'block' : 'none',
            height: 'none',
            width: 'none'
        },
        icon : {
            width : '32px',
            height : '32px',
        }
    }
}

const CloseSvgIcon = (props) => {

    return (
        <ImprovedSvgIcon {...props}>
            <line data-color="color-2" fill="none" strokeWidth="3" strokeLinecap="square" strokeMiterlimit="10" x1="44" y1="20" x2="20" y2="44" strokeLinejoin="miter"></line>
            <line data-color="color-2" fill="none" strokeWidth="3" strokeLinecap="square" strokeMiterlimit="10" x1="44" y1="44" x2="20" y2="20" strokeLinejoin="miter"></line>
            <circle fill="none" strokeWidth="3" strokeLinecap="square" strokeMiterlimit="10" cx="32" cy="32" r="30" strokeLinejoin="miter"></circle>
        </ImprovedSvgIcon>
    )
}

const FullScreenDialog = (props) => {

    let styles = getStyles(props)

    let iconProps = {
        viewBox : '0 0 64 64',
        color : 'hsla(0, 0%, 80%, 1)',
        hoverColor : 'hsla(0, 0%, 60%, 1)'
    }

    return (
        <div
            style={styles.root}
        >
            <IconButton
                iconStyle={styles.icon}
                style={styles.buttonRoot}
                onClick={props.closeClick}
                disableTouchRipple={true}
            >
                <CloseSvgIcon {...iconProps}/>
            </IconButton>
            {props.children}
        </div>
    )
}

FullScreenDialog.propTypes = {
    open : PropTypes.bool.isRequired,
    closeClick : PropTypes.func.isRequired,
    enableCloseButton : PropTypes.bool.isRequired
}

export default FullScreenDialog