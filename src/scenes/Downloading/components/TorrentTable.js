/**
 * Created by bedeho on 05/05/17.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import Table,
{
  TableHeader,
  TableBody,
  StringHeaderLabel,
  ExplainedHeaderLabel,
  Hint
} from '../../../components/Table/index'
import TorrentRow from './TorrentRow'
import Dropzone from 'react-dropzone'
import DownloadingStore from '../Stores'

function getStyle(props) {

  return {
    dropZoneStyle : {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      borderStyle: 'none'
    },
    evenRow : {
      backgroundColor : 'rgba(222, 222, 222, 0.2)', //'hsla(0, 0%, 93%, 1)',
    },
    oddRow : {
      backgroundColor : 'transparent'
    }
  }
}

const TorrentTable = observer((props) => {

  let styles = getStyle(props)

  return (
    <Dropzone disableClick style={styles.dropZoneStyle} onDrop={(files) => { props.downloadingStore.startDownloadWithTorrentFileFromDragAndDrop(files) }}>
      <Table>
        <TableHeader>
          <StringHeaderLabel title=""/>
          <StringHeaderLabel title="SIZE"/>
          <StringHeaderLabel title="PROGRESS"/>
          <StringHeaderLabel title="SPEED"/>
          <StringHeaderLabel title="ARRIVAL"/>
          <StringHeaderLabel title="SEEDERS"/>
          <StringHeaderLabel title="SELLERS"/>
        </TableHeader>
        <TableBody>
        {
          props.downloadingStore.torrentRowStores.length === 0
            ?
          <Hint title='Drop torrent file here to start download' key={0} />
            :
            props.downloadingStore.torrentRowStores.map((t, index) => {

              return (
                <TorrentRow
                  key={t.torrentStore.infoHash}
                  torrentTableRowStore={t}
                  backgroundColor={index % 2 === 0 ? styles.evenRow.backgroundColor : styles.oddRow.backgroundColor}
                />
              )

            })
        }
        </TableBody>
      </Table>
    </Dropzone>
  )

})

TorrentTable.propTypes = {
  downloadingStore: PropTypes.object // HMR breaks => PropTypes.instanceOf(DownloadingStore).isRequired
}

export default TorrentTable
