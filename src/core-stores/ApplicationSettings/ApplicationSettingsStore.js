/**
 * Created by bedeho on 24/03/2018.
 */
import { observable, action, computed } from 'mobx'

class ApplicationSettingsStore {

  @observable state

  @observable downloadFolder

  @observable bittorrentPort

  constructor(state, downloadFolder, bitTorrentPort) {
    this.setState(state)
    this.setDownloadFolder(downloadFolder)
    this.setBitTorrentPort(bitTorrentPort)
  }

  @action.bound
  setState(state) {
    this.state = state
  }

  @action.bound
  setDownloadFolder(downloadFolder) {
    this.downloadFolder = downloadFolder
  }

  @action.bound
  setBitTorrentPort(bitTorrentPort) {
    this.bittorrentPort = bitTorrentPort
  }

}

export default ApplicationSettingsStore