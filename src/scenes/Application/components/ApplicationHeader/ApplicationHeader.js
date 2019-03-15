import React from 'react'
import PropTypes from 'prop-types'
import { observer, inject } from 'mobx-react'
import { Header } from '../../../../components/Header'
import ButtonGroup from './ButtonGroup'
import WalletPanel from './WalletPanel'
import {
  UploadButton,
  DowloadButton,
  FinishedButton,
  WalletButton,
  CommunityButton,
  LivestreamButton,
  NewButton,
  PublishButton,
  SettingsButton
} from './Buttons'

import UIStore from '../../../UIStore'
import ApplicationNavigationStore from '../../Stores'

/**
 * ApplicationHeader
 */

const dot = (props) => {

  return (
    <div style={{ display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flex: '0 0 10px'}}>
      <div style={{
        backgroundColor: 'rgba(125, 139, 145, 0.5)',
        width: '6px',
        height: '6px',
        borderRadius: '11px'
      }}></div>
    </div>
  )
}

function getStyle (props) {
  return {
    root: {
      backgroundColor: props.baseColor,
      // borderBottom: '4px solid ' + props.accentColor,
      flex: '0 0 ' + props.height, // prevent resizing
      height: props.height
    },
    seperator: {
      width: '2px',
      backgroundColor: props.separatorColor,
      marginTop: '15px',
      marginBottom: '15px'
    },
    spacer: {
      flexGrow: 1
    }
  }
}

const ApplicationHeader = inject('UIStore')(observer((props) => {

  var style = getStyle(props)

  var buttonColorProps = {
    rootColors : {
      normal : props.baseColor,
      hover : props.attentionColor,
      selected : props.attentionColor // props.accentColor
    },
    contentColors : {
      normal : props.faceColor,
      hover : props.activeFaceColor,
      selected : props.activeFaceColor,
      disabled: props.faceColor //props.separatorColor
    },
    notificationColor : props.notificationColor
  }

  let applicationNavigationStore = props.UIStore.applicationNavigationStore
  let activeTab = applicationNavigationStore.activeTab

  return (
    <Header style={style.root}>

      <ButtonGroup separatorColor={props.separatorColor}>

        <DowloadButton
          selected={activeTab === ApplicationNavigationStore.TAB.Downloading}
          onClick={() => { applicationNavigationStore.setActiveTab(ApplicationNavigationStore.TAB.Downloading) }}
          style={style.button}
          {...buttonColorProps}
        />

        <UploadButton
          selected={activeTab === ApplicationNavigationStore.TAB.Uploading}
          onClick={() => { applicationNavigationStore.setActiveTab(ApplicationNavigationStore.TAB.Uploading) }}
          style={style.button}
          {...buttonColorProps}
        />

        <FinishedButton
          selected={activeTab === ApplicationNavigationStore.TAB.Completed}
          notificationCount={applicationNavigationStore.numberCompletedInBackground}
          onClick={() => { applicationNavigationStore.setActiveTab(ApplicationNavigationStore.TAB.Completed) }}
          style={style.button}
          {...buttonColorProps}
        />

        <WalletButton
          selected={activeTab === ApplicationNavigationStore.TAB.Wallet}
          onClick={() => { applicationNavigationStore.setActiveTab(ApplicationNavigationStore.TAB.Wallet) }}
          style={style.button}
          {...buttonColorProps}
        />

        <CommunityButton
          selected={activeTab === ApplicationNavigationStore.TAB.Community}
          onClick={() => { applicationNavigationStore.setActiveTab(ApplicationNavigationStore.TAB.Community) }}
          style={style.button}
          {...buttonColorProps}
        />

        <LivestreamButton
          selected={activeTab === ApplicationNavigationStore.TAB.Livestream}
          onClick={() => { applicationNavigationStore.setActiveTab(ApplicationNavigationStore.TAB.Livestream)}}
          style={style.button}
          {...buttonColorProps}
        />

        <NewButton
          selected={activeTab === ApplicationNavigationStore.TAB.New}
          onClick={() => { applicationNavigationStore.setActiveTab(ApplicationNavigationStore.TAB.New)}}
          style={style.button}
          {...buttonColorProps}
        />

        <PublishButton
          selected={activeTab === ApplicationNavigationStore.TAB.Publish}
          onClick={() => { applicationNavigationStore.setActiveTab(ApplicationNavigationStore.TAB.Publish)}}
          style={style.button}
          {...buttonColorProps}
        />

        <SettingsButton
          selected={activeTab === ApplicationNavigationStore.TAB.Settings}
          onClick={() => { applicationNavigationStore.setActiveTab(ApplicationNavigationStore.TAB.Settings)}}
          style={style.button}
          {...buttonColorProps}
        />

      </ButtonGroup>

      <div style={style.spacer} />

      <WalletPanel
        applicationNavigationStore={applicationNavigationStore}

        backgroundColor={props.baseColor}
        balanceColor={props.balanceColor}
        subtitleColor={props.faceColor}>

      </WalletPanel>

    </Header>
  )

}))

ApplicationHeader.propTypes = {
  height: PropTypes.string.isRequired,
  baseColor: PropTypes.string,
  attentionColor: PropTypes.string,
  accentColor: PropTypes.string.isRequired,
  notificationColor: PropTypes.string,
  balanceColor: PropTypes.string,
  separatorColor: PropTypes.string
}

ApplicationHeader.defaultProps = {
  baseColor : '#1c262b',
  attentionColor : '#1c262b', // '#7d8b91',
  notificationColor : '#c9302c', //'#c52578',
  balanceColor : 'white',
  faceColor : '#7d8b91',
  activeFaceColor : 'white',
  separatorColor : '#242f35'
}

export default ApplicationHeader
