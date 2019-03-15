/**
 * Created by bedeho on 06/10/2017.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import FullScreenContainer from '../../../components/FullScreenContainer'
import OnboardingStore from '../Stores'
import DepartureScreenContent from './DepartureScreenContent'

const DepartureScreen = observer((props) => {

    return (
        props.onBoardingStore &&
        props.onBoardingStore.state === OnboardingStore.STATE.DepartureScreen
            ?
            <FullScreenContainer>
                <DepartureScreenContent onboardingStore={props.onBoardingStore} />
            </FullScreenContainer>
            :
            null
    )

})

DepartureScreen.propTypes = {
  onBoardingStore: PropTypes.object
}

export default DepartureScreen
