/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')
var Started = require('./Started')
var Common = require('../../../Common')

var Unpaid = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started : {

            _child : Started
        },

        Stopped : {

            start : function (client) {

              client._joystreamNodeTorrent.handle.resume()

              Common.startExtension(client)

              this.go(client, 'Started/ReadyForStartPaidDownloadAttempt')
            }

        }

    }
})

module.exports = Unpaid
