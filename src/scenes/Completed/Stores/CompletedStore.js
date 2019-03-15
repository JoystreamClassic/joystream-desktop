import {computed} from 'mobx'
import {action, observable} from "mobx/lib/mobx";
import TorrentTableRowStore from "../../Common/TorrentTableRowStore";

class CompletedStore {

  /**
   * {Map.<TorrentTableRowStore>} Maps info hash to the row store for the corresponding torrent
   * Notice that this is not observable for rendering actual table, see `tableRowStores` below.
   */
  @observable rowStorefromTorrentInfoHash

  constructor(uiStore) {

    this._uiStore = uiStore
    this.setRowStorefromTorrentInfoHash(new Map())
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
        return torrentRowStore.torrentStore.isFullyDownloaded
      })
  }
}

export default CompletedStore
