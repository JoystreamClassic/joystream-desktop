import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { Row } from '../../../components/Table'
import {
  NameField,
  BytesField,
  IsUploading,
  PeerCountField
} from '../../../components/RowFields'
import ControlUploadingButtonField from './ControlUploadingButtonField'
import TorrentToolbar from './TorrentToolbar'
import AbsolutePositionChildren from '../../../components/AbsolutePositionChildren/AbsolutePositionChildren'

const TorrentRow = observer((props) => {
  
  let torrentStore = props.torrentTableRowStore.torrentStore
  
  return (
    <Row
      onMouseEnter={() => { props.torrentTableRowStore.setShowToolbar(true) }}
      onMouseLeave={() => { props.torrentTableRowStore.setShowToolbar(false) }}
      backgroundColor={props.backgroundColor}
    >
      <NameField name={torrentStore.name} />

      <ControlUploadingButtonField torrentTableRowStore={props.torrentTableRowStore} />

      {/** <IsUploading uploading={torrentStore.canEndUploading} /> **/}
      
      <BytesField bytes={torrentStore.totalSize} />
      
      <PeerCountField count={torrentStore.numberOfBuyers} />

      <AbsolutePositionChildren left={-200} top={13}>
        <TorrentToolbar torrentTableRowStore={props.torrentTableRowStore} />
      </AbsolutePositionChildren>

    </Row>
  )
  
})

TorrentRow.propTypes = {
  torrentTableRowStore: PropTypes.object.isRequired, // HMR breaks => PropTypes.instanceOf(TorrentTableRowStore).isRequired,
  backgroundColor: PropTypes.string
}

export default TorrentRow
