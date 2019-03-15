import React from 'react'

import {ScenarioContainer} from '../common'

import TorrentTable from '../../scenes/Seeding/Components/TorrentTable'
import TorrentToolbar from '../../scenes/Seeding/Components/TorrentToolbar'
import TorrentContextMenu from '../../scenes/Seeding/Components/TorrentContextMenu'

class MockTorrent {

    constructor(fields) {

        this.info_hash = fields.info_hash
        this.name = fields.name
        this.upload_speed = fields.upload_speed
        this.paused = fields.paused
        this.paid = fields.paid
        this.price = fields.price,
        this.revenue = fields.revenue,
        this.canStartSelling = fields.canStartSelling
        this.numberOfBuyers = fields.numberOfBuyers
        this.numberOfSellers = fields.numberOfSellers
        this.numberOfObservers = fields.numberOfObservers
        this.numberOfNormalPeers = fields.numberOfNormalPeers
    }

    startSelling() {
        console.log("startBuying: " + this.name)
    }

    openFolder() {
        console.log("openFolder: " + this.name)
    }

    changePauseStatus() {
        console.log("changePauseStatus: " + this.name)
    }

    showChangePriceDialog() {
        console.log("showChangePriceDialog: " + this.name)
    }

    remove() {
        console.log("remove: " + this.name)
    }

    removeAndDeleteData() {
        console.log("removeAndDeleteData: " + this.name)
    }
}

const SeedingSceneScenarios = () => {

    var torrents = [
        new MockTorrent({ info_hash : "info_hash_1",
            name : "My fake torrent",
            upload_speed : 32,
            paused : false,
            paid : true,
            price : 500,
            revenue : 30000000000,
            canStartSelling : false,
            canChangePrice : true,
            numberOfBuyers : 452,
            numberOfSellers : 12,
            numberOfObservers : 5,
            numberOfNormalPeers : 1
        }),
        new MockTorrent({
            info_hash : "info_hash_2",
            name : "My pretty content",
            progress : 11,
            upload_speed : 3222323,
            paused : true,
            paid : true,
            price : 12,
            revenue : 8000,
            canStartSelling : false,
            canChangePrice : false,
            numberOfBuyers : 428,
            numberOfSellers : 92,
            numberOfObservers : 521,
            numberOfNormalPeers : 44
        }),
        new MockTorrent({
            info_hash : "info_hash_3",
            name : "Favourite data",
            upload_speed : 12332223,
            paused : true,
            paid : false,
            price : 1613156,
            revenue : 2368316153,
            canStartSelling : true,
            canChangePrice : false,
            numberOfBuyers : 4812,
            numberOfSellers : 219,
            numberOfObservers : 115,
            numberOfNormalPeers : 324
        }),
        new MockTorrent({
            info_hash : "info_hash_4",
            name : "Hello my dear user 19821",
            upload_speed : 23132223,
            paused : false,
            paid : false,
            price : 500000,
            revenue : 3000000,
            canStartSelling : true,
            canChangePrice : false,
            numberOfBuyers : 481,
            numberOfSellers : 92,
            numberOfObservers : 15,
            numberOfNormalPeers : 44
        }),
        new MockTorrent({
            info_hash : "info_hash_5",
            name : "Some other great file",
            upload_speed : 32223,
            paused : false,
            paid : false,
            price : 500000,
            revenue : 3000000,
            canStartSelling : true,
            canChangePrice : false,
            numberOfBuyers : 48,
            numberOfSellers : 9,
            numberOfObservers : 5,
            numberOfNormalPeers : 4
        })

    ]

    return (
        <div>

            <ScenarioContainer title="Empty table" subtitle="An empty table">
                <TorrentTable torrents={[]}/>
            </ScenarioContainer>

            <ScenarioContainer title="Non-empty table" subtitle="A non-empty table">
                <TorrentTable torrents={torrents} />
            </ScenarioContainer>

            <ScenarioContainer title="Toolbar">
                <TorrentToolbar onOpenFolderClicked={() => {console.log("open folder clicked")}}
                                onMoreClicked={() => {console.log("more clicked")}}/>
            </ScenarioContainer>

            <ScenarioContainer title="Context menu">
                <TorrentContextMenu onOutsideContextMenuClicked = {() => {}}
                                    paused = {false}
                                    onChangePauseStatus = {() => {console.log("Changing pause status")}}
                                    changePriceEnabled = {true}
                                    onChangePriceClicked = {() => {console.log("Change price clicked")}}
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

export default SeedingSceneScenarios
