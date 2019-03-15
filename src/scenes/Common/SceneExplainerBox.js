/**
 * Created by bedeho on 26/02/2018.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyles(props) {

  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      color: 'white',
      fontFamily: 'Arial',
      backgroundColor: props.backgroundColor,
      padding: '25px 35px',
      borderRadius: '5px'
    },
    title: {
      fontWeight: 'bold',
      fontSize: '34px',
    },
    explainer: {
      fontSize: '24px',
      marginTop: '15px',
      marginBottom: '10px',
    }
  }
}

const SceneExplainerBox = (props) => {

  let styles = getStyles(props)

  return (
    <div style={styles.root}>
      <div style={styles.title}>
        {props.title}
      </div>
      <div style={styles.explainer}>
        {props.explainer}
      </div>
    </div>
  )
}

SceneExplainerBox.propTypes = {
  title : PropTypes.node.isRequired,
  explainer : PropTypes.node.isRequired,
  backgroundColor : PropTypes.string.isRequired
}

export default SceneExplainerBox