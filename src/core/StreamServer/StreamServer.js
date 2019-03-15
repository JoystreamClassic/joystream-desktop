import http from 'http'
import fs from 'fs'
import mime from 'mime'
import {EventEmitter} from 'events'

const PORT = 8888
const HOST = 'localhost'

const debug = require('debug')('StreamServer')

class StreamServer extends EventEmitter {
  constructor (torrents, host, port) {

    super()

    this._torrents = torrents
    this._host = host || HOST
    this._port = port || PORT

    this._server = http.createServer((req, resp) => { this._httpRequestHandler(req, resp) })

    this._server.once('listening', () => { this._onHttpServerListening() })
    this._server.on('error', (err) => { this._onHttpServerError(err) })
  }

  start () {
    this._server.listen(this._port, this._host)
  }

  stop () {
    this._destroyStream()

    this._server.close(() => {
      // note - if not all responses have ended this will take a while to get closed
      // and this can delay shutting down the app
    })

    // do not wait for server to close.
    this.emit('stopped')
  }

  getStreamUrl(infoHash, fileIndex) {
    return 'http://' + this._host + ':' + this._port + '/' + infoHash + '/' + fileIndex
  }

  _destroyStream() {
    if(this._stream) {
      this._stream.destroy()
      this._stream = null
    }
  }

  _onHttpServerListening () {
    this.emit('started')
  }

  _onHttpServerError (err) {
    this.emit('error', err)
  }

  _parseRequest(request) {
    const url = request.url

    const parts = url.split('/')

    if (parts.length >= 2) {
      return parts.slice(-2)
    }

    return [null, null]
  }

  _httpRequestHandler (req, res) {
      // TODO: manage multiple requests to the same torrent

      // Destroy last created stream
      this._destroyStream()

      // parse request url for infoHash, fileIndex
      const [infoHash, fileIndex] = this._parseRequest(req)

      if (infoHash === null || fileIndex === null) {
        return res.end() // use proper HTTP error status code
      }

      // Do we have this torrent?
      if(!this._torrents.has(infoHash)) {
        debug('infoHash not in application')
        return res.end() // use proper HTTP error status code
      }

      const torrent = this._torrents.get(infoHash)

      try {
        var streamFactory = torrent.createStreamFactory(parseInt(fileIndex))
      } catch (err) {
        debug('failed to create stream factory', err)
        return res.end()
      }

      res.on('close', () => {
        this._destroyStream()
      })

      req.on('close', () => {

      })

      const total = streamFactory.size
      const torrentFileName = streamFactory.fileName

      res.setHeader('Content-Type', mime.getType(torrentFileName))

      // Support range-requests
      res.setHeader('Accept-Ranges', 'bytes')

      // meaning client (browser) has moved the forward/back slider
      // which has sent this request back to this server logic ... cool
      if (req.headers.range) {
        const range = req.headers.range
        const parts = range.replace(/bytes=/, '').split('-')
        const partialstart = parts[0]
        const partialend = parts[1]

        const start = parseInt(partialstart, 10)
        const end = partialend ? parseInt(partialend, 10) : total - 1
        const chunksize = (end - start) + 1

        this._stream = streamFactory.createReadStream({start: start, end: end})
        res.writeHead(206, { 'Content-Range': 'bytes ' + start + '-' + end + '/' + total, 'Content-Length': chunksize })
        this._stream.pipe(res)

      } else {
        res.writeHead(200, { 'Content-Length': total })
        this._stream = streamFactory.createReadStream()
        this._stream.pipe(res)
      }
  }

}

export default StreamServer
