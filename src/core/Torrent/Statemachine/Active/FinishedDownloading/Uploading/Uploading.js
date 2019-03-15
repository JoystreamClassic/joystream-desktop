/**
 * Created by bedeho on 26/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')
var Common = require('../../../Common')

var Uploading = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Started: {

            /**
            _onEnter: function (client) {
                client.store.setSellerPrice(client.sellerTerms)
            },
            */

            stop: function (client) {

              Common.stopExtension(client)

              // Stop libtorrent torrent
              client._joystreamNodeTorrent.handle.pause()

              this.transition(client, 'Stopped')
            },

            updateSellerTerms: function(client, sellerTerms) {

              // We dont allow user to just update seller terms currently

              throw Error('not yet supported')
            },

            processSellerTermsUpdated: function (client, terms) {

              // Since `updateSellerTerms` is not implemented, this should never happen

              throw Error('not yet supported')
            },

            processValidPaymentReceived: function (client, alert) {
              client._handleValidPaymentReceivedAlert(alert)
            },

            goToPassive: function(client) {

                Common.toObserveMode(client)

                this.go(client, '../Passive')
            }
        },

        Stopped: {

            start: function (client) {

              client._joystreamNodeTorrent.handle.resume()

              Common.startExtension(client)

              this.transition(client, 'Started')
            },

            goToPassive: function (client) {

                client._joystreamNodeTorrent.handle.resume()

                Common.startExtension(client)

                Common.toObserveMode(client)

                this.go(client, '../Passive')
            }
        }
    }

})

module.exports = Uploading
