/**
 * Created by bedeho on 15/06/17.
 */

var BaseMachine = require('../../../BaseMachine')
var DownloadIncomplete = require('./DownloadIncomplete')
var FinishedDownloading = require('./FinishedDownloading')
var Common = require('../Common')

var Active = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},

        DownloadIncomplete : {
            _child : DownloadIncomplete,

            downloadFinished : function (client) {

                Common.toObserveMode(client)

                this.go(client, 'FinishedDownloading/Passive')
            }
        },

        FinishedDownloading : {
            _child : FinishedDownloading,
        }
    }
})

module.exports = Active
