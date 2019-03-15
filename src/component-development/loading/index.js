/**
 * Created by bedeho on 03/06/17.
 */

import React, {Component} from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'
import Slider from 'material-ui/Slider'

import {ScenarioContainer} from '../common'
import LoadingScene, {LoadingState} from '../../scenes/Loading'

function getState(s) {

    return {
      'loadingState' : s.loadingState,
      'loadingTorrentsProgressValue': s.loadingTorrentsProgressValue ? s.loadingTorrentsProgressValue : 0
    }
}

class ControllableLoadingScene extends Component {

    constructor(props) {
        super(props)

        this.state = {
          loadingState : LoadingState.InitializingResources,
          loadingTorrentsProgressValue : 18
        }

        //getState(LoadingState.CreatingSPVNode)
    }

    goToNextState() {

        if(!this.state.loadingState == LoadingState.LoadingTorrents)
            throw Error('Already at last state')
        else
            this.setState({loadingState : this.state.loadingState + 1}) // a bit sloppy, but OK, later add more sophistication
    }

    goToPriorState() {

        if(this.state.loadingState == LoadingState.InitializingResources)
            throw Error('Already at first state')
        else
            this.setState({loadingState : this.state.loadingState - 1}) // a bit sloppy, but OK, later add more sophistication
    }

    handleSliderChange = (event, value) => {
      this.setState({loadingTorrentsProgressValue: 100*value})
    }

    render() {

        return (
            <div>
                <div style={{ height : 600}}>
                  <LoadingScene loadingState={this.state.loadingState} loadingTorrentsProgressValue={this.state.loadingTorrentsProgressValue}/>
                </div>
                <CardActions>

                      <FlatButton label="Previous"
                                  onTouchTap={() => { this.goToPriorState()}}
                                  disabled={this.state.loadingState == LoadingState.InitializingResources}/>

                      <FlatButton label="Next"
                                  onTouchTap={() => { this.goToNextState()}}
                                  disabled={this.state.loadingState == LoadingState.LoadingTorrents}/>

                    {
                        /**
                      this.state.loadingState == LoadingState.LoadingTorrents
                        ?
                      <Slider defaultValue={this.state.loadingTorrentsProgressValue/100} onChange={this.handleSliderChange} />
                        :
                      null
                        */
                    }

                </CardActions>
            </div>
        )
    }

}

ControllableLoadingScene.propTypes = {

}

const LoadingSceneScenarios = () => {

    return (
        <ScenarioContainer>
            <ControllableLoadingScene />
        </ScenarioContainer>
    )
}

export default LoadingSceneScenarios
