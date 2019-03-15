/**
 * Created by bedeho on 28/09/17.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import path from 'path'
import { remote } from 'electron'

import UploadingStore from '../../Stores/UploadingStore'
import {InnerDialogHeading, TransparentButton} from '../../../../components/FullScreenDialog'
import ElevatedAutoLitButton from '../../../../components/ElevatedAutoLitButton'

function getStyles (props) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    subtitle: {
      padding: '20px',
      textAlign: 'center',
      marginTop: '30px'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '50px'
    },
    buttonSpacer: {
      width: '100px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      fontStyle: 'italic'
    },
    minorLabel: {
      fontSize: '16px',
      marginTop: '-5px',
      color: 'white',
      textAlign: 'center'
    }
  }
}

class UserPickingSavePath extends Component {
  handleChooseFolderClicked () {
    let folderPicked = remote.dialog.showOpenDialog({
      title: 'Pick folder with torrent data',
      properties: ['openDirectory']}
    )

    if (!folderPicked || folderPicked.length === 0) {
      // this.setState(UploadingStore.State.InitState)
      return
    }

    // StartUpload
    this.props.uploadingStore.startUpload(folderPicked[0])
  }

  handleUseTorrentFilePathClicked () {
    let torrentFilePath = path.dirname(this.props.uploadingStore.torrentFilePathSelected)

    // StartUpload
    this.props.uploadingStore.startUpload(torrentFilePath)
  }

  render () {
    let styles = getStyles(this.props)
    let torrentFilePath = path.dirname(this.props.uploadingStore.torrentFilePathSelected)

    return (
      <InnerDialogHeading title='Download folder'>
        <div style={styles.container}>

          <div style={styles.subtitle}>
            Seeding requires that you already have the torrent data.
          </div>

          <div style={styles.buttonContainer}>

            <TransparentButton label='Choose folder'
              onClick={this.handleChooseFolderClicked.bind(this)} />

            <div style={styles.buttonSpacer}>
              <span>or</span>
            </div>

            <ElevatedAutoLitButton title={<div>Use torrent file folder</div>}
              onClick={this.handleUseTorrentFilePathClicked.bind(this)}
              hue={212}
              saturation={100}>

              <div style={styles.minorLabel}>
                {torrentFilePath}
              </div>
            </ElevatedAutoLitButton>

          </div>
        </div>
      </InnerDialogHeading>
    )
  }
}

UserPickingSavePath.propTypes = {
  uploadingStore: PropTypes.object.isRequired
}

export default UserPickingSavePath
