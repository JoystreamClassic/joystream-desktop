/**
 * Created by bedeho on 13/03/2018.
 */

import React from 'react'
import PropTypes from 'prop-types'
import BCHInformationNotice from './BCHInformationNotice'


function getStyles (props) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: 'rgb(73, 109, 175)',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: {
      color: 'white',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontSize: '30px',
      backgroundColor: 'hsla(219, 41%, 40%, 1)',
      padding: '10px 40px',
      borderRadius: '50px'
    }
  }
}

const BCHInformationNoticeSceneContent = (props) => {

  let styles = getStyles(props)

  return (
    <div style={styles.root}>
      <BCHInformationNotice onClick={props.onAcceptClick} onClickWhyBCH={props.onClickWhyBCH}/>
    </div>
  )

}

BCHInformationNoticeSceneContent.propTypes = {
  onAcceptClick : PropTypes.func.isRequired,
  onClickWhyBCH : PropTypes.func.isRequired
}


export default BCHInformationNoticeSceneContent