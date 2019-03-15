/**
 * Created by bedeho on 24/03/2018.
 */
import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import {SceneExplainerBox} from '../Common'
import Radium from 'radium'
import SvgIcon from 'material-ui/SvgIcon'

const SettingContainer = (props) => {

  let styles = {
    root: {}
  }

  return (
    <div style={styles.root}>
      {props.children}
    </div>
  )
}

const SettingSpacer = (props) => {

  let style = {
    height: '20px'
  }

  return (<div style={style}></div>)
}

const SettingTitle = (props) => {

  let styles = {
    root:  {
      color: 'rgba(255, 255, 255, 0.8)',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px',
      marginLeft: '10px'
    }
  }

  return (
    <div style={styles.root}>
      {props.title}
    </div>
  )
}

const FolderIcon = (props) => {

  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M23.805,8.406C23.616,8.15,23.317,8,23,8h-2V5c0-0.552-0.447-1-1-1h-9.465L8.832,1.445 C8.646,1.167,8.334,1,8,1H1C0.447,1,0,1.448,0,2v19.978c-0.002,0.074,0.005,0.148,0.02,0.22c0.029,0.145,0.09,0.279,0.174,0.395 c0.087,0.118,0.199,0.217,0.333,0.289c0.099,0.053,0.208,0.091,0.323,0.108C0.9,22.997,0.95,23,1,23c0.008,0,0.016,0,0.023,0H19 c0.439,0,0.827-0.286,0.956-0.706l4-13C24.049,8.991,23.993,8.661,23.805,8.406z M2,3h5.465l1.703,2.555C9.354,5.833,9.666,6,10,6h9 v2H5C4.561,8,4.173,8.286,4.044,8.706L2,15.35V3z"></path>
    </SvgIcon>
  )
}

const ICON_COLOR = 'rgba(86, 120, 184, 1)'

const ChooseSetting = inject('UIStore')(observer(Radium((props) => {

  let styles = {
    root : {
      display: 'flex'
    },
    iconContainer :{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '10px'
    },
    inputField: {
      display: 'flex',
      borderRadius: '4px 0px 0px 4px',
      alignItems: 'center',
      flexGrow: '1',
      border: 'none',
      fontSize: '20px',
      padding: '10px',
      paddingLeft: '20px',
      //borderRadius: '4px 0px 0px 4px',
      backgroundColor: '#304873',
      color: 'rgba(255, 255, 255, 0.2)'
    },
    button : {
      display : 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: 'none',
      fontSize: '15px',
      fontWeight: 'bold',
      height: '70px',
      flex: '0 0 250px',
      borderRadius: '0px 4px 4px 0px',
      backgroundColor: '#293c61',
      color: 'white',

      ':hover' : {
        backgroundColor: 'rgba(30, 44, 72, 1)'
      }
    }
  }

  return (
    <div style={styles.root}>
      <div style={styles.inputField}>
        <span>{props.UIStore.applicationStore.applicationSettingsStore.downloadFolder}</span>
      </div>
      <button style={styles.button} onClick={props.UIStore.chooseNewDownloadFolder}>

        <div style={styles.iconContainer}>
          <FolderIcon color={'white'}/>
        </div>

        CHOOSE FOLDER
      </button>
    </div>
  )

})))

const DownloadFolderSetting = (props) => {

  return (
    <SettingContainer>
      <SettingTitle title="Download folder" tooltip="Explainer" />
      <ChooseSetting/>
    </SettingContainer>
  )
}

// Settings

function getStyles (props) {
  return {
    root : {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      backgroundColor: props.uiConstantsStore.primaryColor,
      alignItems: 'center',
      justifyContent: 'center'
    },
    explainerRoot: {
      width : '800px',
      display: 'flex',
      flexDirection: 'column'
    }

  }
}

const Settings = inject('uiConstantsStore')((props) => {

  let styles = getStyles(props)

  return (
    <div style={styles.root}>
      <SceneExplainerBox title="Settings"
                         explainer={
                           <div style={styles.explainerRoot}>

                             <SettingSpacer />

                             { /** save path settings **/ }
                             <DownloadFolderSetting/>

                             { /** <SettingSpacer /> **/ }

                           </div>
                         }
                         backgroundColor={'hsla(219, 41%, 40%, 1)'}
      />
    </div>
  )
})

export default Settings
