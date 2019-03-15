import LibtorrentStream from './LibtorrentStream'
import fs from 'fs'
import path from 'path'

/**
 * Factory for file segments as streams
 */
class FileSegmentStreamFactory {

  /**
   * {Number} Index of file in torrent to which this factory corresponds
   */
  fileIndex

  /**
   * {String}
   */
  fileName

  /**
   * {String}
   */
  path

  /**
   * Constructor
   * @param torrent
   * @param fileIndex
   * @param completed
   */
  constructor (torrent, fileIndex, completed) {

    this._torrent = torrent
    this.fileIndex = fileIndex
    this._completed = completed

    let fileStorage = torrent.handle.torrentFile().files()

    this.fileName = fileStorage.fileName(fileIndex)

    this.size = fileStorage.fileSize(fileIndex)

    this.path = path.format({
      dir: this._torrent.handle.savePath(),
      base: fileStorage.filePath(fileIndex)
    })

  }

  /**
   * Called by render-media. Will return the ReadableStream object.
   * @param {object} opts : {start: bytes, end: bytes}
   */
  createReadStream (opts = {}) {

    if (this._completed) {
      console.log('creating fs.stream')
      return fs.createReadStream(this.path, opts)
    } else {
      console.log('creating libtorrent.stream')
      return new LibtorrentStream(this._torrent, this.fileIndex, opts)
    }
  }
}

export default FileSegmentStreamFactory
