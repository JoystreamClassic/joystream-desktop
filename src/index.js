
var debug = require('debug')('main-renderer')

var t0 = performance.now()
debug('Starting to load index.js after:' + t0)

import ReactDOM from "react-dom"
import IdleScene from './scenes/Idle'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

/**
 * Emergency rendering of loader interface!
 * This is done before any other loading is attempted,
 * as the rest of the loading below will depend on loading a while
 * tree of dependencies which is very slow to load.
 */

ReactDOM.render(
  <MuiThemeProvider>
    <IdleScene/>
  </MuiThemeProvider>
  ,
  document.getElementById('root')
)

// babel-polyfill for generator (async/await)
import 'babel-polyfill'

// Configure and Initialize bcoin network settings
// NB: this should be the earliest point where bcoin is imported
import config from './config'

import {ipcRenderer, webFrame, shell, remote} from 'electron'
import os from 'os'
import path from 'path'
import isDev from 'electron-is-dev'
import React from 'react'
import opn from 'opn'

import Application from './core/Application'

import { EXAMPLE_TORRENTS } from './constants'

import UIStore from './scenes'
import assert from 'assert'
import mkdirp from 'mkdirp'
import DefaultAppDirectory from './defaultAppDirectory'

/**
 * Some Components use react-tap-event-plugin to listen for touch events because onClick is not
 * fast enough This dependency is temporary and will eventually go away.
 * Until then, be sure to inject this plugin at the start of your application.
 *
 * NB:! Can only be called once per application lifecycle
 */
var injectTapEventPlugin = require('react-tap-event-plugin')
injectTapEventPlugin()

const getCoins = (address) => {
  const url = 'http://download.joystream.co:7200/?address=' + address.toString()
  opn(url).catch(() => {})
}

// Create app
const application = new Application(EXAMPLE_TORRENTS, process.env.FORCE_ONBOARDING, true, getCoins)

// Create model of view, with some reasonable defaults
const rootUIStore = new UIStore(application, process.env.FORCE_TERMS_SCREEN)

/// Hook into major state changes in app

application.on('started', () => {

  const isDefaultClient = remote.app.isDefaultProtocolClient('magnet')
  const defaultClientPreference = application.applicationSettings.defaultClientPreference()

  if(!isDev && remote.process.platform !== 'linux' && !isDefaultClient) {
    if (defaultClientPreference === 'not_set') {
      // On first install/update to new release supporting this application setting
      remote.app.setAsDefaultProtocolClient('magnet')
      // Next time ask
      application.applicationSettings.setDefaultClientPreference('ask')

    } else if (defaultClientPreference === 'force') {
      // If user wants to always force joystream to be the default client
      remote.app.setAsDefaultProtocolClient('magnet')

    } else if (defaultClientPreference === 'ask') {
        // prompt UI - should have three actions
        // (1."Yes", 2."Don't Ask Again", 3."Dismiss")
        // action yes --> remote.app.setAsDefaultProtocolClient(), then close dialog
        // action dont ask again -> set application setting to 'dont_ask', then close dialog
        // action dismiss -> just close dialog
    }
  }

  const openEvent = remote.getGlobal('queuedOpenEvent')

  if (openEvent) {
    application.handleOpenExternalTorrent(openEvent.uri, function (err, torrentName) {
      rootUIStore.openingExternalTorrentResult(err, torrentName)
    })
  }

  // Process command line arguments from main process
  handleCommandLineArgs(remote.process.argv)

  remote.app.on('open-file', function (event, filePath) {
    application.handleOpenExternalTorrent(filePath, function (err, torrentName) {
      rootUIStore.openingExternalTorrentResult(err, torrentName)
    })
  })

  remote.app.on('open-url', function (event, url) {
    application.handleOpenExternalTorrent(url, function (err, torrentName) {
      rootUIStore.openingExternalTorrentResult(err, torrentName)
    })
  })

  ipcRenderer.on('second-instance', function (event, eventName, argv) {
    if (eventName === 'argv') {
      handleCommandLineArgs(argv)
    }
  })

  // Process commandline arguments that were either passed to the main process when the first
  // instance of the app was launched, or when when the second instance was attempted to be run
  // (on OSX this only happens if the user run the app from the terminal)
  function handleCommandLineArgs (argv) {
    if (!argv || !argv.length) return

    // Ignore if there are too many arguments, only expect one
    // when app is launched as protocol handler. We can handle additional options in the future

    if (isDev && argv.length > 3) return  // app was launched as: electron index.js $uri
    if (!isDev && argv.length > 2) return // packaged app run as: joystream $uri

    var $uri = isDev ? argv[2] : argv[1]

    if ($uri) {
      // arg is either a magnetlink or a filepath
      application.handleOpenExternalTorrent($uri, function (err, torrentName) {
        rootUIStore.openingExternalTorrentResult(err, torrentName)
      })
    }
  }

})

application.on('stopped', () => {

  // Tell main process about the application being done
  ipcRenderer.send('main-window-channel', 'user-closed-app')
})

// Setup capture of window closing event
window.onbeforeunload = beforeWindowUnload

// Create renderer which is bound to our resources

let doHotModuleReload = isDev
let displayMobxDevTools = !!(process.env.MOBX_DEV && isDev)
let loadedRenderer = renderer.bind(null, doHotModuleReload, rootUIStore, document.getElementById('root'), displayMobxDevTools)

// We enable HMR only in development mode
if (doHotModuleReload) {

  if(!module.hot)
    console.log('Could not do HMR, because module.hot is not set')
  else
    module.hot.accept(loadedRenderer)
}

// Start rendering, only possible after start of core app
loadedRenderer()

// Actually start app

// If we are going to force onboarding, something which is mostly done while developing,
// then lets skip loading any existing torrents.
// However, be aware that any added torrents are persisted when shutting down
if(process.env.FORCE_ONBOARDING)
  config.skipLoadingExistingTorrents = true

const appDirectory = DefaultAppDirectory()

application.start(config, appDirectory)

/**
 * Renderer routine which is invoked repeatedly
 * by react HMR plugin.
 * @private
 */
function renderer(doHMR, rootUIStore, parentDOMNode, displayMobxDevTools) {

  // NB: We have to re-require Application every time, or else this won't work
  const ApplicationScene = require('./scenes/Application').default

  if (doHMR) {
    const AppContainer = require('react-hot-loader').AppContainer

    ReactDOM.render(
      <AppContainer>
        <ApplicationScene UIStore={rootUIStore} displayMobxDevTools={displayMobxDevTools}/>
      </AppContainer>
      ,
      parentDOMNode
    )
  } else {

    ReactDOM.render(
      <ApplicationScene UIStore={rootUIStore} displayMobxDevTools={displayMobxDevTools}/>
      ,
      parentDOMNode
    )
  }

}

/**
 * Handler for window.onBeforeUnload
 * @param e
 */
function beforeWindowUnload(e) {

  /**
   * NB: Notice that when this hooks into window.onbeforeunload,
   * it is called _both_ when user tries to close window, and
   * when main process says application.quit. We must handle both case.
   */

  if(application.state === Application.STATE.STARTING || application.state === Application.STATE.STOPPING) {

    /**
     * We prevent stopping of any kind while starting up, for now, and obviously when stopping!
     * In the future, we may allow user to cancel startup process, but this will require
     * changes to the application state machine to do safely.
     */

    // BLOCK SHUTDOWN
    e.returnValue = false

    debug('Blocking shutdown since application is still starting or stopping.')

  } else if(application.state === Application.STATE.STARTED) {

    rootUIStore.handleCloseApplicationAttempt()

    // BLOCK SHUTDOWN
    e.returnValue = false

    debug('Blocking shutdown and starting application shut down.')

  } else {

    /**
     * We are stopped (same as PHASE.NotStarted), so we will thus allow
     * closing of window, which we do by not doing anything.
     */

    assert(application.state === Application.STATE.STOPPED)

    debug('Allowing renderer|window to close.')
  }

}

/**
 * We only export the ui store object when in dev mode,
 * this is for safety reasons. The export allows
 * us to interrogate the object from the browser window
 * console.
 */
module.exports = rootUIStore
