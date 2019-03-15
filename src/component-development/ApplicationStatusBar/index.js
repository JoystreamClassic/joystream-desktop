/**
 * Created by bedeho on 12/10/2017.
 */

import React, {Component} from 'react'
import ApplicationStatusBar from '../../scenes/Application/components/ApplicationStatusBar'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Slider from 'material-ui/Slider'
import FlatButton from 'material-ui/FlatButton'

class ControllableApplicationStatusBar extends Component {

    constructor(props) {
        super(props)

        this.state = { barVisible : false , progress : 0}

    }

    handleShowBar = () => {
        this.setState({barVisible : true})
    }

    handleHideBar = () => {
        this.setState({barVisible : false})
    }

    onSliderChange = (event, newValue) => {

        console.log(newValue)
        this.setState({ progress : 100*newValue})
    }

    render() {

        let store = stateToStoreStub(this.state.progress)

        return (
            <Card>
                <CardTitle title="Card title" subtitle="Card subtitle" />
                {
                        this.state.barVisible
                    ?
                        <ApplicationStatusBar store={store}/>
                    :
                        null
                }
                <CardActions>
                    <FlatButton label="Show bar" onClick={this.handleShowBar}/>
                    <FlatButton label="Hide bar" onClick={this.handleHideBar}/>

                {
                    this.state.barVisible
                        ?
                    <Slider onChange={this.onSliderChange}/>
                        :
                    null
                }

                </CardActions>
            </Card>
        )

    }
}

function stateToStoreStub(progress) {

    return {
        torrentsBeingLoaded : [1, 2, 3],
        startingTorrentCheckingProgressPercentage : progress
    }

}

export default ControllableApplicationStatusBar