/**
 * Created by bedeho on 20/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyles(props, context) {

    // Root node
    let rootStyle = {
        backgroundColor: props.backgroundColor,
        //paddingBottom: '20px',
        //paddingTop: '20px',
        display: 'flex',
        flexDirection: 'row',
        //justifyContent: 'center',
        //alignItems: 'center',
        //paddingLeft: '20px'
    }

    rootStyle = Object.assign(rootStyle, props.style)

    /**
    // Section container
    let sectionContainerStyle = {
        display : 'flex',
        flexDirection : 'row'
    }
     */

    // Button container
    let buttonContainerStyle = {
        display : 'flex',
        flexDirection : 'row'
    }

    return {
        root : rootStyle,
        //sectionContainer : sectionContainerStyle,
        buttonContainer : buttonContainerStyle
    }
}

const Header = (props) => {

    let style = getStyles(props)

    return (

        <div style={style.root}>
            { props.children }
        </div>
    )
}

Header.propTypes = {
    backgroundColor : PropTypes.string,
    style : PropTypes.object
}

export default Header