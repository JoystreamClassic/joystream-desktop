import React from 'react'

import {ScenarioContainer} from '../common'

import TorrentTable from '../../scenes/Completed/components/TorrentTable'
import TorrentToolbar from '../../scenes/Completed/components/TorrentToolbar'
import TorrentContextMenu from '../../scenes/Completed/components/TorrentContextMenu'

class MockTorrent {

    constructor(fields) {

        this.info_hash = fields.info_hash
        this.name = fields.name
        this.size = fields.size
        this.numberOfBuyers = fields.numberOfBuyers
        this.numberOfSellers = fields.numberOfSellers
        this.numberOfObservers = fields.numberOfObservers
        this.numberOfNormalPeers = fields.numberOfNormalPeers
    }

    startSelling() {
        console.log("startSelling: " + this.name)
    }

    openFolder() {
        console.log("openFolder: " + this.name)
    }

    remove() {
        console.log("remove: " + this.name)
    }

    removeAndDeleteData() {
        console.log("removeAndDeleteData: " + this.name)
    }
}

const CompletedSceneScenarios = () => {

    var torrents = [
        new MockTorrent({ info_hash : "info_hash_1",
            name : "My fake torrent",
            size : 1025,
            numberOfBuyers : 452,
            numberOfSellers : 12,
            numberOfObservers : 5,
            numberOfNormalPeers : 1
        }),
        new MockTorrent({
            info_hash : "info_hash_2",
            name : "My pretty content",
            size : 1025223223,
            numberOfBuyers : 428,
            numberOfSellers : 92,
            numberOfObservers : 521,
            numberOfNormalPeers : 44
        }),
        new MockTorrent({
            info_hash : "info_hash_3",
            name : "Favourite data",
            size : 65330252232,
            numberOfBuyers : 4812,
            numberOfSellers : 219,
            numberOfObservers : 115,
            numberOfNormalPeers : 324
        }),
        new MockTorrent({
            info_hash : "info_hash_4",
            name : "Hello my dear user 19821",
            size : 3420252232,
            numberOfBuyers : 481,
            numberOfSellers : 92,
            numberOfObservers : 15,
            numberOfNormalPeers : 44
        }),
        new MockTorrent({
            info_hash : "info_hash_5",
            name : "Some other great file",
            size : 10252232,
            numberOfBuyers : 48,
            numberOfSellers : 9,
            numberOfObservers : 5,
            numberOfNormalPeers : 4
        })

    ]

    return (
        <div>
            <ScenarioContainer title="Non-empty table" subtitle="A non-empty table">
                <TorrentTable torrents={torrents} />
            </ScenarioContainer>

            <ScenarioContainer title="Toolbar">
                <TorrentToolbar onOpenFolderClicked={() => {console.log("open folder clicked")}}
                                onMoreClicked={() => {console.log("more clicked")}}/>
            </ScenarioContainer>

            <ScenarioContainer title="Context menu">
                <TorrentContextMenu onOutsideContextMenuClicked = {() => {}}
                                    onRemoveClicked = {() => {console.log("Remove and click")}}
                                    onRemoveAndDeleteDataClicked = {() => {console.log("Remove and delete data clicked")}}
                                    numberOfBuyers = {1}
                                    numberOfSellers = {263}
                                    numberOfObservers = {209}
                                    numberOfNormalPeers = {23}/>
            </ScenarioContainer>

        </div>
    )
}

export default CompletedSceneScenarios
