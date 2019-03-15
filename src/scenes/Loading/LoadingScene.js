/**
 * Created by bedeho on 02/06/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import LoadingState from './LoadingState'
import SplashProgress from '../../components/SplashProgress'
import FullScreenContainer from '../../components/FullScreenContainer'

function progressTextFromLoadingState(state) {

    let text = null

    switch(state) {

        case LoadingState.InitializingResources:
            text = 'Starting database, wallet and BitTorrent node'
            break

        case LoadingState.OpeningApplicationDatabase:
            text = 'Opening the application database'
            break

        case LoadingState.InitializingSPVNode:
            text = 'Initializing SPV node'
            break

        case LoadingState.OpeningWallet:
            text = 'Opening wallet'
            break

        case LoadingState.ConnectingToBitcoinP2PNetwork:
            text = 'Connecting to Bitcoin peer network'
            break

        case LoadingState.LoadingTorrents:
            text = 'Loading torrents'
            break
    }

    return text
}

const LoadingScene = (props) => {

    let text = props.show ? progressTextFromLoadingState(props.loadingState) : ''
    let percentage = props.show ? 100 * (props.loadingState + 1) / (Object.keys(LoadingState).length) : 0

    return (
        <FullScreenContainer> { /** Dropping fadeout: className={!props.show ? 'fadeout' : ''} **/}
            <SplashProgress progressText={text}
                            progressPercentage={percentage}

            />
        </FullScreenContainer>
    )

}

LoadingScene.propTypes = {
    show : PropTypes.bool.isRequired,
    loadingState : PropTypes.oneOf(Object.values(LoadingState)),
}

LoadingScene.defaultProps = {
    show : true
}

export default LoadingScene
