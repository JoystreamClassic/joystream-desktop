import MediaPlayerStore from '../../../src/scenes/VideoPlayer/Stores/MediaPlayerStore'

var assert = require('chai').assert
var sinon = require('sinon')

const createInitialValues = () => {
  return [
    1, // torrent,
    2, // streamUrl,
    3, // loadedTimeRequiredForPlayback,
    4, // autoPlay,
    sinon.spy(), // mediaPlayerWindowSizeFetcher,
    sinon.spy(), // mediaPlayerWindowSizeUpdater,
    sinon.spy(), // powerSavingBlocker,
    sinon.spy(), // showDoorbellWidget
  ]
}

describe('MediaPlayerStore', function () {
  let mediaPlayerStore, initialValues

  beforeEach(function () {
    initialValues = createInitialValues()
    mediaPlayerStore = new MediaPlayerStore(...initialValues)
  })

  it('constructor', function () {
    assert.equal(mediaPlayerStore.torrent, initialValues[0])
    assert.equal(mediaPlayerStore.streamUrl, initialValues[1]) // should this be an @observable
    assert.equal(mediaPlayerStore.autoPlay, initialValues[3])
  })

})
