/**
 * Created by bedeho on 03/06/17.
 */

import React, {Component} from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'
import Slider from 'material-ui/Slider'

import {ScenarioContainer} from '../common'
import TerminatingScene, {TerminatingState} from '../../scenes/Terminating'

function getState(s) {

    return {
        'terminatingState' : s.terminatingState,
        'terminatingTorrentsProgressValue': s.terminatingTorrentsProgressValue ? s.terminatingTorrentsProgressValue : 0
    }
}

class ControllableTerminatingScene extends Component {

    constructor(props) {
        super(props)

        this.state = {
            terminatingState : TerminatingState.TerminatingTorrents,
            terminatingTorrentsProgressValue : 18
        }

        //getState(TerminatingState.CreatingSPVNode)
    }

    goToNextState() {

        if(!this.state.terminatingState == TerminatingState.LoadingTorrents)
            throw Error('Already at last state')
        else
            this.setState({terminatingState : this.state.terminatingState + 1}) // a bit sloppy, but OK, later add more sophistication
    }

    goToPriorState() {

        if(this.state.terminatingState == TerminatingState.InitializingResources)
            throw Error('Already at first state')
        else
            this.setState({terminatingState : this.state.terminatingState - 1}) // a bit sloppy, but OK, later add more sophistication
    }

    handleSliderChange = (event, value) => {
        this.setState({terminatingTorrentsProgressValue: 100*value})
    }

    render() {

        return (
            <div>
                <div style={{ height : 600}}>
                    <TerminatingScene terminatingState={this.state.terminatingState}
                                      terminatingTorrentsProgressValue={this.state.terminatingTorrentsProgressValue}/>
                </div>
                <CardActions>

                    <FlatButton label="Previous"
                                onTouchTap={() => { this.goToPriorState()}}
                                disabled={this.state.terminatingState == TerminatingState.TerminatingTorrents}
                    />

                    <FlatButton label="Next"
                                onTouchTap={() => { this.goToNextState()}}
                                disabled={this.state.terminatingState == TerminatingState.ClearingResources}
                    />

                    <Slider defaultValue={this.state.terminatingTorrentsProgressValue/100}
                            onChange={this.handleSliderChange}
                            disabled={this.state.terminatingState != TerminatingState.TerminatingTorrents}
                    />

                </CardActions>
            </div>
        )
    }

}

ControllableTerminatingScene.propTypes = {

}

const TerminatingSceneScenarios = () => {

    return (
        <ScenarioContainer>
            <ControllableTerminatingScene />
        </ScenarioContainer>
    )
}

export default TerminatingSceneScenarios
