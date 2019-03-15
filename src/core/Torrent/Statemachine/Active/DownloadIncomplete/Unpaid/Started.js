/**
 * Created by bedeho on 30/06/17.
 */

var BaseMachine = require('../../../../../BaseMachine')
var Common = require('../../../Common')
var ConnectionInnerState = require('joystream-node').ConnectionInnerState
var commitmentToOutput = require('joystream-node').paymentChannel.commitmentToOutput

var ViabilityOfPaidDownloadInSwarm = require('../../../../ViabilityOfPaidDownloadingSwarm').default

var debug = require('debug')('TorrentStateMachine')

var Started = new BaseMachine({

    initialState: "Uninitialized",

    states: {

        Uninitialized: {},

        ReadyForStartPaidDownloadAttempt : {

            _onEnter : function(client) {

              // We reset swarmViability,since
              // we have not been handling `processPeerPluginsStatuses`
              // by calling `computeViabilityOfPaidDownloadInSwarm` in an any other state.
              let defaultViability = new ViabilityOfPaidDownloadInSwarm.NoJoyStreamPeerConnections()

              client._setViabilityOfPaidDownloadInSwarm(defaultViability)

            },

            stop : function(client) {

              Common.stopExtension(client)

              // Stop libtorrent torrent
              client._joystreamNodeTorrent.handle.pause()

              this.go(client, '../Stopped')
            },

            updateBuyerTerms : function (client, buyerTerms) {

              // Not yet implemented

              throw Error('Not yet implemented')
            },

            processBuyerTermsUpdated: function (client, terms) {

              // Not possible, since above not yet implemented

              throw Error('Not yet implemented')
            },

            processPeerPluginStatuses: function(client, statuses) {

              // Update peer list
              Common.processPeerPluginStatuses(client, statuses)

              // Figure out if there are suitable sellers in sufficient amount
              let viability = computeViabilityOfPaidDownloadInSwarm(statuses, client.buyerTerms.minNumberOfSellers, client.torrentInfo.numPieces())

              // Hold on to viability for later
              client._setViabilityOfPaidDownloadInSwarm(viability)
            },

            startPaidDownload : function (client, fn) {

              // Check that we can actually start
              if(!(client.viabilityOfPaidDownloadInSwarm.constructor.name === 'Viable')) {
                  return fn(client.viabilityOfPaidDownloadInSwarm , null)
              }

              debug('picking from sellers:', client.viabilityOfPaidDownloadInSwarm.suitableAndJoined)

              // Pick sellers to use
              var pickedSellers = pickSellers(client.viabilityOfPaidDownloadInSwarm.suitableAndJoined, client.buyerTerms.minNumberOfSellers)

              debug('selected:', pickedSellers)

              // Iterate sellers to
              // 1) Allocate value
              // 2) Find correct contract fee
              // 3) Construct contract output
              var downloadInfoMap = new Map()
              var contractOutputs = []
              var contractFeeRate = 0
              var index = 0

              for (var i in pickedSellers) {

                  var status = pickedSellers[i]

                  var sellerTerms = status.connection.announcedModeAndTermsFromPeer.seller.terms

                  // Pick how much to distribute among the sellers
                  var minimumRevenue = sellerTerms.minPrice * client.torrentInfo.numPieces()

                  // Set value to at least surpass dust
                  const DUST = 600
                  var value = minimumRevenue + DUST

                  // Update fee estimate
                  if(sellerTerms.minContractFeePerKb > contractFeeRate)
                      contractFeeRate = sellerTerms.minContractFeePerKb

                  // Generate keys for buyer side of contract
                  var buyerContractSk = client._privateKeyGenerator()
                  var buyerFinalPkHash = client._publicKeyHashGenerator()

                  // Add entry for seller in download information map
                  downloadInfoMap.set(status.pid, {
                      index: index,
                      value: value,
                      sellerTerms: sellerTerms,
                      buyerContractSk: Buffer.from(buyerContractSk),
                      buyerFinalPkHash: Buffer.from(buyerFinalPkHash)
                  })

                  // Add contract output for seller
                  contractOutputs[index] = commitmentToOutput({
                      value: value,
                      locktime: sellerTerms.minLock, //in time units (multiples of 512s)
                      payorSk: Buffer.from(buyerContractSk),
                      payeePk: Buffer.from(status.connection.payor.sellerContractPk)
                  })

                  index++
              }

              // Store download information for making actual start downloading
              // request to client later after signing
              client.downloadInfoMap = downloadInfoMap

              // Request construction and financing of the contract transaction
              client._contractGenerator(contractOutputs, contractFeeRate)
                .then((tx) => {
                  console.log('signing contract success')
                  client._submitInput('makeSignedContractResult', null, tx)
                })
                .catch((err) => {
                  console.log('signing contract failed', err)
                  client._submitInput('makeSignedContractResult', err)
                })

              // Hold on to user callback until lifecycle of call is completed
              client._startPaidDownloadFn = fn

              this.transition(client, 'SigningContract')
            }

        },

        SigningContract : {

            // NB: We don't handle input `processPeerPluginsStatuses`

            makeSignedContractResult(client, err, tx) {

                if(err) {

                    // Tell user about failure
                    client._startPaidDownloadFn(err)

                    // Drop callback
                    delete client._startPaidDownloadFn

                    this.transition(client, 'ReadyForStartPaidDownloadAttempt')

                } else {

                    client._joystreamNodeTorrent.startDownloading(tx, client.downloadInfoMap, (err, res) => {
                      client._submitInput('paidDownloadInitiationCompleted', err, res)
                    })

                    this.transition(client, 'InitiatingPaidDownload')

                }

            }

        },

        InitiatingPaidDownload : {

            // NB: We don't handleSequence peer plugin statuses

            paidDownloadInitiationCompleted : function (client, err, result) {

              // NB: Joystream alert never throw error. Need to be added in extension-cpp
                if (err) {

                    // Tell user about failure
                    client._startPaidDownloadFn(err)

                    this.transition(client, 'ReadyForStartPaidDownloadAttempt')

                } else {

                    // Tell user about success
                    client._startPaidDownloadFn(null)

                    this.go(client, '../../Paid/Started')
                }

                // Drop callback
                delete client._startPaidDownloadFn

            }
        }

    }

})

function computeViabilityOfPaidDownloadInSwarm(statuses, minimumNumber, numPiecesInTorrent) {

    // Statuses for:

    // all JoyStream peers
    var joyStreamPeers = []

    // all JoyStream seller mode peers
    var sellerPeers = []

    // all JoyStream (seller mode peers) invited, including
    var invited = []

    // all joined sellers
    var joined = []

    // Classify our peers w.r.t. starting a paid download
    for(var i in statuses) {

        var s = statuses[i]

        // If its a joystream peer
        if(s.connection) {

            // then keep hold on to it
            joyStreamPeers.push(s)

            // If its a seller
            if(s.connection.announcedModeAndTermsFromPeer.seller) {

                // then hold on to it
                sellerPeers.push(s)

                // If seller has been invited
                if(s.connection.innerState === ConnectionInnerState.WaitingForSellerToJoin ||
                    s.connection.innerState === ConnectionInnerState.PreparingContract) {

                    // then hold on to it
                    invited.push(s)

                    // Check if seller actually joined
                    if(s.connection.innerState === ConnectionInnerState.PreparingContract)
                        joined.push(s)
                }
            }

        }

    }

    if(joyStreamPeers.length === 0)
        return new ViabilityOfPaidDownloadInSwarm.NoJoyStreamPeerConnections()
    else if(sellerPeers.length === 0)
        return new ViabilityOfPaidDownloadInSwarm.NoSellersAmongJoyStreamPeers(joyStreamPeers)
    else if(invited.length < minimumNumber)
        return new ViabilityOfPaidDownloadInSwarm.InSufficientNumberOfSellersInvited(invited)
    else if(joined.length < minimumNumber)
        return new ViabilityOfPaidDownloadInSwarm.InSufficientNumberOfSellersHaveJoined(joined, invited)
    else {
      return new ViabilityOfPaidDownloadInSwarm.Viable(joined, estimateRequiredFundsForContract(joined, minimumNumber, numPiecesInTorrent))
    }
}

// Estimate here using same peer selection logic found in startPaidDownload input above
function estimateRequiredFundsForContract (suitableAndJoined, minNumberOfSellers, numPiecesInTorrent) {
  const pickedSellers = pickSellers(suitableAndJoined, minNumberOfSellers)

  let contractFeeRate = 0
  let totalOutput = 0

  for (var i in pickedSellers) {
    const status = pickedSellers[i]

    const sellerTerms = status.connection.announcedModeAndTermsFromPeer.seller.terms

    // Pick how much to distribute among the sellers
    const minimumRevenue = sellerTerms.minPrice * numPiecesInTorrent

    // Set value to at least surpass dust
    const DUST = 600
    totalOutput = minimumRevenue + DUST

    // Update fee estimate
    if(sellerTerms.minContractFeePerKb > contractFeeRate)
        contractFeeRate = sellerTerms.minContractFeePerKb
  }

  /* TODO: Improve this estimation.
    sizeOfP2HOutput = X
    estimate = (sizeOfOneInputs + numSellers * sizeOfP2SHOutput) * contractFeeRate
  */

  // Just guestimating here
  // assuming only one input, and two outputs (1 commitment + 1 change)
  let feeEstimate = 1000 // satoshi

  return totalOutput + feeEstimate

}

function pickSellers (suitableAndJoined, minNumberOfSellers) {

  let fastestThenCheapest = function (sellerA, sellerB) {
      const termsA = sellerA.connection.announcedModeAndTermsFromPeer.seller.terms
      const termsB = sellerB.connection.announcedModeAndTermsFromPeer.seller.terms
      const latencyA = sellerA.connection.latency
      const latencyB = sellerB.connection.latency

      // sort by fastest first (lowest 'latency') - if speed tests were performed
      if(Number.isInteger(latencyA) && Number.isInteger(latencyB)) {
        if(latencyA < latencyB) return -1
        if(latencyA > latencyB) return 1
      }

      // If two sellers have same speed sort by cheapest (cheapest first)
      if(termsA.minPrice < termsB.minPrice) return -1
      if(termsA.minPrice > termsB.minPrice) return 1

      return 0
  }

  // There may be some bias towards a specific peer if a connection is always established first
  // with it. All else being equal (latency and price) we can add some fairness
  // if we shuffle before we sort the suitable sellers.
  var shuffledSellers = suitableAndJoined.sort(() => { return 0.5 - Math.random() })

  // Sort suitable sellers using `peerComparer` function
  var sortedSellers = shuffledSellers.sort(fastestThenCheapest)

  // Pick actual sellers to use
  return sortedSellers.slice(0, minNumberOfSellers)
}

module.exports = Started
