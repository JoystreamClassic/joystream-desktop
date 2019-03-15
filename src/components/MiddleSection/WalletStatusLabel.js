/**
 * Created by bedeho on 02/11/2017.
 */

import React from 'react'
import SimpleLabel from  './SimpleLabel'
import PropTypes from 'prop-types'

import CircularProgress from 'material-ui/CircularProgress'
import SvgIcon from 'material-ui/SvgIcon'

function getStyle(props) {

  return {
    synchronizedText : {
      fontSize: '13px',
      fontWeight: 'bold'
    },
    linearProgressContainer : {
      padding: '0px 0px'
    },
    CircularProgress :  {
      color : 'white',
      style : {
        position : 'relative',
        top : '3px'
      }
    },
    completedIcon : {
      top: '3px',
      left: '-4px',
      position: 'relative',
      height : '22px',
      width : '22px'
    }
  }
}

const CompletedIcon = (props) => {

  return (
    <SvgIcon viewBox="0 0 24 24" {...props}>
      <path d="M20.4,8.4c-0.5,0.1-0.8,0.7-0.7,1.2c0.2,0.8,0.3,1.6,0.3,2.4c0,5-4,9-9,9s-9-4-9-9s4-9,9-9 c1.7,0,3.3,0.5,4.7,1.3c0.5,0.3,1.1,0.1,1.4-0.3c0.3-0.5,0.1-1.1-0.3-1.4C15,1.6,13,1,11,1C4.9,1,0,5.9,0,12s4.9,11,11,11 s11-4.9,11-11c0-1-0.1-2-0.4-2.9C21.5,8.6,20.9,8.3,20.4,8.4z"></path>
      <path d="M22.7,2.3c-0.4-0.4-1-0.4-1.4,0L11,12.6L7.7,9.3c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l4,4 c0.2,0.2,0.5,0.3,0.7,0.3s0.5-0.1,0.7-0.3l11-11C23.1,3.3,23.1,2.7,22.7,2.3z"></path>
    </SvgIcon>
  )
}

/**
 <LinearProgress mode="determinate"
 value={props.synchronizationPercentage}
 color={'#ffffff'}
 style={styles.linearProgress}
 />
 {  <span style={styles.synchronizedText}></span> }
 */

const WalletStatusLabel = (props) => {

  let styles = getStyle(props)

  return (

    <SimpleLabel labelNode="SYNCHRONIZATION"
                 valueNode={
                    props.synchronizationPercentage === 100
                      ?
                      <CompletedIcon color={'white'}
                                     style={styles.completedIcon}
                      />
                    :
                      <CircularProgress color={styles.CircularProgress.color}
                                        size={20}
                                        style={styles.CircularProgress.style}
                      />
                 }
                 valueFieldWidth="60px"
                 {...props}
    />
  )

}

WalletStatusLabel.propTypes = {
  synchronizationPercentage : PropTypes.number.isRequired,
  backgroundColorLeft : PropTypes.string.isRequired,
  backgroundColorRight : PropTypes.string.isRequired
}

export default WalletStatusLabel