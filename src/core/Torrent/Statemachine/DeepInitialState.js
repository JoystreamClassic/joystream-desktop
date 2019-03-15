/**
 * Created by bedeho on 12/08/17.
 */

var DeepInitialState = {
    UPLOADING : {
        STARTED : 1,
        STOPPED : 2,
    },
    PASSIVE : 3,
    DOWNLOADING : {
        UNPAID : {
            STARTED : 4,
            STOPPED : 5,
        }
        /**
         PAID : {
          STARTED : 6,
          STOPPED : 7,
        }
         **/
    }
}


function deepInitialStateFromActiveState(stateString) {

  // NB: Do recursive version later, when we figure out how
  // do to proper navigation

  var states = stateString.split('.')

  if(states.length < 2)
    throw Error('Invalid state string supplied.')
  if(states[0] !== 'Active')
    throw Error('Not in an active state')
  else {

    if (states[1] == 'DownloadIncomplete') {

      if (states[2] == "Unpaid") {

        if (states[3] == "Started")
          return DeepInitialState.DOWNLOADING.UNPAID.STARTED
        else if (states[3] == "Stopped")
          return DeepInitialState.DOWNLOADING.UNPAID.STOPPED
        else
          throw Error('Invalid state: ' + states[3])

      } else if (states[2] == "Paid") {

        /**
         * If we are paying, we will just go to unpaid
         * started mode. Starting in paid mode is not allowed.
         */

        return DeepInitialState.DOWNLOADING.UNPAID.STARTED

      }
      else
        throw Error('Invalid state: ' + states[2])

    } else if (states[1] == "FinishedDownloading") {

      if (states[2] == "Passive")
        return DeepInitialState.PASSIVE
      else if (states[2] == "Uploading") {

        if (states[3] == "Started")
          return DeepInitialState.UPLOADING.STARTED
        else if (states[3] == "Stopped")
          return DeepInitialState.UPLOADING.STOPPED
        else
          throw Error('Invalid state: ' + states[3])

      } else
        throw Error('Invalid state: ' + states[2])

    } else
      throw Error('Invalid state: ' + states[1])
  }

}

function isUploading(s) {
  return s == DeepInitialState.UPLOADING.STARTED ||
    s == DeepInitialState.UPLOADING.STOPPED

}

function isPassive(s) {
  return s == DeepInitialState.PASSIVE
}

function isDownloading(s) {
  return s == DeepInitialState.DOWNLOADING.UNPAID.STARTED ||
    s == DeepInitialState.DOWNLOADING.UNPAID.STOPPED
}

function isStopped(s) {

  return s == DeepInitialState.UPLOADING.STOPPED ||
    s == DeepInitialState.DOWNLOADING.UNPAID.STOPPED
}

export default DeepInitialState
export {
  deepInitialStateFromActiveState,
  isUploading,
  isPassive,
  isDownloading,
  isStopped,
}
