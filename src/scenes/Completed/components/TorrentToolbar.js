import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'

import Toolbar, {
    OpenFolderSection,
    PlaySection,
    RemoveAndDeleteSection,
    RemoveSection,
    StartUploadingSection} from '../../../components/Toolbar'

const TorrentToolbar = observer((props) => {

  return (
    <Toolbar>

      <PlaySection canPlay={props.torrentTableRowStore.canPlayMedia}
                   play={() => { props.torrentTableRowStore.playMedia() }}
      />

      { /**
       <StartUploadingSection canBeginPaidUploadWidthDefaultTerms={props.torrentTableRowStore.torrentStore.canBeginUploading && !props.torrentTableRowStore.beingRemoved}
       onClick={() => { props.torrentTableRowStore.beginPaidUploadWithDefaultTerms() }}
       />
       **/
      }

      <RemoveSection enabled={true /** !props.torrentTableRowStore.beingRemoved **/}
                     working={false /** props.torrentTableRowStore.beingRemoved && !props.torrentTableRowStore.deletingData **/}
                     onClick={() => { props.torrentTableRowStore.remove() }} />

      <RemoveAndDeleteSection enabled={true /** !props.torrentTableRowStore.beingRemoved **/}
                              working={false /** props.torrentTableRowStore.deletingData **/}
                              onClick={() => { props.torrentTableRowStore.removeAndDeleteData() }} />

      <OpenFolderSection onClick={() => { props.torrentTableRowStore.openFolder() }} />

    </Toolbar>
  )
})

TorrentToolbar.propTypes = {
  torrentTableRowStore: PropTypes.object.isRequired // HMR breaks PropTypes.instanceOf(TorrentTableRowStore)
}

export default TorrentToolbar
