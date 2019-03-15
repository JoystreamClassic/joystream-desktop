import path from 'path'

export const TELEGRAM_URL = "https://t.me/joinchat/CNyeUxHD9H56m3e_44hXIA"
export const SLACK_URL = "http://slack.joystream.co:3000/"
export const REDDIT_URL = "http://reddit.com/r/JoyStream"
export const WHY_BCH = "https://medium.com/@JoyStream/joystream-is-switching-to-bitcoin-cash-c005551ba0df"

/**
 * Number of sats under which if the balance tips we
 * will try to top up from the faucet.
 */
export const FAUCET_TOPUP_LIMIT = 25000

/**
 * Time interval (ms) between each check to the server
 */
export const AUTO_UPDATE_CHECK_INTERVAL = 10*60*1000

export const AUTO_UPDATE_BASE_URL ='https://download.joystream.co:7070/update/'
export const BLOCKEXPLORER_QUERY_STRING_BASE = 'https://bch.btc.com/'

const TORRENTS_PATH = path.join(__dirname, 'assets', 'torrents')

function makeFullTorrentPath (fileName) {
  return path.join(TORRENTS_PATH, fileName)
}

export const EXAMPLE_TORRENTS = [
    makeFullTorrentPath('sintel.torrent'),
    makeFullTorrentPath('glass-half-full.torrent'),
    makeFullTorrentPath('cosmos-laundromat.torrent'),

    makeFullTorrentPath('elephants-dream.torrent'),

    // The following torrents cannot be played by render-media
    // in genuine streaming mode, so we discontinue for now.
    // NB: Some of these are also larger than the 200MB default
    // blob limit, and hence this would also need to be adgusted!

    makeFullTorrentPath('big-buck-bunny.torrent'),
    makeFullTorrentPath('tears-of-steel.torrent')
]

// Not used - just keeping them here as hint to use in future
//export const DEFAULT_TORRENT_FILE_SOURCE_LOCATION = os.homedir()
//export const DEFAULT_SAVE_PATH= path.join(os.homedir(), 'joystream', 'download', path.sep)

export const UI_CONSTANTS = {
    primaryColor : '#496daf',
    labelTextHighlightColor : 'hsl(219, 41%, 42%)',
    darkPrimaryColor : 'rgba(62, 92, 147, 1)', // 'hsla(219, 41%, 37%, 1)',
    darkestPrimaryColor : 'hsla(219, 41%, 26%, 1)',
    higlightColor : 'rgba(53, 78, 126, 1)' //'hsl(218, 41%, 30%)'
}
