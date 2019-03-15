/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../../BaseMachine')
var Paid = require('./Paid')
var Unpaid = require('./Unpaid')

var Downloading = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized : {},
        Paid : {
            _child : Paid
        },

        Unpaid : {
            _child : Unpaid
        }
    }

})

module.exports = Downloading