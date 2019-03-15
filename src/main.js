// babel-polyfill for generator (async/await)
import 'babel-polyfill'

const {app, BrowserWindow, ipcMain, crashReporter, Menu} = require('electron')
const path = require('path')
const url = require('url')
const isDev = require('electron-is-dev')
const updater = require('./updater')
const protocol = require('./protocol')
const assert = require('assert')
const Migration = require('./migration')

import {createTemplate} from './menu'
import {enableLiveReload} from 'electron-compile'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null

// Prevent main window from being created by 'activate' event
// Will be set to true after migration tasks are completed
let preventMainWindowCreationOnActivate = true

/**
 * Controls whether auto updating will run (periodically).
 *
 * Will do so long as we are not on linux, and are either
 * in production, or environment variable `AUTO_UPDATE`
 * has been set (effectivel as a means to run it in dev mode also)
 */
let runPeriodicAutoUpdateChecking = (process.platform !== 'linux') && (!isDev || process.env.AUTO_UPDATE)

function showMainWindow () {
  if (win == null) return

  // delay for bug: https://github.com/electron/electron/issues/4338
  setTimeout(function () {
    if (win.isMinimized()) win.restore()
    win.focus()
    win.show()
  }, 100)
}

// First thing to check for is if this is an instace of an update installation
// using the squirrel updater framework (Windows only)
if(require('./electron-squirrel-startup')) {
  // This is were we handle tasks relavent to install/update/removal of the application
  app.quit()

} else {
  main()
}

function main () {
  // capture and queue open-file and open-url events for MacOS
  // When application is ready it should check if a queued event is available to consume
  // The reason to queue the event is that the main window will not likely be ready in time to
  // handle earliest occurance of these events (when app being launching as a protocol handler)
  require('./queuedOpenEvent.js')

  /*
    This method makes your application a Single Instance Application -
    instead of allowing multiple instances of your app to run,
    this will ensure that only a single instance of your app is running.
    argv array of string (command line arguments of second instance)
    On macOS the system enforces single instance automatically when users
    try to open a second instance of your app in Finder,
    and the open-file and open-url events will be emitted for that.
    However when users start your app in command line the system's
    single instance mechanism will be bypassed and you have to use this method to ensure single instance.
  */
  const shouldQuit = app.makeSingleInstance(function (argv, workingDirectory) {
      // Someone tried to run a second instance, we should focus our window.
      showMainWindow()

      // Inform main application window of second instance and arguments
      // This is where Windows and Linux will get arguments when launched for being a protocol handler
      // As well as MacOS if being run from commandline (as opposed to from the finder by double clicking the app icon)
      if (win) {
        win.webContents.send('second-instance', 'argv', argv)
      }
  })

  if (shouldQuit) {
    app.quit()
    return
  }

  // Just open the window..
  app.on('open-file', showMainWindow)
  app.on('open-url', showMainWindow)

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', onAppReady)

  app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (win === null && !preventMainWindowCreationOnActivate) {
        createMainWindow()
      }
  })

  // Listen to broadcast channel from main window
  ipcMain.on('main-window-channel', (event, arg) => {

      if(arg === 'user-closed-app') {

          // Exit application

          if(runPeriodicAutoUpdateChecking) {
            updater.stopPeriodicAutoUpdateCheckCycle()
          }

          app.quit()
      }
  })

  // Listen if we need to modify window size to fit video or going back to
  // application size
  ipcMain.on('set-bounds', (event, arg) => {

      // verify if window exist and if we are not already in fullscreen
      if (win && !win.isFullScreen()) {

        // Set the new window size
        win.setContentSize(arg.width, arg.height, true) // animate on Mac
    }
  })

  // Listen if we need to block the save power feature to avooid the screen going
  // black in the middle of a video.
  ipcMain.on('power-save-blocker', (event, arg) => {
      const {enable, disable} = require('./power-save-blocker')

      if (arg.enable) {
        // Enable blocker
        enable()
      } else {
        // Disable blocker
        disable()
      }
  })

  // Not really usefull for now...
  // protocol.init() // throwing "TypeError: protocol.registerStringProtocol is not a function"

  if (isDev) {
    console.log('2xenableLiveReload')

    // Enable live reloading : Needs to happen prior to `new BrowserWindow`
    // https://github.com/electron/electron-compile/blob/master/README.md
    enableLiveReload({strategy: 'react-hmr'})
    enableLiveReload({strategy: 'react-hmr'})

  } else {
    crashReporter.start({
      productName: "",
      companyName: "",
      submitURL: "",
      uploadToServer: true
    })

  }
}

function onAppReady () {
  function launchMainWindow () {
    preventMainWindowCreationOnActivate = false
    createMainWindow()
  }

  if (!isDev) {
    // Do migrations ... before opening main window
    let migration = Migration.runMigrationTasks()

    migration.then(function () {
      launchMainWindow()
    })

    migration.catch(function (err) {
      require('electron').dialog.showErrorBox(
        'JoyStream - Error',
        'Error encountered while migrating the application data to a new version. More Info: ' + err.message)
      process.exit(-1)
    })
  } else {
    launchMainWindow()
  }
}

function createMainWindow (runAutoUpdaterInNonDevMode = true) {

  assert(win === null)

  // Create the browser window.
  win = new BrowserWindow({
      width: 1280,
      height: 800,
      minHeight: 700,
      minWidth: 1280,
      frame: true,
      backgroundColor: '#1C262B', // same as rgb(28, 38, 43)
      show : true
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  var template = createTemplate(win)

  // Set Menu application from menu.js
  // Need to be created after win has been initialized
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  /**
  // Delay actually showing window until we are ready to show
  // https://github.com/electron/electron/blob/master/docs/api/browser-window.md#showing-window-gracefully
  win.once('ready-to-show', () => {
    win.show()
  })
  */

  if (isDev) {

    // Add Devtron to chrome dev tool
    // https://electron.atom.io/devtron/
    require('devtron').install()

    // Open the DevTools.
    win.webContents.openDevTools()

  }

  // Wait until main wondow is finished loading before we setup the updater code
  win.webContents.once("did-frame-finish-load", function (event) {

    if(runPeriodicAutoUpdateChecking) {
      updater.startPeriodicAutoUpdateCheckCycle()
    }

  })

  // Consider opening dev tools, even if we are not in dev mode
  if (process.env.OPEN_DEVTOOLS) {
    win.webContents.openDevTools()
  }

  // Load file for the app
  const filename_to_load = process.env.COMPONENT_DEVELOPMENT_MODE ? 'component-development/index.html' : 'index.html'

  win.loadURL(url.format({
    pathname: path.join(__dirname, filename_to_load),
    protocol: 'file:',
    slashes: true
  }))


}

/**
 * Component development app code
 */

let separateUpdateWindow = null

// Listen for async message from renderer process
ipcMain.on('component-development', (event, arg) => {

    if(arg === 'open-updater-window') {

        // Create the updater browser window.
        separateUpdateWindow = new BrowserWindow({
            width: 466,
            height: 353,
            fullscreen: false,
            resizable: false,
            frame: false,
            show: true
        })

        separateUpdateWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'component-development/Updater/window.html'),
            protocol: 'file:',
            slashes: true
        }))

    }

});
