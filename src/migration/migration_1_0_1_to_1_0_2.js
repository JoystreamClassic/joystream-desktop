import {DEFAULT_APPLICATION_SETTINGS}  from '../core/Application/Application'
import transformTorrentSettings from './transformTorrentSettings'
import DeepInitialState from '../core/Torrent/Statemachine/DeepInitialState'

module.exports = async function migration_1_0_1_to_1_0_2 (appSettings, torrentDbPath) {
  // In initial mainnet release we forgot to clear the old testnet terms saved in application settings
  appSettings.setDefaultBuyerTerms(DEFAULT_APPLICATION_SETTINGS.buyerTerms)

  appSettings.setDefaultSellerTerms(DEFAULT_APPLICATION_SETTINGS.sellerTerms)

  appSettings.setBittorrentPort(DEFAULT_APPLICATION_SETTINGS.bitTorrentPort)

  // Clear terms from saved torrents
  await transformTorrentSettings(torrentDbPath, function (torrent) {

    // Torrent statemachine will not expect for there to be any terms set yet
    torrent.deepInitialState = DeepInitialState.PASSIVE

    // Forces new standard terms to be used
    delete torrent.extensionSettings

    return torrent
  })
}
