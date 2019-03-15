/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')

var Paid = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started : {

            // When all paid peers left _before_
            // we completed the download
            allSellersGone : function(client) {
                this.go(client, '../Unpaid/Started/ReadyForStartPaidDownloadAttempt')
            },

            /**
            stop: function(client) {
                client.stopExtension()

                client._joystreamNodeTorrent.handle.pause()

                this.transition(client, 'Stopped')
            }
            */

        },

        /**
        Stopped : {

            start : function (client) {
                client._joystreamNodeTorrent.handle.resume()
                Common.startExtension(client)
                this.transition(client, 'Started')
            }

        }
        */
    }
})

module.exports = Paid
