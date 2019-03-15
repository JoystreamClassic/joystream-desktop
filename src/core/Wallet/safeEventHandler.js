const debugSafeEventHandler = require('debug')('safe-event-handler')

// Safe event handler which should be used to wrap event handlers for bcoin wallet
// and node events, to prevent unhandled exceptions from breaking bcoin behaviour
function safeEventHandlerShim (handler, eventName) {

  return function safeBcoinHandler (...args) {
    try {
      handler(...args)
    } catch (err) {
      debugSafeEventHandler('Unhandled exception caught in handler for event ' + eventName)
      debugSafeEventHandler(err)
    }
  }
}

module.exports = safeEventHandlerShim
