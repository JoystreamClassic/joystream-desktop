/**
 * Created by bedeho on 13/06/17.
 */

var BaseMachine = require('../../../BaseMachine')
var LibtorrentInteraction = require('joystream-node').LibtorrentInteraction
var TorrentState = require('joystream-node').TorrentState
var Common = require('../Common')
var assert = require('assert')
import DeepInitialState from '../DeepInitialState'
import { isStopped, isDownloading, isUploading, isPassive } from '../DeepInitialState'

var Loading = new BaseMachine({

    initialState: "AddingToSession",

    states: {

        AddingToSession : {

          addedToSession: function (client, torrent) {

            // Hold on to torrent
            client._joystreamNodeTorrent = torrent

            // Hook into torrent events

            torrent.on('metadata', (torrentInfo) => {
                client._submitInput('metadataReady', torrentInfo)
            })

            torrent.on('resumedata', (resumeData) => {
                client._submitInput('resumeDataGenerated', resumeData)
            })

            torrent.on('resumedata_error', function(err) {
                client._submitInput('resumeDataGenerationFailed', err)
            })

            // Update store when status changes
            torrent.on('status_update', (status) => {

                // Workaround used in place of finished alert not being reliable due to a bug
                // in libtorrent
                if (status.state === TorrentState.finished || status.state === TorrentState.seeding) {
                  client._submitInput('downloadFinished')
                }

                client._setJoystreamNodeTorrentStatus(status)
            })

            // This alert is generated when a torrent switches from being a downloader to a seed.
            // It will only be generated once per torrent.
            torrent.on('finished', function () {
                client._submitInput('downloadFinished')
            })

            // This alert is posted when a torrent completes checking. i.e. when it transitions out of
            // the checking files state into a state where it is ready to start downloading
            torrent.on('torrentChecked', function () {
                client._submitInput('checkFinished')
            })

            torrent.on('peerPluginStatusUpdates', function (peerStatuses) {
              client._submitInput('processPeerPluginStatuses', peerStatuses)
            })

            torrent.on('sellerTermsUpdated', function (alert) {
              client._submitInput('processSellerTermsUpdated', alert.terms)
            })

            torrent.on('buyerTermsUpdated', function (alert) {
              client._submitInput('processBuyerTermsUpdated', alert.terms)
            })

            torrent.on('uploadStarted', function (alert) {
              client._submitInput('uploadStarted', alert)
            })

            torrent.on('anchorAnnounced', function (alert) {
              client._submitInput('anchorAnnounced', alert)
            })

            torrent.on('lastPaymentReceived', function (alert) {
              client._submitInput('lastPaymentReceived', alert)
            })

            torrent.on('validPaymentReceived', function (alert) {
              client._submitInput('processValidPaymentReceived', alert)
            })

            torrent.on('sentPayment', function (alert) {
              client._submitInput('processSentPayment', alert)
            })
            
            torrent.on('downloadStarted', function (alert) {
              // this only happens on success, we can't use this without a corresponding
              // error alert to indicate download starting failed
              //client._submitInput('paidDownloadInitiationCompleted', alert)
            })

            torrent.on('allSellersGone', function (alert) {
              client._submitInput('allSellersGone', alert)
            })
            
            // If we don´t have metadata, wait for it
            if(client.torrentInfo && client.torrentInfo.isValid()) {
              this.transition(client, 'CheckingPartialDownload')
            } else {
                this.transition(client, 'WaitingForMetadata')
            }
          }
        },

        WaitingForMetadata : {

            metadataReady : function (client, torrentInfo) {

              // Hold on to metadata, is required when shutting down
              client._setTorrentInfo(torrentInfo)

              this.transition(client, 'CheckingPartialDownload')
            }
        },

        CheckingPartialDownload: {

            checkFinished: function (client) {
                // If the saved initial state was stopped pause the torrent now after
                // checking files completes
                if (isStopped(client._deepInitialState)) {
                  client._joystreamNodeTorrent.handle.pause()
                }

                // By default, extension torrent plugins are constructed with
                // TorrentPlugin::LibtorrentInteraction::None:
                // - No events interrupted, except on_extended events for this plugin.
                // Since we _never_ want libtorrent to seed for us over vanilla BitTorrent
                // protocol, even when we are uploading (we only allow
                // paid seeding in app), we instead want
                // TorrentPlugin::LibtorrentInteraction::BlockDownloading:
                // - Preventing uploading to peers by
                // -- sending (once) CHOCKED message in order to discourage inbound requests.
                // -- cancel on_request() to make libtorrent blind to peer requests.
                Common.setLibtorrentInteraction(client, LibtorrentInteraction.BlockUploading)

                // Determine whether we have a full download

                var s = client._joystreamNodeTorrent.handle.status()

                if (s.state === TorrentState.seeding) {

                    if(isPassive(client._deepInitialState) || isDownloading(client._deepInitialState)) {

                        // When there is a full download, and the user doesn't want to upload, then
                        // we just go to passive, even if the user really wanted to download.
                        Common.toObserveMode(client)

                        client._deepInitialState = DeepInitialState.PASSIVE

                        Common.startExtension(client)

                    } else { // isUploading

                      Common.toSellMode(client, client.sellerTerms)

                      if(!isStopped(client._deepInitialState))
                          Common.startExtension(client)
                    }

                    goToDeepInitialState(this, client)

                } else {

                    // We go to buy mode, regardless of what the user wanted (DeepInitialState),
                    // user will need to supply terms on their own.

                    if(isDownloading(client._deepInitialState))  {

                        Common.toBuyMode(client, client.buyerTerms)

                        // When not paused, then start extension, otherwise leave extension un-started
                        if(!isStopped(client._deepInitialState))
                            Common.startExtension(client)

                        goToDeepInitialState(this, client)

                    } else { // isPassive || isUploading

                        // Overrule users wish, force (unpaid+started) downloading
                        client._deepInitialState = DeepInitialState.DOWNLOADING.UNPAID.STARTED

                        this.transition(client, 'WaitingForMissingBuyerTerms')
                    }
                }

            }

        },

        WaitingForMissingBuyerTerms : {

            missingBuyerTermsProvided: function(client, terms) {

                Common.toBuyMode(client, terms)

                // Hold on to terms
                client._setBuyerTerms(terms)

                // When not paused, then start extension, otherwise leave extension un-started
                if(!isStopped(client._deepInitialState))
                    Common.startExtension(client)

                goToDeepInitialState(this, client)
            }
        }
    }
})

function goToDeepInitialState(machine, client) {

    let deepInitialState = client._deepInitialState

    // Path to active substate we need to transition to
    var path = relativePathFromDeepInitialState(client._deepInitialState)

    // Transition to active state
    machine.go(client, path)

    // Drop temporary storage of inital state we want to load to
    delete client._deepInitialState

    client.emit('loaded', deepInitialState)
}

function relativePathFromDeepInitialState(s) {

    switch (s) {
        case DeepInitialState.DOWNLOADING.UNPAID.STARTED:
            return '../Active/DownloadIncomplete/Unpaid/Started/ReadyForStartPaidDownloadAttempt'
        case DeepInitialState.DOWNLOADING.UNPAID.STOPPED:
            return '../Active/DownloadIncomplete/Unpaid/Stopped'
        /**
        case DeepInitialState.DOWNLOADING.PAID.STARTED:
            return '../Active/DownloadIncomplete/Paid/Started'
        case DeepInitialState.DOWNLOADING.PAID.STOPPED:
            return '../Active/DownloadIncomplete/Paid/Stopped'
        */
        case DeepInitialState.PASSIVE:
            return '../Active/FinishedDownloading/Passive'
        case DeepInitialState.UPLOADING.STARTED:
            return '../Active/FinishedDownloading/Uploading/Started'
        case DeepInitialState.UPLOADING.STOPPED:
            return '../Active/FinishedDownloading/Uploading/Stopped'
    }

    assert(false)
}

module.exports = Loading
