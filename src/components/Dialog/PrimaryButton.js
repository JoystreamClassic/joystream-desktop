/**
 * Created by bedeho on 24/11/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'
import FlatButton from 'material-ui/FlatButton'

function getStyle(props) {

  return {
    root : {
      width : '177px',
      backgroundColor : '#007bff', //props.disabled ? 'rgb(137, 180, 224)' : '#007bff',
      height : '54px',
      borderRadius : '4px'
    },
    labelStyle : {
      color : props.disabled ? 'hsla(211, 100%, 95%, 0.8)' : 'hsla(211, 100%, 95%, 1)', //'#949494',
      fontSize : '16px',
      textTransform : 'uppercase',
      fontFamily : 'Arial',
      fontWeight : '100',
    }
  }
}


const PrimaryButton = (props) => {

  let styles = getStyle(props)

  return (
    <FlatButton primary={true}
                disableTouchRipple={true}
                {...props}
                style={styles.root}
                labelStyle={styles.labelStyle}
                hoverColor={'#4da3ff'}
    />
  )
}

export default PrimaryButton