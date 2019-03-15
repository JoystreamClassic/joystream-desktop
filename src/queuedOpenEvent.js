import {app} from 'electron'

// global variable accessed from renderer application through 'remote' object
// like so:   require('electron').remote.getGlobal('queuedOpenEvent')
global.queuedOpenEvent = null

function queueEvent (event) {
  global.queuedOpenEvent = event
}

app.on('open-file', function (event, filePathString) {
  queueEvent({
    type: 'file',
    uri: filePathString
  })
})

app.on('open-url', function (event, urlString) {
  queueEvent({
    type: 'url',
    uri: urlString
  })
})
