/**
 * Created by bedeho on 03/08/17.
 */

import React from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import StartDownloadingFlow from '../../scenes/Downloading/components/StartDownloadingFlow'

const StartDownloadingFlowScenarios = (props) => {

    return (
        <Card>

            <CardHeader
                title="DOWNLOADING FLOW"
                subtitle="Click on the given action to trigger this flow"
                //actAsExpander={true}
                //showExpandableButton={true}
            />

            <CardActions>

                <FlatButton
                    label="Invalid torrent file"
                    onTouchTap={() => { props.store.setState('Started.OnDownloadingScene.TorrentFileWasInvalid')}}/>
                <FlatButton
                    label="Already added"
                    onTouchTap={() => { props.store.setState('Started.OnDownloadingScene.TorrentAlreadyAdded')}}/>

            </CardActions>

            <StartDownloadingFlow store={props.store} />
        </Card>
    )
}

export default StartDownloadingFlowScenarios
