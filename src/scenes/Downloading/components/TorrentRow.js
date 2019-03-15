/**
 * Created by bedeho on 23/05/17.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { Row } from '../../../components/Table/index'
import {
  NameField,
  StatusField,
  BytesField,
  ProgressField,
  BytesPerSecondField,
  ETAField,
  ModeField,
  PeerCountField
} from '../../../components/RowFields/index'
import StartPaidDownloadField from './StartPaidDownloadingField'
import TorrentToolbar from './TorrentToolbar'
import AbsolutePositionChildren from '../../../components/AbsolutePositionChildren/AbsolutePositionChildren'
import {TorrentTableRowStore} from '../../Common/index'

const TorrentRow = observer((props) => {
  
  let torrentStore = props.torrentTableRowStore.torrentStore
    
  return (
    <Row
      onMouseEnter={() => { props.torrentTableRowStore.setShowToolbar(true) }}
      onMouseLeave={() => { props.torrentTableRowStore.setShowToolbar(false) }}
      backgroundColor={props.backgroundColor}
    >
      <NameField name={torrentStore.name} />

      <StartPaidDownloadField torrentTableRowStore={props.torrentTableRowStore}/>
      
      {/** <StatusField paused={torrentStore.canStart} /> **/ }

      <BytesField bytes={torrentStore.totalSize} />

      <ProgressField progress={torrentStore.progress} />

      <BytesPerSecondField bytes={torrentStore.downloadSpeed} />

      <ETAField
        bytes_remaining={torrentStore.totalSize - torrentStore.downloadedSize}
        bytes_per_second={torrentStore.downloadSpeed}
      />

      {/** <ModeField isPaid={torrentStore.hasStartedPaidDownloading} /> **/ }

      <PeerCountField count={torrentStore.numberOfSeeders} />

      <PeerCountField count={torrentStore.numberOfSellers} />

      <AbsolutePositionChildren left={-250} top={13}>
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
