/**
 * Created by bedeho on 03/08/17.
 */
import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import DownloadingStore from '../../Stores/DownloadingStore'

import {
  InvalidTorrentFileAlertDialog,
  TorrentAlreadyAddedAlertDialog
} from '../../../../components/AlertDialog'

const StartDownloadingFlow = observer((props) => {

  return (
    <div>
      <InvalidTorrentFileAlertDialog
        open={props.downloadingStore.state === DownloadingStore.STATE.TorrentFileWasInvalid}
        canRetry={props.downloadingStore.lastFilePickingMethodUsed === DownloadingStore.TORRENT_ADDING_METHOD.FILE_PICKER}
        onAcceptClicked={() => { props.downloadingStore.acceptTorrentFileWasInvalid() }}
        onRetryClicked={() => { props.downloadingStore.retryPickingTorrentFile() }} />

      <TorrentAlreadyAddedAlertDialog
        open={props.downloadingStore.state === DownloadingStore.STATE.TorrentAlreadyAdded}
        onOkClicked={() => { props.downloadingStore.acceptTorrentWasAlreadyAdded() }} />
    </div>
  )
})

StartDownloadingFlow.propTypes = {
  downloadingStore: PropTypes.object // HMR breaks instanceOf(DownloadingStore).isRequired
}

module.exports = StartDownloadingFlow
