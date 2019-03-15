/**
 * Created by bedeho on 10/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyle(props) {

    return {
        root : {
            display : 'flex',
            flexDirection : 'row',
        },
        separator : {
            backgroundColor : props.separatorColor,
            width : '2px'
        }
    }
}

const ButtonGroup = (props) => {

    let style = getStyle(props)

    return (
        <div style={style.root}>
            {
                props.children.map((child, index) => {

                    return (
                        <div style={{ display : 'flex'}} key={index}>
                            {child}
                            {
                                index != props.children.length-1
                                    ?
                                <div style={style.separator}></div>
                                    :
                                null
                            }
                        </div>
                    )

                })
            }
        </div>
    )
}

ButtonGroup.propTypes = {
    separatorColor : PropTypes.string.isRequired
}

export default ButtonGroup