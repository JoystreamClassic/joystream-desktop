/**
 * Created by bedeho on 26/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import FlatButton from 'material-ui/FlatButton'

import InnerDialogHeading from '../../../../components/FullScreenDialog/InnerDialogHeading'

function getStyles (props) {
  return {
    textContainer: {
      fontFamily: 'Arial',
      fontSize: '60px',
      fontWeight: 'bold'
    },
    optionBox: {
      border: '3px solid #BEBEBE',
      overflow: 'hidden',
      borderRadius: '10px',
      display: 'flex',
      marginTop: '30px'
    }
  }
}

const UserSelectingTorrentFileOrRawContentScene = (props) => {
  let styles = getStyles(props)
/**
 * add support for
    state === 'Started.OnUploadingScene.UserSelectingTorrentFileOrRawContent' ||
    state === 'Started.OnUploadingScene.TorrentFileWasInvalid' ||
    state === 'Started.OnUploadingScene.TorrentAlreadyAdded'
*/

  return (
    <InnerDialogHeading title='What do you have?'>
      <div style={styles.optionBox}>
        <Option title='Torrent file' onClick={() => { props.store.hasTorrentFile() }} />
        <Option title='Raw data' onClick={() => { props.store.hasRawContent() }} isEdge />
      </div>
    </InnerDialogHeading>
  )
}

UserSelectingTorrentFileOrRawContentScene.propTypes = {
  store: PropTypes.object.isRequired
}

const Option = (props) => {
  let styles = {
    root: {
      width: '350px'
    },
    title: {
      display: 'flex',
      flexDirection: 'column',
      padding: '30px',
      fontSize: '30px',
      fontWeight: 'bold',
      textAlign: 'center',
      borderRight: props.isEdge ? 'none' : '2px solid #BEBEBE',
      backgroundColor: '#EBEBEB',
      color: '#7A7A7A'
    },
    option: {
      padding: '100px',
      fontSize: '40px'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px',
      borderRight: props.isEdge ? 'none' : '2px solid #BEBEBE'
    }
  }

  return (
    <div style={styles.root} onClick={props.onClick}>
      <div style={styles.title}>
        {props.title}
      </div>
      <div style={styles.button}>
        <FlatButton label={props.title} onClick={props.onClick} />
      </div>
    </div>
  )
}

export default UserSelectingTorrentFileOrRawContentScene
