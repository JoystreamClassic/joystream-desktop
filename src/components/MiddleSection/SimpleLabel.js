/**
 * Created by bedeho on 13/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import Label from './Label'

function getStyle(props) {

    return {
        icon : {

        },

        left : {
            paddingTop: '1px', // adjust text to vertical center
            paddingLeft: '20px',
            paddingRight: '20px',
            color: props.colorLeft,
            fontWeight: 'bold',
            fontSize: '12px',
            textAlign: 'center'
        },

        right :  {
            paddingTop: '1px', // adjust text to vertical center
            width: props.valueFieldWidth,
            //marginLeft: 14,
            //marginRight: 14+14,
            color: 'white',
            fontSize: '18px', // 15px
            textAlign: 'center'
        }

    }
}

const SimpleLabel = (props) => {

    let style = getStyle(props)

    let leftField = (
        <div style={style.left}>
            {props.iconNode ? props.iconNode : null}
            {props.labelNode}
        </div>
    )

    let rightField = <div style={style.right}> {props.valueNode} </div>

    return (
        <Label height={props.height}
               leftField={leftField}
               rightField={rightField}
               backgroundColorLeft={props.backgroundColorLeft}
               backgroundColorRight={props.backgroundColorRight}
        />
    )

}

class Palette {

    constructor() {

    }
}

//SimpleLabel.Palette = Palette

SimpleLabel.propTypes = {
    iconNode : PropTypes.node,
    labelNode : PropTypes.node.isRequired,
    valueNode : PropTypes.node.isRequired,
    //titleWidth : PropTypes.string.isRequired,
    height : PropTypes.number,
    valueFieldWidth : PropTypes.string.isRequired,
    backgroundColorLeft : PropTypes.string.isRequired,
    backgroundColorRight : PropTypes.string.isRequired,

    colorLeft : PropTypes.string.isRequired
}

SimpleLabel.defaultProps = {
    height : 55,
    colorLeft : 'rgba(255, 255, 255, 0.7)'
}

export default SimpleLabel