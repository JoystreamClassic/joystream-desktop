/**
 * Created by bedeho on 23/03/2018.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Radium from 'radium'

import {Field} from './../../../components/Table'
import { Provider, observer, inject } from 'mobx-react'
import assert from 'assert'
import ReactTooltip from 'react-tooltip'

function getColors(props, state) {

  if (props.viabilityOfPaidDownloadingTorrent.constructor.name === 'CanStart') {
    if (state.hover) {
      return {
        textColor: 'white',
        subTextColor: 'rgba(255,255,255, 0.7)',
        borderColor : 'transparent',
        background : '#378b61'
      }
    } else {
      return {
        textColor: 'white',
        subTextColor: 'rgba(255,255,255, 0.7)',
        borderColor : 'transparent', //'rgba(92, 184, 92, 0.7)',
        background : 'rgb(84, 187, 135)' //'rgba(92, 184, 92, 0.3)'
      }
    }

  } else if (props.viabilityOfPaidDownloadingTorrent.constructor.name === 'AlreadyStarted') {
    return {
      textColor: 'black',
      subTextColor: 'black',
      borderColor : 'transparent',
      background : 'hsla(180, 1%, 80%, 0.4)'
    }
  }

  // not viable or torrent is already downloaded
  return {
    textColor: 'rgba(208, 208, 208, 1)',
    subTextColor: 'rgba(208, 208, 208, 0.7)',
    borderColor : '#dedede', //'rgba(240, 173, 78, 1)',
    background : 'transparent' // rgba(240, 173, 78, 0.4)'
  }

}

function getStyles(isStarted) {

  let colors = {
    normal : {
      not_started : {
        color: 'rgba(255,255,255, 1)',
        backgroundColor: 'rgb(84, 187, 135)'
      },
      started : {
        color: '#d0d0d0',
        backgroundColor: 'transparent'
      }
    },
    hover : {
      not_started : {
        color: 'white',
        backgroundColor:'#378b61'
      },
      started : {
        color: 'white',
        backgroundColor:'black'
      }
    }
  }

  return {
    root : {
      display : 'flex',
      flexDirection : 'row',
      flex: '0 0 210px',
      fontSize : '12px',
      borderRadius : '50px',
      fontWeight : 'bold',
      height : '45px',

      // colors
      border : (isStarted ? '1px solid ' + colors.normal.started.color : 'none'),
      color : isStarted ? colors.normal.started.color : colors.normal.not_started.color,
      backgroundColor : isStarted ? colors.normal.started.backgroundColor : colors.normal.not_started.backgroundColor,

      ':hover' : {

        border : 'none',
        // colors
        color : isStarted ? colors.hover.started.color : colors.hover.not_started.color,
        backgroundColor : isStarted ? colors.hover.started.backgroundColor : colors.hover.not_started.backgroundColor,
      }
    },
    iconContainer : {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex : '0 0 30px',
      marginLeft: '10px',
      paddingRight: '10px',
    },
    textContainer : {
      display : 'flex',
      flexDirection : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: '1',
      marginRight: '20px'
    },
    text :  {
      fontSize: '13px'
    },
    speedupSvgIcon : {
      color : isStarted ? colors.normal.started.color : colors.normal.not_started.color,
      height : '24px',
      width : '24px',

      ':hover' : {
        color : isStarted ? colors.hover.started.color : colors.hover.not_started.color,
      }
    }
  }

}

import SvgIcon from 'material-ui/SvgIcon'

const UploadSvgIcon = (props) => {
  return (
    <SvgIcon viewBox={'0 0 24 24'} {...props}>
      <path d="M12,0C5.383,0,0,5.383,0,12c0,6.617,5.383,12,12,12s12-5.383,12-12S18.617,0,12,0z M12,5l5,6h-4v8h-2v-8H7 L12,5z"></path>
    </SvgIcon>
  )
}

const ControlUploadingButton = Radium(observer((props) => {

  let isStarted = !(!!props.torrentTableRowStore.torrentStore.canBeginUploading) // && !props.torrentTableRowStore.beingRemoved}
  let onClick = () => {

    if(isStarted) {
      props.torrentTableRowStore.torrentStore.endUploading()
    }
    else {
      props.torrentTableRowStore.beginPaidUploadWithDefaultTerms()
    }

  }

  let styles = getStyles(isStarted)

  return (
    <div style={styles.root}
         onClick={onClick}
    >
      <div style={styles.iconContainer}>
        <UploadSvgIcon style={styles.speedupSvgIcon}/>
      </div>

      <div style={styles.textContainer}>

        <div style={styles.text}>
          {
            !isStarted
            ?
              "MAKE MONEY"
            :
              "STOP MAKING MONEY"
          }
        </div>

      </div>


    </div>
  )

}))

ControlUploadingButton.propTypes = {
  torrentTableRowStore : PropTypes.object.isRequired
}

const ControlUploadingButtonField = (props) => {

  let styles = {
    root : {
      flex: '0 0 180px'
    }
  }

  return (
    <Field style={styles.root}>
      <ControlUploadingButton torrentTableRowStore={props.torrentTableRowStore}
      />
    </Field>
  )
}

ControlUploadingButtonField.propTypes = {
  torrentTableRowStore : PropTypes.object.isRequired
}

export default ControlUploadingButtonField