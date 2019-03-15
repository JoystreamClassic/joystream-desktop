/**
 * Created by bedeho on 23/10/2017.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Provider, observer, inject } from 'mobx-react'

import {convenientBytes} from '../../common'

import LinearProgress from 'material-ui/LinearProgress'
import SvgIcon from 'material-ui/SvgIcon'
import StartPaidDownloadButton from './StartPaidDownloadButton'

const PointSvgIcon = (props) => {

    return (
        <SvgIcon viewBox='0 0 16 16' {...props}>
            <circle cx="8" cy="8" r="8" ></circle>
        </SvgIcon>
    )
}

const TorrentStreamProgress = observer((props) => {

    let backgroundColor = 'hsla(0, 0%, 10%, 1)'
    let softColor = 'hsla(180, 1%, 55%, 1)'
    let accentColor = 'white'
    let buttonBackgroundColor = 'hsla(240, 2%, 17%, 1)'
    let progressBarColor = 'rgba(92, 184, 92, 0.7)'

    let styles = {
        root :  {
            display : 'flex',
            flexDirection : 'column',
            backgroundColor : backgroundColor,
            alignItems: 'center',
            justifyContent: 'center',
            //width : '400px',
            opacity: '0.95',
            position: 'absolute',
            borderRadius : '5px',
            zIndex : '10',
            borderTop: '6px solid ' + accentColor,
            overflow: 'hidden'
        },
        progressContainer : {
            display : 'flex',
            flexDirection : 'column',
            alignItems: 'center',
            marginBottom : '30px',
            marginTop : '30px'
        },
        value : {
            color : accentColor,
            fontWeight : 'bold',
            paddingRight : '3px'
        },
        unit : {
            color : softColor
        },
        metricContainer : {
            display : 'flex',
            flexDirection : 'column',
            //paddingBottom: '16px', // disabled since we dont have
            fontSize : '40px'
        },
        playbackProgress : {
            fontSize : '12px',
            color : softColor,
            textTransform: 'uppercase'
        },
        pointContainer : {
            width: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        point : {
            height : '6px',
            width : '6px',
        },
        loader : {
            width : '250px',
            marginTop : '10px',
            //backgroundColor : softColor
        },
        buttonContainer : {
            display : 'flex',
            alignItems : 'center',
            justifyContent : 'center',
            backgroundColor : buttonBackgroundColor,
            padding: '20px',
            width: '100%'
        }
    }

    // Compute representation for speed and size
    let downloadSpeedRepresentation = convenientBytes(props.mediaPlayerStore.torrent.downloadSpeed)
    let downloadedSizeRepresentation = convenientBytes(props.mediaPlayerStore.torrent.downloadedSize)

    /**
     * Dropping size for now
     <div style={styles.pointContainer}>
     <PointSvgIcon style={styles.point}/>
     </div>
     */

    //console.log('torrentStreamProgress: ' + 100*props.mediaPlayerStore.torrentStreamProgress + '%')

    return (
        <div style={styles.root}>

            <div style={styles.progressContainer}>

                <span style={styles.playbackProgress}>
                    SPEED
                </span>

                <div style={styles.metricContainer}>

                    <div>
                        <span style={styles.value}>{downloadSpeedRepresentation.value}</span>
                        <span style={styles.unit}>{downloadSpeedRepresentation.unit ? downloadSpeedRepresentation.unit + '/s' : null}</span>
                    </div>

                </div>

                <span style={styles.playbackProgress}>
                    DOWNLOADED
                </span>

                <div style={styles.metricContainer}>

                    <div>
                        <span style={styles.value}>{downloadedSizeRepresentation.value}</span>
                        <span style={styles.unit}>{downloadedSizeRepresentation.unit ? downloadedSizeRepresentation.unit: null}</span>
                    </div>

                </div>

                { /**

                 <span style={styles.playbackProgress}>
                 Playback Starting
                 </span>

                 <LinearProgress mode="determinate"
                 value={100*props.mediaPlayerStore.torrentStreamProgress}
                 style={styles.loader}
                 color={progressBarColor}
                 />

                 */
                }

            </div>

            <div style={styles.buttonContainer}>
                <StartPaidDownloadButton torrent={props.mediaPlayerStore.torrent}
                       viabilityOfPaidDownloadingTorrent={props.mediaPlayerStore.viabilityOfPaidDownloadingTorrent} />
            </div>

        </div>
    )
})

TorrentStreamProgress.propTypes = {
    mediaPlayerStore : PropTypes.object.isRequired // MediaPlayerStore
}

export default TorrentStreamProgress
