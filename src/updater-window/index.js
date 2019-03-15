import {ipcRenderer} from 'electron'

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

// React
import React from 'react'
import ReactDOM from 'react-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import UpdaterWindow from './components'
import UpdaterStore from './UpdaterStore.js'

var store = new UpdaterStore()

var blockClosingWindow = true

// Listen to events from the auto-updater running in the main process
ipcRenderer.on('auto-updater-channel', function (event, command, arg) {
  switch (command) {
    case 'checking-for-update':
      store.setState('checking')
      break
    case 'quit':
      blockClosingWindow = false
      break
    case 'update-available':
      store.setInstalledVersionString(arg.appVersion)
      store.setMostRecentVersion(arg.releaseName)
      store.setState('waiting-to-start-download')
      break
    case 'no-update-available':
      store.setState('no-update-available')
      break
    case 'error':
      // Error checking for update or downloading update
      store.setErrorMessage(arg)
      store.setState('error')
      break
    case 'downloaded':
      store.setState('waiting-to-start-install')
      break
  }
})

ReactDOM.render(
    <MuiThemeProvider>
      <UpdaterWindow store={store}
                     onUseOldVersionClicked={handleUseOldVersionClick}
                     onUpdateClicked={downloadUpdate}
                     onInstallClicked={quitAndInstall}
                     onErrorCloseClicked={handleErrorCloseClick}
      />
    </MuiThemeProvider>,
  document.getElementById('root'))

function downloadUpdate () {
  store.setState('downloading')
  ipcRenderer.send('auto-updater-channel', 'download-update')
}

function quitAndInstall () {
  store.setState('installing')
  ipcRenderer.send('auto-updater-channel', 'install')
}

function handleUseOldVersionClick() {

  ipcRenderer.send('auto-updater-channel', 'user-skipped-update')
  window.close()
}

function handleErrorCloseClick() {
  window.close()
}


// Prevent window closing while downloading an update unless main app is exiting
window.onbeforeunload = function (e) {
  if (store.state === 'downloading' && blockClosingWindow) {
    e.returnValue = false
  }
}
