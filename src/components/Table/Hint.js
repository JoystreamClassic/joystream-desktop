import React from 'react'
import PropTypes from 'prop-types'

function getStyles(props) {

    return  {
        root : {
            textAlign: 'center',
            padding: '10px',
            paddingLeft: '30px',
            paddingRight: '30px',
            //border: '4px solid hsla(0, 0%, 93%, 1)',
            backgroundColor: 'hsla(0, 0%, 93%, 1)',
            fontSize: '30px',
            color: 'hsla(0, 0%, 70%, 1)',
            margin: 'auto',
            borderRadius: '50px'
        }
    }
}


const Hint = (props) => {

  let styles = getStyles(props)

  return (
    <span style={styles.root}>
        {props.title}
    </span>
  )
}

Hint.propType = {
    title : PropTypes.string.isRequired
}

export default Hint
