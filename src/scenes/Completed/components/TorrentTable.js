import React, { Component } from 'react'
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
import CompletedStore from '../Stores'

function getStyle(props) {
  
  return {
    evenRow : {
      backgroundColor : 'rgba(222, 222, 222, 0.2)', //'hsla(0, 0%, 93%, 1)',
    },
    oddRow : {
      backgroundColor : 'transparent'
    }
  }
}

const TorrentsTable = observer((props) => {
  
  let styles = getStyle(props)
  
  return (
    <Table>
      <TableHeader>
        <StringHeaderLabel title=""/>
        <StringHeaderLabel title="SIZE"/>
        <StringHeaderLabel title="BUYERS"/>
      </TableHeader>
      <TableBody>
      {
        props.completedStore.torrentRowStores.map((t, index) => {
          
          return (
            <TorrentRow key={t.torrentStore.infoHash}
                        torrentTableRowStore={t}
                        backgroundColor={index % 2 === 0 ? styles.evenRow.backgroundColor : styles.oddRow.backgroundColor}
            />
          )
        })
      }
      </TableBody>
    </Table>
  )
})

TorrentsTable.propTypes = {
  completedStore : PropTypes.object.isRequired // HMR is breaks => PropTypes.instanceOf(CompletedStore).isRequired
}

export default TorrentsTable
