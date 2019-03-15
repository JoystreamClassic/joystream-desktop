/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../../BaseMachine')
var Uploading = require('./Uploading')
var Common = require('../../Common')

var FinishedDownloading = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        Passive : {

            goToStartedUploading : function (client, sellerTerms) {

                Common.toSellMode(client, sellerTerms)

                client._setSellerTerms(sellerTerms)

                this.go(client, 'Uploading/Started')
            }

        },

        Uploading : {
            _child : Uploading
        }

    }
})

module.exports = FinishedDownloading
