/**
 * Created by bedeho on 21/07/17.
 */

var TorrentState = require('joystream-node').TorrentState


function MockTorrentStatus(fixture) {
    this._fixture = fixture
    if (fixture) {
      this.state = fixture.isFullyDownloaded ? TorrentState.seeding : TorrentState.downloading
    }
}

module.exports = MockTorrentStatus
