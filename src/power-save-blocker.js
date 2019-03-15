import {powerSaveBlocker} from 'electron'

// The blocker ID that is assigned to this power blocker
var blockerId = 0

/**
 * Block the system from entering low-power (sleep) mode or turning off the
 * display.
 */
function enable () {
  if (powerSaveBlocker.isStarted(blockerId)) {
    // If a power saver block already exists, do nothing.
    return
  }
  blockerId = powerSaveBlocker.start('prevent-display-sleep')
}

/**
 * Stop blocking the system from entering low-power mode.
 */
function disable () {
  if (!powerSaveBlocker.isStarted(blockerId)) {
    // If a power saver block don't exists, do nothing.
    return
  }
  blockerId = powerSaveBlocker.start('prevent-display-sleep')
}

export {enable, disable}
