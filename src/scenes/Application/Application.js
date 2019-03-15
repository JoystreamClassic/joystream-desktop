import React, { Component } from 'react'
import { Provider, observer } from 'mobx-react'
import PropTypes from 'prop-types'

// Utils
import MobxReactDevTools from 'mobx-react-devtools'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import assert from 'assert'

// Models
import {UI_CONSTANTS} from '../../constants'
import UIStore from '../UIStore'
import ApplicationNavigationStore from './Stores'

// Components
import ApplicationHeader from './components/ApplicationHeader'
import ApplicationStatusBar from './components/ApplicationStatusBar'

// Our scenes
import TermsScreen from '../Terms'
import IdleScene from '../Idle'
import NotStartedScene from '../NotStarted'
import LoadingScene from '../Loading'
import TerminatingScene from '../Terminating'
import Downloading from '../Downloading'
import Seeding from '../Seeding'
import Completed from '../Completed'
import Community from '../Community'
import VideoPlayerScene from '../VideoPlayer'
import Wallet from '../Wallet'
import { WelcomeScreen, DepartureScreen } from '../Onboarding'
import OnBoardingStore from '../Onboarding/Stores'
import Livestream from '../Livestream'
import New from '../New'
import Publish from '../Publish'
import Settings from '../Settings'


function getStyles (props) {
  return {
    innerRoot: {
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'row'
    }
  }
}

const Application = observer((props) => {
  
  let styles = getStyles(props)

  return (
    <MuiThemeProvider>
      <Provider uiConstantsStore={UI_CONSTANTS} UIStore={props.UIStore}>
        <div style={styles.innerRoot}>
          
          <AppView UIStore={props.UIStore} />
          
          {
              props.displayMobxDevTools
            ?
              <div><MobxReactDevTools /></div>
            :
              null
          }
          
        </div>
      </Provider>
    </MuiThemeProvider>
  )
})

Application.propTypes = {
  UIStore : PropTypes.object.isRequired, // HMR breaks PropTypes.instanceOf(UIStore)
  displayMobxDevTools : PropTypes.bool.isRequired
}

const AppView = observer((props) => {

  let elm = null

  switch (props.UIStore.currentPhase) {
    
    case UIStore.PHASE.Idle:
      elm = <IdleScene />
      break

    case UIStore.PHASE.Alive:
      elm =
        <StartedApp
          UIStore={props.UIStore}
        />
      break
    
    default:
      assert(false)
  }
  
  return (
    elm
  )
 
})

const StartedApp = observer((props) => {
  
  let middleSectionColorProps = {
    middleSectionBaseColor : UI_CONSTANTS.primaryColor,
    middleSectionDarkBaseColor : UI_CONSTANTS.darkPrimaryColor,
    middleSectionHighlightColor : UI_CONSTANTS.higlightColor
  }
  
  let styles = {
    root : {
      height: "100%",
      width: "100%",
    },
    applicationHeaderContainer: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      height: "100%", // quick hack
    }
  }
  
  //
  let elm = null
  
  switch(props.UIStore.applicationNavigationStore.activeTab) {
    
    case ApplicationNavigationStore.TAB.Downloading:
      
      elm =
        <Downloading
          {...middleSectionColorProps}
        />
      break
    
    case ApplicationNavigationStore.TAB.Uploading:
      
      elm =
        <Seeding
          {...middleSectionColorProps}
        />
      break
    
    case ApplicationNavigationStore.TAB.Completed:
      
      elm =
        <Completed
          {...middleSectionColorProps}
        />
      break
    
    case ApplicationNavigationStore.TAB.Wallet:
      
      elm =
        <Wallet
          backgroundColor={UI_CONSTANTS.primaryColor}
          {...middleSectionColorProps}
        />
      break
    
    case ApplicationNavigationStore.TAB.Community:
      
      elm =
        <Community
          backgroundColor={UI_CONSTANTS.primaryColor}
        />
      break

    case ApplicationNavigationStore.TAB.Livestream:

      elm = <Livestream />
      break

    case ApplicationNavigationStore.TAB.New:

      elm = <New />
      break

    case ApplicationNavigationStore.TAB.Publish:

      elm = <Publish />
      break

    case ApplicationNavigationStore.TAB.Settings:
      elm = <Settings/>
      break

    default:
      assert(false, 'Not covering ApplicationNavigationStore.TAB cases')
  }

  return (
    <div style={styles.root}>

      { /* Terms scene */ }
      <TermsScreen show={props.UIStore.alivePhaseScene === UIStore.ALIVE_PHASE_SCENE.Terms}
                   exitOnClick={props.UIStore.handleTermsRejected}
                   iAcceptOnClick={props.UIStore.handleTermsAccepted}
      />

      { /* Onboarding scenes */ }
      <WelcomeScreen show={props.UIStore.alivePhaseScene === UIStore.ALIVE_PHASE_SCENE.OnboardingWelcome}
                     onBoardingStore={props.UIStore.onboardingStore}
      />

      <DepartureScreen show={props.UIStore.alivePhaseScene === UIStore.ALIVE_PHASE_SCENE.OnboardingDeparture}
                       onBoardingStore={props.UIStore.onboardingStore}
      />

      <ApplicationStatusBar show={props.UIStore.showCheckingTorrentProgress}
                            startingTorrentCheckingProgressPercentage={props.UIStore.startingTorrentCheckingProgressPercentage}
      />

      <VideoPlayerScene show={props.UIStore.alivePhaseScene === UIStore.ALIVE_PHASE_SCENE.VideoPlayer}
                        activeMediaPlayerStore={props.UIStore.mediaPlayerStore}
      />

      { props.UIStore.alivePhaseScene === UIStore.ALIVE_PHASE_SCENE.Main ?
        <div style={styles.applicationHeaderContainer}>
          <ApplicationHeader
            UIStore={props.UIStore}
            height={'90px'}
            accentColor={UI_CONSTANTS.primaryColor} />
          {elm}
        </div>
        : null
      }

    </div>
  )

})

export default Application
