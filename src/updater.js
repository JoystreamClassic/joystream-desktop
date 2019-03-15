const electron = require('electron')
const {BrowserWindow, ipcMain} = electron
const path = require('path')
const url = require('url')
const request = require('request')
const assert = require('assert')
const notifier = require('node-notifier')
const constants = require('./constants')
const defaultAppDirectory = require('./defaultAppDirectory')

/**
 * Terminology:
 *
 * An auto updater check cycle refers to the entire process of
 * checking with the server about a new check and interacting with the
 * user about the possibility of doing an update and download based on the
 * result.
 *
 * Approach:
 * We wished to offer the user the option to skip updates if they wish, while the
 * Electron auto updater framework apparently chooses to automatically
 * download updates if a valid one is found. As a result, we have to make a manual
 * call to the endpoint to figure out if an update is available, and then only invoke
 * the actual download through the Electron Auto update mechanism when the user has decided affirmatively.
 */

const APP_VERSION = require('../package.json').version
const AUTO_UPDATE_FEED_URL = constants.AUTO_UPDATE_BASE_URL + process.platform + '/' + APP_VERSION

/**
 * Instance of browser window for an auto update check.
 *
 * NB: Is created and destroyed for each attempt at doing a check,
 * and the value of this variable is the state indicator for whether
 * a check is currently going on.
 * @type {BrowserWindow}
 */
let updaterWindow = null

/**
 * The release name for the release name found on the server.
 *
 * Is only set after response from server.
 * @type {null|String}
 */
let releaseNameOfCurrentUpdateCheck = null

/**
 * ID for interval timer used to regularly check for updates on the server.
 *
 * This should always be set between calls to `startPeriodicAutoUpdateCheckCycle`
 * and `stopPeriodicAutoUpdateCheckCycle`.
 */
let updateCheckerIntervalID = null

/**
 * Application ID last announced on the server as a viable update, yet
 * ignored by the user.
 *
 * We hold on to this in order to avoid asking the user multiple times about
 * the same update. Since this is not persisted, it means the user
 * will be prompted again every time the application starts. Also, if an even
 * newer update is announced, the user will be prompted about an update for that
 * one time.
 */
let releaseNameOfLastUpdateIgnoredByUser = null

function startPeriodicAutoUpdateCheckCycle(showWindowOnCreation = false) {

  console.log('Starting periodic auto update checks')

  if(updateCheckerIntervalID)
    throw Error('Regular checking is already active')

  updateCheckerIntervalID = setInterval(startSingleAutoUpdateCheck, constants.AUTO_UPDATE_CHECK_INTERVAL)

  // Make first call right away
  startSingleAutoUpdateCheck(showWindowOnCreation)

}

function stopPeriodicAutoUpdateCheckCycle () {

  if(!updateCheckerIntervalID)
    throw Error('Regular checking is already active')

  clearInterval(updateCheckerIntervalID)
  updateCheckerIntervalID = null

  if (updaterWindow) {
    updaterWindow.webContents.send('auto-updater-channel', 'quit')
  }
}

function startSingleAutoUpdateCheck(showWindowOnCreation) {

  console.log('Starting auto update check cycle.')

  // Skip this check if a prior check has not been completed
  if(updaterWindow) {
    return
  }

  // Create the updater browser window.
  updaterWindow = new BrowserWindow({
    width: 466,
    height: 353,
    fullscreen: false,
    resizable: false,
    frame: false,
    show: false
  })

  updaterWindow.webContents.once('did-finish-load', () => {

    checkForUpdate((err, updateAvailable, releaseName) => {
      handleUpdateCheckResult(err, updateAvailable, releaseName)
    })

  })

  updaterWindow.once('closed', stopSingleAutoUpdateCheck)

  updaterWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'updater-window', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  if (showWindowOnCreation)
    updaterWindow.show()
}

function stopSingleAutoUpdateCheck() {

  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  updaterWindow = null
  releaseNameOfCurrentUpdateCheck = null

}

ipcMain.on('auto-updater-channel', (event, command) => {

  assert(updaterWindow)

  if (command === 'download-update') {
    downloadUpdate()
  } else if (command === 'install') {
    electron.autoUpdater.quitAndInstall()
  } else if (command === 'user-skipped-update') {

    assert(releaseNameOfCurrentUpdateCheck)

    // Update the most recently ignored release name
    releaseNameOfLastUpdateIgnoredByUser = releaseNameOfCurrentUpdateCheck
  }
})

function handleUpdateCheckResult(err, updateAvailable, releaseName) {

  // If the user manually closed the window, we just abandon any further
  // handling in this check
  if(!updaterWindow)
    return

  if (err) {
    updaterWindow.close()
  } else {
    if (updateAvailable) {

      if(releaseNameOfLastUpdateIgnoredByUser === releaseName) {
        console.log('Ignoring update to ' + releaseName + ', user has already skipped it this session.')
        updaterWindow.close()
        return
      }

      // There should be no current release name, we are learning about it
      // now, and it should have been cleared from any completed prior runs by `close` event
      // of handler of update window
      assert(!releaseNameOfCurrentUpdateCheck)

      // Hold on to current found release name
      releaseNameOfCurrentUpdateCheck = releaseName

      // Attract user's attention
      notifier.notify( {
        title: 'JoyStreamClassic Update',
        message: 'Update to ' + releaseName + ' from ' + APP_VERSION,

        icon: path.join(defaultAppDirectory(), 'icon.png'), // Absolute path (doesn't work on balloons)
        sound: true, // Only Notification Center or Windows Toasters
        //wait: true // Wait with callback, until user action is taken against notification
      },
      function(err, response) {
        // Response is response from notification
      })

      // Force show the updater window
      updaterWindow.focus()
      updaterWindow.show()

      updaterWindow.webContents.send('auto-updater-channel', 'update-available', {
        appVersion: APP_VERSION,
        releaseName: releaseName
      })

    } else {
      updaterWindow.close()
    }
  }
}

function checkForUpdate (callback) {
  request({url: AUTO_UPDATE_FEED_URL}, function (err, response, body) {
    if (err) {
      return callback(err)
    }

    if (response.statusCode === 200) {
      try {
        var updateInfo = JSON.parse(body)
      } catch (e) {
        return callback(new Error('failed to parse response body from server'))
      }
      callback(null, true, updateInfo.name)
    } else {
      callback(null, false)
    }
  })
}

function downloadUpdate () {
  // Electron autoUpdater checks for update and automatically downloads update if available
  // it doesn't give user a choice
  electron.autoUpdater.setFeedURL(AUTO_UPDATE_FEED_URL)
  electron.autoUpdater.checkForUpdates()
}

electron.autoUpdater.on('error', (err) => {
  if (updaterWindow) {
    if (updaterWindow.isVisible()) updaterWindow.show()
    updaterWindow.webContents.send('auto-updater-channel', 'error', err.message)
  }
})

electron.autoUpdater.on('update-available', () => {
  if (updaterWindow) {
    if (updaterWindow.isVisible()) updaterWindow.show()
    updaterWindow.webContents.send('auto-updater-channel', 'downloading')
  }
})

electron.autoUpdater.on('update-not-available', () => {

  // If there is inconsistency in how we check for updates and how electron.autoUpdater is checking we
  // will get this event, because we only ask electron.autoUpdater to check for updates if we detect
  // and update is available in our custom code checkForUpdates()

  assert(false)
})

electron.autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  if (updaterWindow) {
    updaterWindow.show()
    updaterWindow.webContents.send('auto-updater-channel', 'downloaded', event, releaseNotes, releaseName)
  }
})

module.exports = {
  startPeriodicAutoUpdateCheckCycle,
  stopPeriodicAutoUpdateCheckCycle
}
