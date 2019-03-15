/**
 * Created by bedeho on 05/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'

import Toolbar, {
    OpenFolderSection,
    PlaySection,
    RemoveAndDeleteSection,
    RemoveSection,
    StopUploadingSection} from '../../../components/Toolbar/index'

const TorrentToolbar = observer((props) => {
  return (
    <Toolbar>

      <PlaySection canPlay={props.torrentTableRowStore.canPlayMedia}
                   play={() => { props.torrentTableRowStore.playMedia() }}
      />

      <StopUploadingSection onClick={() => { props.torrentTableRowStore.torrentStore.endUploading() }} />

      <RemoveSection enabled={true /**!props.torrentTableRowStore.beingRemoved **/}
                     working={false /**props.torrentTableRowStore.beingRemoved && !props.torrentTableRowStore.deletingData **/}
                     onClick={() => { props.torrentTableRowStore.remove() }} />

      <RemoveAndDeleteSection enabled={true /**!props.torrentTableRowStore.beingRemoved **/}
                              working={false /** props.torrentTableRowStore.deletingData **/}
                              onClick={() => { props.torrentTableRowStore.removeAndDeleteData() }} />

      <OpenFolderSection onClick={() => { props.torrentTableRowStore.openFolder() }} />
    </Toolbar>
  )
})

TorrentToolbar.propTypes = {
  torrentTableRowStore: PropTypes.object.isRequired // HMR breaks instanceOf(TorrentTableRowStore)
}

export default TorrentToolbar
