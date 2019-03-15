/**
 * Created by bedeho on 17/04/2018.
 */

import React, {Component} from 'react'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'



let style = {
  root : {
    display: 'flex',
    flexDirection: 'column'
  }
}

const IsolatedComponents = (props) => {

  return (
    <MuiThemeProvider>
      <div style={style.root}>
        <h1>Isolated Components</h1>

        <hr/>

        <h2>START DOWNLOAD FIELD</h2>

        <StartPaidDownloadingFieldSection />

      </div>
    </MuiThemeProvider>
  )
}

import StartPaidDownloadingField from '../scenes/Downloading/components/StartPaidDownloadingField'
import TorrentTableRowStore from '../scenes/Common/TorrentTableRowStore'
import {CanStart, InsufficientFunds} from '../scenes/Common/ViabilityOfPaidDownloadingTorrent'

class StartPaidDownloadingFieldSection extends Component {

  static makeStartingPaidDownloadRowStore() {

    let infoHash = 'info1'
    let torrentStore = {
      infoHash: infoHash
    }
    let uiStore = {
      torrentsViabilityOfPaidDownloading : {
        get : function() {
          return new CanStart({ }, 123)
        }
      }
    }
    let row = new TorrentTableRowStore(torrentStore, uiStore, false)
    row.setStartingPaidDownload(true)

    return row
  }

  static makeOutOfMoneyRowStore() {

    let infoHash = 'info2'
    let torrentStore = {
      infoHash: infoHash
    }
    let uiStore = {
      torrentsViabilityOfPaidDownloading : {
        get : function() {
          return new InsufficientFunds(99999, 222)
        }
      }
    }
    let row = new TorrentTableRowStore(torrentStore, uiStore, false)
    row.setStartingPaidDownload(true)

    return row
  }

  static makeOptimisingRowStore() {

    let infoHash = 'info3'
    let torrentStore = {
      infoHash: infoHash
    }
    let uiStore = {
      torrentsViabilityOfPaidDownloading : {
        get : function() {
          return new CanStart({ }, 123)
        }
      }
    }
    let row = new TorrentTableRowStore(torrentStore, uiStore, false)
    row.setBlockedStartingPaidDownloadForSwarmLatencySampling(true)

    return row
  }

  constructor() {
    super()

    this.state = {
      startPaidDownloadTorrentTableRowStore : StartPaidDownloadingFieldSection.makeStartingPaidDownloadRowStore(),
      outOfMoneyStartPaidDownloadTorrentTableRowStore : StartPaidDownloadingFieldSection.makeOutOfMoneyRowStore(),
      optimisingRowStore : StartPaidDownloadingFieldSection.makeOptimisingRowStore()
    }
  }

  render() {

    let styles = {
      root : {
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
      },
      wrapper: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: '20px'
      }
    }

    return (
      <div style={styles.root}>

        <div style={styles.wrapper}>
          <StartPaidDownloadingField torrentTableRowStore={this.state.startPaidDownloadTorrentTableRowStore}/>
        </div>

        <div style={styles.wrapper}>
          <StartPaidDownloadingField torrentTableRowStore={this.state.outOfMoneyStartPaidDownloadTorrentTableRowStore}/>
        </div>

        <div style={styles.wrapper}>
          <StartPaidDownloadingField torrentTableRowStore={this.state.optimisingRowStore}/>
        </div>

      </div>
    )
  }
}


export default IsolatedComponents