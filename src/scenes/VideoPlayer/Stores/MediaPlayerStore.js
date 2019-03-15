/**
 * Created by bedeho on 18/10/2017.
 */

import {observable, action, runInAction, computed} from 'mobx'

/**
 * Video state: WIP!!

 See: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events


const VIDEO_PLAYER_STATE = {

    idle: 0,

    // event loadstart
    // The loadstart event occurs when the browser starts looking
    // for the specified audio/video. This is when the loading process starts.

    determining_duration : 0,

    // event durationchange
    // The durationchange event occurs when the duration data of
    // the specified audio/video is changed.
    // NOTE: When an audio/video is loaded, the duration will change
    // from "NaN" to the actual duration of the audio/video.

    loading_metadata : 0,

    // event loadedmetadata
    // The loadedmetadata event occurs when meta data for the
    // specified audio/video has been loaded.
    // Meta data for audio/video consists of: duration, dimensions
    // (video only) and text tracks.

    loading_data : 0,

    // event loadeddata
    // The loadeddata event occurs when data for the current frame is loaded,
    // but not enough data to play next frame of the specified audio/video.

    progressing_towards_playability : 0,

    // event canplay
    // The canplay event occurs when the browser can start playing
    // the specified audio/video (when it has buffered enough to begin) ==>

    can_play : 0,

    // event canplaythrough
    // The canplaythrough event occurs when the browser estimates it can
    // play through the specified audio/video without having to stop for buffering ==>

    can_play_through: 0,

    playing: 0, // * (paused, playing, ended)

    seeking: 0,

    ended : 0,

    error: 0
}

 */


class MediaPlayerStore {

    /**
     * {String}
     */
    @observable mostRecentEventName

    /**
     * {Bool} Whether the video is actually playing or not,
     * regardless of whether this is caused by data availability
     * status or user actions.
     */
    //@observable videoIsPlaying

    /**
     * {Bool}
     */
    @observable showTorrentStreamProgress

    /**
     * {Number} Seconds of time which is available for playback
     */
    @observable playbackTimeAvailable

    /**
     * {Bool} Whether to automatically play media
     */
    autoPlay

    /**
     * Constructor
     * @param torrent
     * @param fileIndex
     * @param loadedTimeRequiredForPlayback {Number} - seconds of media data required before playback is allowed
     */
    constructor(torrentStore,
                streamUrl,
                loadedTimeRequiredForPlayback,
                autoPlay,
                mediaPlayerWindowSizeFetcher,
                mediaPlayerWindowSizeUpdater,
                onExit,
                uiStore) {

        this.torrent = torrentStore
        this.streamUrl = streamUrl
        this._loadedTimeRequiredForPlayback = loadedTimeRequiredForPlayback
        this.autoPlay = autoPlay

        // Hold on to callbacks to static resources
        this._mediaPlayerWindowSizeFetcher = mediaPlayerWindowSizeFetcher
        this._mediaPlayerWindowSizeUpdater = mediaPlayerWindowSizeUpdater
        this._onExit = onExit

        //this.setVideoIsPlaying(false)

        // Size of the window prior to resize,
        // we must keep track of this in order to adjust
        // size back
        this._windowSizePriorToResize = null

        this._uiStore = uiStore

    }

    @action.bound
    setMostRecentEventName(name) {
        this.mostRecentEventName = name

        // Logging for debugging purposes!
        console.log(name)
    }

    @action.bound
    setPlaybackTimeAvailable(playbackTimeAvailable) {
        this.playbackTimeAvailable = playbackTimeAvailable
    }
/**
    @action.bound
    setVideoIsPlaying(videoIsPlaying) {
        this.videoIsPlaying = videoIsPlaying
    }
*/

    @action.bound
    setShowTorrentStreamProgress(showTorrentStreamProgress) {
        this.showTorrentStreamProgress = showTorrentStreamProgress
    }

    /**
     * Below are the event handlers from the video player
     * component.
     */

    @action.bound
    durationChanged(e) {
        this.setMostRecentEventName('durationChanged')
    }

    @action.bound
    metadataLoaded(event) {
        this.setMostRecentEventName('metadataLoaded')

        // Hold on to this original window size
        this._windowSizePriorToResize = this._mediaPlayerWindowSizeFetcher()

        // Adjust window size to match media dimensions
        this._mediaPlayerWindowSizeUpdater({width: event.target.videoWidth, height: event.target.videoHeight})
    }

    @action.bound
    loadedData(e) {
        this.setMostRecentEventName('loadedData')
    }

    @action.bound
    progress(videoDOMElement) {

        this.setMostRecentEventName('progress')

        return

        if(!this.torrent.isDownloading)
            return

        let currentTime = videoDOMElement.currentTime
        let timeRanges = videoDOMElement.buffered

        let matchingTimeRange = playbackTimeAvailable(currentTime, timeRanges)

        if(matchingTimeRange !== null) { // <== not sure if this is evne possible, read HTML video tag standard

            let timeAvailable = timeRanges.end(matchingTimeRange) - currentTime

            this.setPlaybackTimeAvailable(timeAvailable)

            if(timeAvailable > this._loadedTimeRequiredForPlayback && videoDOMElement.paused)
                videoDOMElement.play()
        }
    }

    @action.bound
    isWaiting() {
        this.setMostRecentEventName('waiting')

        // When video stops because it needs to buffer the next frame, this generally happens
        // when we don't have a complete torrent.
        // We will only ever show the stream progress if we have an incomplete download.
        // If we have a complete download and this event occurs users may be confused to see
        // The stream progress bar, and possibly a start paid download button.
        if (this.torrent.isDownloading) {
          this.setShowTorrentStreamProgress(true)
        }
    }

    @action.bound
    play(videoDOMElement) {

        this.setMostRecentEventName('play')

        return

        if(!this.torrent.isDownloading)
            return

        if(this.playbackTimeAvailable < this._loadedTimeRequiredForPlayback)
            videoDOMElement.pause()
    }

    @action.bound
    isPlaying() {
        this.setMostRecentEventName('playing')

        this.setShowTorrentStreamProgress(false)
    }

    @action.bound
    canPlay(e) {

        this.setMostRecentEventName('canPlay')
    }

    @action.bound
    canPlayThrough(e) {
        this.setMostRecentEventName('canPlayThrough')
    }

    @action.bound
    errorOccured(videoDOMElement) {

        console.log('Error occured: ' + videoDOMElement.error.message)

    }

    @action.bound
    exit() {

        // Adjust window size back to old dimensions, if it has been resized
        if(this._windowSizePriorToResize)
            this._mediaPlayerWindowSizeUpdater({width: this._windowSizePriorToResize.width, height: this._windowSizePriorToResize.height})

        // Infrom UI we are exiting
        this._onExit()
    }

    @computed get
    torrentStreamProgress() {

        if(!this.torrent.isDownloading)
            return null
        else if(this.playbackTimeAvailable)
            return this.playbackTimeAvailable > this._loadedTimeRequiredForPlayback ? 1 : this.playbackTimeAvailable / this._loadedTimeRequiredForPlayback
        else
            return 0
    }

    @computed get
    viabilityOfPaidDownloadingTorrent() {
      return this._uiStore.torrentsViabilityOfPaidDownloading.get(this.torrent.infoHash)
    }
}

function playbackTimeAvailable(currentTime, timeRanges) {

    // Find matching time range
    for(var i = 0; i < timeRanges.length;i++) {

        // If its a match, then return this range index
        if(currentTime > timeRanges.start(i) && currentTime < timeRanges.end(i))
            return i
    }

    return null
}

module.exports = MediaPlayerStore
