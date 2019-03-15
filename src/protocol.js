const { protocol } = require('electron')

/**
 * Register the protocol handlers.
 **/
function init () {
  console.log('Init protocol !!')

  /**
  * Instruction when a protocol called the application.
  * NOTE: So we can do something like 'joystream://<info_hash>'
  */
  protocol.registerStringProtocol('joystreamclassic', protocolCallback, protocolError)
}

function protocolCallback (request, callback) {
  console.log(request)

  callback({data: request.url})
}

function protocolError (error) {
  if (error) console.error('Failed to register protocol')
}

export { init }
