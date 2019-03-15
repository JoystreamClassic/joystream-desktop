/**
 * Created by bedeho on 25/07/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import TerminatingState from './TerminatingState'
import SplashProgress from '../../components/SplashProgress'
import FullScreenContainer from '../../components/FullScreenContainer'

function progressTextFromTerminatingState(state) {

    let text = null

    switch(state) {

        case TerminatingState.TerminatingTorrents:
            text = 'Stopping and storing torrents'
            break

        case TerminatingState.DisconnectingFromBitcoinNetwork:
            text = 'Disconnecting from Bitcoin peer network'
            break

        case TerminatingState.ClosingWallet:
            text = 'Closing wallet'
            break

        case TerminatingState.StoppingSpvNode:
            text = 'Stopping SPV node'
            break

        case TerminatingState.ClosingApplicationDatabase:
            text = 'Closing the application database'
            break

        case TerminatingState.ClearingResources:
            text = 'Stopping database, wallet and BitTorrent node'
            break
    }

    return text
}


const TerminatingScene = (props) => {

    let style = {
        opacity : 0
    }

    let text = props.show ? progressTextFromTerminatingState(props.terminatingState) : ''
    let percentage = props.show ? 100 * (props.terminatingState + 1) / (Object.keys(TerminatingState).length) : 0

    return (
        <FullScreenContainer
                             > { /** Dropping fadein: className={props.show ? 'fadein' : ''} style={style} **/ }
            <SplashProgress progressText={text}
                            progressPercentage={percentage}
            />
        </FullScreenContainer>
    )
}

TerminatingScene.propTypes = {
    show : PropTypes.bool.isRequired,
    terminatingState : PropTypes.oneOf(Object.values(TerminatingState)),
}

TerminatingScene.defaultProps = {
    show : true
}

export default TerminatingScene
