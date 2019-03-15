import { observable, action, computed } from 'mobx'
import Torrent from '../../core/Torrent'

class TorrentStore {

    @observable infoHash
    @observable name
    @observable state

    @observable totalSize

    /**
     * {String} Path where torrent data is saved and or read from
     */
    @observable savePath

    /**
     * {SellerTerms} Terms when selling
     */
    @observable sellerTerms

  /**
   * {Number} Total number of pieces sold by us as a seller this
   * session
   */
  @observable numberOfPiecesSoldAsSeller

  /**
   * {Number} Total revenue so far from spending, does not include
   * tx fees for closing channel (they are deducted).
   */
  @observable totalRevenueFromPiecesAsSeller

    /**
     * {BuyerTerms} Terms when buying
     */
    @observable buyerTerms

    /**
     * {Number} The total amount (sats) sent as payments so far,
     * does not include tx fees used to open and close channel.
     */
    @observable totalSpendingOnPiecesAsBuyer

    /**
     * {Number} Current progress of torrent processing. While downloading,
     * this refers to completion rate, while checking resume
     * data it refers to the progress check.
     */
    @observable progress

    /**
     * {Number} The total number of bytes of the file(s) that we have.
     * All this does not necessarily has to be downloaded during
     * this session (that's total_payload_download).
     */
    @observable downloadedSize
    @observable downloadSpeed
    @observable uploadSpeed

    /**
     * {Number} Number of peers classified as seeders (by libtorrent)
     */
    @observable numberOfSeeders

    // store the files (see libtorrent::file_storage)
    @observable torrentFiles

    /**
     * libtorrent::torrent_status::total_download/total_upload
     *
     * The number of bytes downloaded and uploaded to all peers, accumulated, this session only.
     * The session is considered to restart when a torrent is paused and restarted again.
     * When a torrent is paused, these counters are reset to 0. If you want complete, persistent,
     * stats, see all_time_upload and all_time_download.
     *
     */
    @observable uploadedTotal

    @observable viabilityOfPaidDownloadInSwarm

    /**
     * {Map.<String,PeerStore>} Maps peer id to peer store for corresponding peer
     */
    @observable peerStores

    /**
     * {Number} The size in bytes of a piece
     */
    @observable pieceLength

    @observable numberOfPieces

    constructor ({infoHash,
                 name,
                 savePath,
                 state,
                 totalSize,
                 pieceLength,
                 numberOfPieces,
                 progress,
                 viabilityOfPaidDownloadInSwarm,
                 downloadedSize,
                 downloadSpeed,
                 uploadSpeed,
                 uploadedTotal,
                 numberOfSeeders,
                 sellerTerms,
                 numberOfPiecesSoldAsSeller,
                 totalRevenueFromPiecesAsSeller,
                 buyerTerms,
                 totalSpendingOnPiecesAsBuyer,
                 starter,
                 stopper,
                 paidDownloadStarter,
                 uploadBeginner,
                 uploadStopper}) {

      this.setInfoHash(infoHash)
      this.setName(name)
      this.setSavePath(savePath)
      this.setState(state)
      this.setTotalSize(totalSize)
      this.setPieceLength(pieceLength)
      this.setNumberOfPieces(numberOfPieces)
      this.setProgress(progress)
      this.setViabilityOfPaidDownloadInSwarm(viabilityOfPaidDownloadInSwarm)
      this.setDownloadedSize(downloadedSize)
      this.setDownloadSpeed(downloadSpeed)
      this.setUploadSpeed(uploadSpeed)
      this.setUploadedTotal(uploadedTotal)
      this.setNumberOfSeeders(numberOfSeeders)
      this.setSellerTerms(sellerTerms)
      this.setNumberOfPiecesSoldAsSeller(numberOfPiecesSoldAsSeller)
      this.setTotalRevenueFromPiecesAsSeller(totalRevenueFromPiecesAsSeller)
      this.setBuyerTerms(buyerTerms)
      this.setTotalSpendingOnPiecesAsBuyer(totalSpendingOnPiecesAsBuyer)

      this.peerStores = new Map()

      this._starter = starter
      this._stopper = stopper
      this._paidDownloadStarter = paidDownloadStarter
      this._uploadBeginner = uploadBeginner
      this._uploadStopper = uploadStopper
    }

    @action.bound
    setInfoHash(infoHash) {
      this.infoHash = infoHash
    }

    @action.bound
    setSavePath(savePath) {
        this.savePath = savePath
    }

    @action.bound
    setState(state) {
      this.state = state
    }

    @action.bound
    setName (name) {
        this.name = name
    }

    @action.bound
    setTotalSize (totalSize) {
        this.totalSize = totalSize
    }

    @action.bound
    setPieceLength (pieceLength) {
      this.pieceLength = pieceLength
    }

    @action.bound
    setNumberOfPieces (numPieces) {
      this.numberOfPieces = numPieces
    }

    @action.bound
    setDownloadedSize(downloadedSize) {
        this.downloadedSize = downloadedSize
    }

    @action.bound
    setDownloadSpeed(downloadSpeed) {
        this.downloadSpeed = downloadSpeed
    }

    @action.bound
    setUploadSpeed(uploadSpeed) {
        this.uploadSpeed = uploadSpeed
    }

    @action.bound
    setUploadedTotal(uploadedTotal) {
        this.uploadedTotal = uploadedTotal
    }

    @action.bound
    setNumberOfSeeders(numberOfSeeders) {
      this.numberOfSeeders = numberOfSeeders
    }

    @action.bound
    setProgress (progress) {
        this.progress = progress
    }

    @action.bound
    setViabilityOfPaidDownloadInSwarm (viabilityOfPaidDownloadInSwarm) {
        this.viabilityOfPaidDownloadInSwarm = viabilityOfPaidDownloadInSwarm
    }

    @action.bound
    setTorrentFiles (torrentFiles) {
      this.torrentFiles = torrentFiles
    }

    @action.bound
    setSellerTerms (sellerTerms) {
      this.sellerTerms = sellerTerms
    }

    @action.bound
    setNumberOfPiecesSoldAsSeller (numberOfPiecesSoldAsSeller) {
        this.numberOfPiecesSoldAsSeller = numberOfPiecesSoldAsSeller
    }

    @action.bound
    setTotalRevenueFromPiecesAsSeller(totalRevenueFromPiecesAsSeller) {
      this.totalRevenueFromPiecesAsSeller = totalRevenueFromPiecesAsSeller
    }

    @action.bound
    setBuyerTerms (buyerTerms) {
      this.buyerTerms = buyerTerms
    }

    @action.bound
    setTotalSpendingOnPiecesAsBuyer (totalSpendingOnPiecesAsBuyer) {
      this.totalSpendingOnPiecesAsBuyer = totalSpendingOnPiecesAsBuyer
    }

    @computed get isLoading() {
        return this.state.startsWith("Loading")
    }

    @computed get isDownloading () {
        return this.state.startsWith("Active.DownloadIncomplete")
    }

    @computed get isFullyDownloaded () {
    return this.state.startsWith("Active.FinishedDownloading")
    }

    @computed get isUploading () {
    return this.state.startsWith("Active.FinishedDownloading.Uploading")
    }

    @computed get
    isTerminating() {
      return Torrent.isTerminating(this.state)
    }

    @computed get canChangeBuyerTerms () {
        if (this.state.startsWith("Active.DownloadIncomplete.Unpaid.Started")) return true
        if (this.state.startsWith('Loading.WaitingForMissingBuyerTerms')) return true
        return false
    }

    @computed get canChangeSellerTerms () {
        return this.state.startsWith("Active.FinishedDownloading.Uploading.Started")
    }

    @computed get canBeginUploading() {
        return this.state.startsWith("Active.FinishedDownloading.Passive")
    }

    @computed get canEndUploading() {
        return this.state.startsWith("Active.FinishedDownloading.Uploading.Started")
    }

    @computed get hasStartedPaidDownloading() {
        return this.state.startsWith("Active.DownloadIncomplete.Paid.Started")
    }

    @computed get canStop() {
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Started.ReadyForStartPaidDownloadAttempt") ||
            this.state.startsWith("Active.FinishedDownloading.Uploading.Started")

    }

    @computed get canStart() {
        return this.state.startsWith("Active.DownloadIncomplete.Unpaid.Stopped") ||
            this.state.startsWith("Active.FinishedDownloading.Uploading.Stopped")
    }

    @computed get
    peerStoresArray() {
      return [...this.peerStores.values()]
    }

    @computed get numberOfBuyers() {

      return this.peerStoresArray.filter((peerStore) => {
        return peerStore.peerIsBuyer
      }).length
    }

    @computed get numberOfSellers() {

      return this.peerStoresArray.filter((peerStore) => {
        return peerStore.peerIsSeller
      }).length
    }

    @computed get numberOfObservers() {

      return this.peerStoresArray.filter((peerStore) => {
        return peerStore.peerIsObserver
      }).length
    }

    @computed get numberOfNormalPeers() {

      return this.peerStoresArray.filter((peerStore) => {
        return peerStore.peerSupportsProtocol
      }).length
    }

    start() {
        this._starter()
    }

    stop() {
        this._stopper()
    }

    startPaidDownload(cb) {
        this._paidDownloadStarter(cb)
    }

    beginUploading(sellerTerms, cb) {
        this._uploadBeginner(sellerTerms, cb)
    }

    endUploading() {
        this._uploadStopper()
    }

}

export default TorrentStore
