import React, { Component } from 'react'
import {ScenarioContainer} from '../common'
import VideoPlayer, {TorrentStreamProgress} from '../../components/VideoPlayer'

var MediaPlayerStore = require('../../scenes/VideoPlayer/Stores/MediaPlayerStore')
var TorrentStore = require('../../core-stores/Torrent/TorrentStore').default

class StreamScenarios extends Component {

  constructor () {
    super()

    this.state = {
      videoPlayer: false,
      mediaPlayerStore : new MediaPlayerStore(
          new TorrentStore(
              null,
              null,
              null,
              null,
              'Active.DownloadIncomplete',
              null,
              null,
              1024*78,
              1024*3),
          {},
          10,
          false,
          () => { console.log('mediaPlayerWindowSizeFetcher')},
          () => { console.log('mediaPlayerWindowSizeUpdater')},
          () => { console.log('powerSavingBlocker')},
          () => { console.log('showDoorbellWidget')})
    }

  }

  handleClick (event) {
    event.preventDefault()

    this.setState({videoPlayer: true})
  }

  handleClose (event) {
    event.preventDefault()

    this.setState({videoPlayer: false})
  }

  render () {
    const blockStyle = {
      position: 'relative',
      width: '100%',
      height: '100%'
    }

    let styles = {
        streamProgressContainer : {
            marginTop : '20px',
            height : '600px',
            display : 'flex',
            alignItems : 'center',
            justifyContent : 'center',
            backgroundColor : 'black'
        }
    }

    return (
      <div>
          <ScenarioContainer title="Stream" subtitle="stream sintel video">
              <div style={blockStyle}>
                  <button onClick={this.handleClick.bind(this)}>Play</button>
                  {this.state.videoPlayer ? <VideoPlayer closeVideoPlayer={this.handleClose.bind(this)}/> : null}
              </div>
          </ScenarioContainer>

          <div style={styles.streamProgressContainer}>
              <TorrentStreamProgress mediaPlayerStore={this.state.mediaPlayerStore} />
          </div>
      </div>
    )
  }

}

export default StreamScenarios
