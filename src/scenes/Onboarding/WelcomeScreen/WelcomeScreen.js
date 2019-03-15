/**
 * Created by bedeho on 04/10/17.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'

import FullScreenContainer from '../../../components/FullScreenContainer'
import OnboardingStore from '../Stores'
import WelcomeScreenContent from './WelcomeScreenContent'

const WelcomeScreen = observer((props) => {
    
    return (
        props.show
            ?
        <FullScreenContainer>
            <WelcomeScreenContent onboardingStore={props.onBoardingStore} />
        </FullScreenContainer>
            :
        null
    )

})

WelcomeScreen.propTypes = {
  show : PropTypes.bool.isRequired,
  onBoardingStore : PropTypes.object
}

export default WelcomeScreen
