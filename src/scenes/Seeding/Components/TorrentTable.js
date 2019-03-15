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
    <Dropzone disableClick style={styles.dropZoneStyle} onDrop={(files) => { props.uploadingStore.startTorrentUploadFlowFromDragAndDrop(files) }}>
       <Table>

         <TableHeader>
            <StringHeaderLabel title=""/>

            <StringHeaderLabel title="SPEED"/>
            <ExplainedHeaderLabel title={"PRICE"}
                                  tooltip={
                                            <div style={{ width: '250px'}}>
                                              This is the number of satoshi paid per piece of the given torrent, where different torrents have a different number of pieces. Currently this price calculation is hard coded, but in the future you will be able to freely adjust it yourself.
                                            </div>
                                          }
                                  multiline={true}
            />
            <StringHeaderLabel title="REVENUE"/>
            <ExplainedHeaderLabel title={"BUYERS"}
                                  tooltip={
                                            <div style={{ width: '350px'}}>
                                              Buyers may choose to download from other peers for free, or pay other sellers, so do not be surprised if you are not making revenue at any given time, despite there being buyers present.
                                            </div>
                                          }
                                  multiline={true}
            />
         </TableHeader>
         <TableBody>
         {
           props.uploadingStore.torrentRowStores.length === 0
             ?
             <Hint title='Drop torrent file here to start uploading' key={0}/>
             :
             props.uploadingStore.torrentRowStores.map((t, i) => {

               return (
                 <TorrentRow
                   key={t.torrentStore.infoHash}
                   torrentTableRowStore={t}
                   backgroundColor={(i % 2 === 0) ? styles.evenRow.backgroundColor : styles.oddRow.backgroundColor}
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
  uploadingStore: PropTypes.object.isRequired // HMR breaks instanceof test on UploadingStore
}

export default TorrentTable
