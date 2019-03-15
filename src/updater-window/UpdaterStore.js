import {observable, action, runInAction, computed} from 'mobx'

/**
 * This store is very thin, almost pointless, all the relevant actions
 * need to be moved in here later, and some liason mechanism connecting them
 * with main process through IPC.
 */
class UpdaterStore {
  @observable state
  @observable errorMessage
  @observable mostRecentVersion
  @observable installedVersionString

  @action.bound
  setState (state) {
    this.state = state
  }

  @action.bound
  setErrorMessage (message) {
    this.errorMessage = message
  }

  @action.bound
  setMostRecentVersion(mostRecentVersion) {
    this.mostRecentVersion = mostRecentVersion
  }

  @action.bound
  setInstalledVersionString(installedVersionString) {
    this.installedVersionString = installedVersionString
  }
}

export default UpdaterStore
