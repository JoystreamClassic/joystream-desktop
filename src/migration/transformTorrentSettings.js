import db from '../db'

// Updates torrent settings in Database
// by applying a transformation function to each torrent
async function transformTorrentSettings (torrentDbPath, transform) {

  let torrentsDB = await db.open(torrentDbPath)

  let torrents = await torrentsDB.getAll('torrents')

  let transformedTorrents = torrents.map(transform)

  await Promise.all(transformedTorrents.map(torrent => torrentsDB.save('torrents', torrent.infoHash, torrent)))

  await new Promise(function (resolve, reject) {
      torrentsDB.close((err) => {
        resolve()
      })
  })

}

module.exports = transformTorrentSettings
