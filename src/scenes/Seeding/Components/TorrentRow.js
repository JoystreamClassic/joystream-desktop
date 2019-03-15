/**
 * Created by bedeho on 23/05/17.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import { Row } from '../../../components/Table'
import { NameField,
         StatusField,
         BytesPerSecondField,
         BitcoinValueField,
         PeerCountField} from '../../../components/RowFields'
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

      {/** <StatusField paused={torrentStore.canStart} /> **/}

      <BytesPerSecondField bytes={torrentStore.uploadSpeed} />

      <BitcoinValueField satoshis={torrentStore.sellerTerms.minPrice} />

      <BitcoinValueField satoshis={torrentStore.totalRevenueFromPiecesAsSeller} />

      <PeerCountField count={torrentStore.numberOfBuyers} />

      <AbsolutePositionChildren left={-250} top={13}>
        <TorrentToolbar torrentTableRowStore={props.torrentTableRowStore}/>
      </AbsolutePositionChildren>

    </Row>
  )
})

TorrentRow.propTypes = {
  torrentTableRowStore: PropTypes.object.isRequired, // HMR breaks => PropTypes.instanceOf(TorrentTableRowStore).isRequired,
  backgroundColor: PropTypes.string
}

export default TorrentRow
