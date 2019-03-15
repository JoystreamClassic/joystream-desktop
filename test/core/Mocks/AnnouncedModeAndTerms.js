var MakeAnnouncedModeAndTerms = {

    None : function() {

        return {
            none: true
        }

    },
    Observe : function () {

        return {
            observer : true
        }

    },
    Sell : function (terms, index) {

        return {
            seller : {
                terms : terms,
                index : index
            }
        }

    },
    Buy : function (terms) {

        return {
            buyer : {
                terms : terms
            }
        }

    }
}

module.exports = MakeAnnouncedModeAndTerms
