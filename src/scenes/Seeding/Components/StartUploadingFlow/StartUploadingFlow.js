/**
 * Created by bedeho on 26/09/17.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import FullScreenDialog from '../../../../components/FullScreenDialog'
import LoadingTorrentForUploading from './LoadingTorrentForUploading'
import UserPickingSavePath from './UserPickingSavePath'
import IncompleteDownloadWarning from './IncompleteDownloadWarning'
import DroppingPriorAutoStartedDownload from './DroppingPriorAutoStartedDownload'

import UploadingStore from '../../Stores/UploadingStore'

import {
  InvalidTorrentFileAlertDialog,
  TorrentAlreadyAddedAlertDialog
} from '../../../../components/AlertDialog'

const StartUploadingFlow = observer((props) => {
  let state = props.uploadingStore.state

  let fullScreenDialogContent
  let enableCloseButton = true
  let fullScreen =
  // state === 'Started.OnUploadingScene.UserSelectingTorrentFileOrRawContent' ||
  // state === 'Started.OnUploadingScene.TorrentFileWasInvalid' ||
  // state === 'Started.OnUploadingScene.TorrentAlreadyAdded' ||
  state === UploadingStore.STATE.UserPickingSavePath ||
  state === UploadingStore.STATE.AddingTorrent ||
  state === UploadingStore.STATE.TellUserAboutIncompleteDownload ||
  state === UploadingStore.STATE.DroppingPriorAutoStartedDownload

  switch (state) {
    case UploadingStore.STATE.UserPickingSavePath:
      fullScreenDialogContent = <UserPickingSavePath {...props} />
      break
    case UploadingStore.STATE.AddingTorrent:
      fullScreenDialogContent = <LoadingTorrentForUploading {...props} />
      break
    case UploadingStore.STATE.TellUserAboutIncompleteDownload:
      fullScreenDialogContent = <IncompleteDownloadWarning uploadingStore={props.uploadingStore} />
      break
    case UploadingStore.STATE.DroppingPriorAutoStartedDownload:
      fullScreenDialogContent = <DroppingPriorAutoStartedDownload uploadingStore={props.uploadingStore} />
      break
    default:
      fullScreenDialogContent = null
  }

  return (
    <div>
      <InvalidTorrentFileAlertDialog
        open={state === UploadingStore.STATE.TorrentFileWasInvalid}
        canRetry={props.uploadingStore.lastFilePickingMethodUsed === UploadingStore.TORRENT_ADDING_METHOD.FILE_PICKER}
        onAcceptClicked={() => { props.uploadingStore.acceptTorrentFileWasInvalid() }}
        onRetryClicked={() => { props.uploadingStore.retryPickingTorrentFile() }} />

      <TorrentAlreadyAddedAlertDialog
        open={state === UploadingStore.STATE.TorrentAlreadyAdded}
        onOkClicked={() => { props.uploadingStore.acceptTorrentWasAlreadyAdded() }} />

      <FullScreenDialog
        closeClick={() => { props.uploadingStore.exitStartUploadingFlow() }}
        open={fullScreen}
        enableCloseButton={enableCloseButton} >
        { fullScreenDialogContent }
      </FullScreenDialog>
    </div>
  )
})

StartUploadingFlow.propTypes = {
  uploadingStore: PropTypes.object.isRequired
}

export default StartUploadingFlow
