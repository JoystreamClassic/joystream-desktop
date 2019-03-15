import { observable, action, computed } from 'mobx'
import { TorrentInfo } from 'joystream-node'
import { remote } from 'electron'
import TorrentTableRowStore from "../../Common/TorrentTableRowStore";
import fs from 'fs'
import assert from 'assert'
import DeepInitialState from '../../../core/Torrent/Statemachine/DeepInitialState'

/**
 * User interface store for uploading scene
 */
class UploadingStore {

  static STATE  = {
    InitState: 0,

    // Part of flow to add a torrent file for uploading
    // NB: Consider factoring out later?

    /**
     * Currently not supported, we just force torrent file flow.
     * Step where user decided if they have raw content or a torrent filed.
     *
     * UserSelectingTorrentFileOrRawContent: 1,
     * ProvideTorrentFileMetadata: 7,
     * GeneratingTorrentFile: 8
     */

    TorrentFileWasInvalid: 2,
    TorrentAlreadyAdded: 3,
    UserPickingSavePath: 4,
    AddingTorrent: 5,
    TellUserAboutIncompleteDownload: 6,
    DroppingPriorAutoStartedDownload: 7
  }

  static TORRENT_ADDING_METHOD = {
    FILE_PICKER: 1,
    DRAG_AND_DROP: 2
  }

  /**
   * {Map.<TorrentTableRowStore>} Maps info hash to the row store for the corresponding torrent
   * Notice that this is not observable for rendering actual table, see `tableRowStores` below.
   */
  @observable rowStorefromTorrentInfoHash

  /**
   * {UploadingStore.STATE} Current state of scene
   **/
  @observable state

  /**
   * {String} Path to torrent file currently part of start uploading flow,
   * and is only defined when `canStartUpload`
   *
   * NB: Not clear if this genuinely needs to be observable, reconsider later.
   */
  @observable torrentFilePathSelected

  /**
   * @property {InfoHash} When torrent is being added, that is `state` === STATE.AddingTorrent,
   * then this will be the hash of the given torrent
   */
  infoHashOfTorrentSelected

  /**
   * {TorrentStore} When torrent is being added, that is `state` === STATE.AddingTorrent,
   * then this will be the store for the corresponding torrent, after it has been added - but
   * before the full torrent check has been completed, otherwise `null`.
   */
  @observable torrentStoreBeingAdded

  @observable lastFilePickingMethodUsed

  constructor (uiStore) {

    this._uiStore = uiStore

    this.setRowStorefromTorrentInfoHash(new Map())
    this.setState(UploadingStore.STATE.InitState)
    this.setTorrentStoreBeingAdded(null)

    // Torrent file selected in the current start uploading flow,
    // is reset when flow ends
    this._torrentInfoSelected = null
    this.infoHashOfTorrentSelected = null
  }
  @action.bound
  addTorrentStore(torrentStore) {

    if(this.rowStorefromTorrentInfoHash.has(torrentStore.infoHash))
      throw Error('Torrent store for same torrent already exists.')

    let row = new TorrentTableRowStore(torrentStore, this._uiStore, false)

    this.rowStorefromTorrentInfoHash.set(torrentStore.infoHash, row)
  }

  @action.bound
  removeTorrentStore(infoHash) {

    if(!this.rowStorefromTorrentInfoHash.has(infoHash))
      throw Error('No corresponding torrent store exists.')

    this.rowStorefromTorrentInfoHash.delete(infoHash)
  }

  @action.bound
  setRowStorefromTorrentInfoHash(rowStorefromTorrentInfoHash) {
    this.rowStorefromTorrentInfoHash = rowStorefromTorrentInfoHash
  }

  @action.bound
  setState (newState) {

    // Reset torrentinfo selected as part of flow
    if(newState === UploadingStore.STATE.InitState) {
      this._torrentInfoSelected = null
      this.setTorrentFilePathSelected(null)
      this.setTorrentStoreBeingAdded(null)
      this.infoHashOfTorrentSelected = null
    }

    this.state = newState
  }

  /**
   * Returns array of row stores, in the order they should be listed in the table.
   * @returns Array.<TorrentTableRowStore>
   */
  @computed get
  torrentRowStores () {

    /**
     * In the future we could compute different sorting based on whatever
     * the user has requested, e.g. by a particular column value.
     * For now we just do naive insertion order into `rowStorefromTorrentInfoHash` map.
     */

    return [...this.rowStorefromTorrentInfoHash.values()]
      .filter((torrentRowStore) => {
        return torrentRowStore.torrentStore.isUploading
      })
  }

  @computed get
  totalUploadSpeed () {
    return this.torrentRowStores.reduce(function (accumulator, row) {
      return accumulator + row.torrentStore.uploadSpeed
    }, 0)
  }

  @action.bound
  setTorrentFilePathSelected (torrentFile) {
    this.torrentFilePathSelected = torrentFile
  }

  @action.bound
  setTorrentStoreBeingAdded(torrentStoreBeingAdded) {
    this.torrentStoreBeingAdded = torrentStoreBeingAdded
  }

  @computed get
  canStartUpload() {
    return this.state === UploadingStore.STATE.InitState
  }

  startTorrentUploadFlowFromDragAndDrop (files) {

    this.lastFilePickingMethodUsed = UploadingStore.TORRENT_ADDING_METHOD.DRAG_AND_DROP

    // If the user tries adding when we are not ready,
    // then we just ignore, but UI should avoid this ever
    // happening in practice
    if (!this.canStartUpload)
      throw Error('Can only initiate uploading in InitState.')

      // If the user did no pick any files, then we are done
      if (!files || files.length === 0) {
        return
      }

      let torrentFileName = files[0].path

      this._uploadTorrentFile(torrentFileName)
  }

  startTorrentUploadFlowWithFilePicker() {

    this.lastFilePickingMethodUsed = UploadingStore.TORRENT_ADDING_METHOD.FILE_PICKER

    /// User selects torrent file

    // Display file picker
    let filesPicked = remote.dialog.showOpenDialog({
      title: 'Pick torrent file',
      filters: [
        {name: 'Torrent file', extensions: ['torrent']},
        {name: 'All Files', extensions: ['*']}
      ],
      properties: ['openFile']}
    )

    // If the user did no pick any files, then we are done
    if (!filesPicked || filesPicked.length === 0) {
      return
    }

    let torrentFileName = filesPicked[0]

    this._uploadTorrentFile(torrentFileName)

  }

  _uploadTorrentFile (torrentFileName) {

    this.setTorrentFilePathSelected(torrentFileName)

    /// Read torrent file data
    let torrentFileData

    try {

      // NB: Later make async to not block, and introduce state+ui
      torrentFileData = fs.readFileSync(torrentFileName)

    } catch (e) {

      // NB: Add fail dialog UI state for this

      console.log('Failed to load torrent file: ' + torrentFileName)
      console.log(e)
      return
    }

    // Get torrent file name picked
    let torrentInfo

    try {
      torrentInfo = new TorrentInfo(torrentFileData)

    } catch (error) {

      this.setState(UploadingStore.STATE.TorrentFileWasInvalid)
      return
    }

    // Check if this torrent has not already been added
    if(this._uiStore.applicationStore.torrentStores.has(torrentInfo.infoHash())) {
      this.setState(UploadingStore.STATE.TorrentAlreadyAdded)
      return
    }

    // Hold on to torrent identifiers
    this._torrentInfoSelected = torrentInfo
    this.infoHashOfTorrentSelected = torrentInfo.infoHash()

    this.setState(UploadingStore.STATE.UserPickingSavePath)
  }

  startUpload (savePath) {

    if(this.state !== UploadingStore.STATE.UserPickingSavePath)
      throw Error('Can only start when user is picking save path')

    assert(this._torrentInfoSelected, 'Torrent file must be selected already')
    assert(this.infoHashOfTorrentSelected, ' Torrent infohash must be set')

    // Get settings

    let torrentInfo = this._torrentInfoSelected

    let settings = {
      infoHash : torrentInfo.infoHash(),
      metadata : torrentInfo,
      resumeData : null,
      name: torrentInfo.name(),
      savePath: savePath,
      deepInitialState: DeepInitialState.UPLOADING.STARTED,
      extensionSettings : {

        /***
         * ALERT ALERT:
         * The below is a horrible hack in order to get this out the door
         * without braking anything, needs to be refactored and removed!
         * Only instances in `Application` should be around.
         */

        sellerTerms: this._uiStore._application.defaultSellerTerms(torrentInfo.pieceLength(), torrentInfo.numPieces())
      }
    }

    // Update state
    this.setState(UploadingStore.STATE.AddingTorrent)

    // Add torrent with given settings
    this._uiStore.applicationStore.addTorrent(settings, (err, torrentStore) => {

      assert(this.state === UploadingStore.STATE.AddingTorrent)

      if(err) {

        // NB: could there be some other issue here? if so, can we reliably decode it
        // requires further inspection, for now we just presume i

        this.setState(UploadingStore.STATE.TorrentAlreadyAdded)

      } else {

        // <-- is this really right? -->

        // We were able to add, now we must wait for calls to
        // `torrentFinishedDownloading` or `torrentDownloadIncomplete`
        // to learn about result. We cannot create local reactions on
        // `torrentStore`, as that violates design principle (a), and
        // also MOBX best practices about updating model in reactions.

        this.setTorrentStoreBeingAdded(torrentStore)

      }

    })
  }

  torrentFinishedDownloading() {

    // If we are currently trying to add this torrent

    if(this.state === UploadingStore.STATE.AddingTorrent) {

      // then we are now done
      this.setState(UploadingStore.STATE.InitState)

    }

  }

  torrentDownloadIncomplete() {

    // If we are currently trying to add this torrent
    if(this.state === UploadingStore.STATE.AddingTorrent ) {

      // then we have to inform the user about the incomplete download
      this.setState(UploadingStore.STATE.TellUserAboutIncompleteDownload)

    }
  }

  acceptTorrentFileWasInvalid () {

    if(this.state !== UploadingStore.STATE.TorrentFileWasInvalid)
      throw Error('Invalid action when state is not TorrentFileWasInvalid')

    this.setState(UploadingStore.STATE.InitState)
  }

  retryPickingTorrentFile () {

    if(this.state !== UploadingStore.STATE.TorrentFileWasInvalid)
      throw Error('State must be TorrentFileWasInvalid')

    this.setState(UploadingStore.STATE.InitState)

    this.startTorrentUploadFlowWithFilePicker()
  }

  acceptTorrentWasAlreadyAdded () {

    if(this.state !== UploadingStore.STATE.TorrentAlreadyAdded)
      throw Error('State must be TorrentAlreadyAdded')

    this.setState(UploadingStore.STATE.InitState)
  }

  exitStartUploadingFlow () {

    if(this.state === UploadingStore.STATE.InitState)
      throw Error('State cannot be InitState')

    this.setState(UploadingStore.STATE.InitState)
  }

  dropDownloadClicked () {

    if(this.state !== UploadingStore.STATE.TellUserAboutIncompleteDownload)
      throw Error('State must be TellUserAboutIncompleteDownload')

    assert(this._torrentInfoSelected)

    this.setState(UploadingStore.STATE.DroppingPriorAutoStartedDownload)

    this._uiStore.applicationStore.removeTorrent(this._torrentInfoSelected.infoHash(), false, () => {

      this.setState(UploadingStore.STATE.InitState)
    })


  }

  keepDownloadingClicked () {
    this.setState(UploadingStore.STATE.InitState)
  }

}

export default UploadingStore
