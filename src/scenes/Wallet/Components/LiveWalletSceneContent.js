import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

// Components
import SendingDialog from './SendDialog'
import ReceiveDialog from './ReceiveDialog'
import ClaimFreeBCHFlowDialog from './ClaimFreeBCHFlowDialog'
import ViewHDSeedDialog from './ViewHDSeedDialog'

import {
  Label,
  LabelContainer,
  MiddleSection,
  SimpleLabel,
  Toolbar,
  ToolbarButton,
  MaxFlexSpacer,
  TorrentCountLabel,
  CurrencyLabel,
  WalletStatusLabel
} from  './../../../components/MiddleSection'

import PaymentsTable from './PaymentsTable'

// Stores
import {
  SendDialogStore,
  ReceiveDialogStore,
} from '../Stores'

function getStyles(props) {
  
  return {
    root : {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    middleSectionInnerContainer : {
      width: '950px',
      display: 'flex',
      alignItems: 'center'
    },
    paymentsTableContainer : {
      display : 'flex',
      flexGrow: 1,
      justifyContent : 'center',
      backgroundColor : props.uiConstantsStore.primaryColor
    }
  }
  
}

import SvgIcon from 'material-ui/SvgIcon'
import LoadingWalletSceneContent from "./LoadingWalletSceneContent";
import PropTypes from "prop-types";

const SendIcon = (props) => {
  
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M1.423,11.048L4,13l9-4l-6.977,5.499v6.749c0,0.933,1.164,1.358,1.765,0.644l3.131-3.72l6.5,4.876 c0.589,0.441,1.436,0.118,1.581-0.604l4.004-20c0.156-0.779-0.615-1.42-1.352-1.125l-20,8C0.928,9.609,0.799,10.58,1.423,11.048z"></path>
    </SvgIcon>
  )
}

const ReceiveIcon = (props) => {
  
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M11,11H0V0h11V11z M2,9h7V2H2V9z"></path>
      <path d="M24,11H13V0h11V11z M15,9h7V2h-7V9z"></path>
      <path d="M11,24H0V13h11V24z M2,22h7v-7H2V22z"></path>
      <polygon points="24,20 22,20 22,15 20,15 20,18 14,18 14,13 16,13 16,16 18,16 18,13 24,13 "></polygon>
      <polygon points="24,24 14,24 14,20 16,20 16,22 24,22 "></polygon>
      <rect data-color="color-2" x="4" y="4" width="3" height="3"></rect>
      <rect data-color="color-2" x="17" y="4" width="3" height="3"></rect>
      <rect data-color="color-2" x="4" y="17" width="3" height="3"></rect>
    </SvgIcon>
  )
  
}

const GetCoinsIcon = (props) => {

  return (
    <SvgIcon {...props}  viewBox={"0 0 24 24"}>
      <path d="M23,4h-4.184C18.928,3.686,19,3.352,19,3c0-1.654-1.346-3-3-3c-1.974,0-3.238,1.303-4,2.545 C11.239,1.303,9.974,0,8,0C6.346,0,5,1.346,5,3c0,0.352,0.072,0.686,0.184,1H1C0.448,4,0,4.447,0,5v2c0,0.553,0.448,1,1,1h22 c0.552,0,1-0.447,1-1V5C24,4.447,23.552,4,23,4z M16,2c0.551,0,1,0.448,1,1s-0.449,1-1,1h-2.531C13.939,3.083,14.757,2,16,2z M7,3 c0-0.552,0.449-1,1-1c1.243,0,2.061,1.083,2.531,2H8C7.449,4,7,3.552,7,3z"></path>
      <path d="M11,10H2v13c0,0.552,0.448,1,1,1h8V10z"></path>
      <path d="M22,10h-9v14h8c0.552,0,1-0.448,1-1V10z"></path>
    </SvgIcon>
  )
}


const SeedIcon = (props) => {
  
  return (
    <SvgIcon {...props} viewBox={"0 0 24 24"}>
      <path d="M23,22h-5.10059C17.43457,19.7207,15.41504,18,13,18v-2c2.76141,0,5-2.23859,5-5V9h-1 c-1.64331,0-3.08856,0.80353-4,2.02747V1h-2v5.02747C10.08856,4.80353,8.64331,4,7,4H6v2c0,2.76141,2.23859,5,5,5v7.42432 c-0.83911,0.36652-1.57001,0.95294-2.09961,1.71729C8.61035,20.04834,8.30664,20,8,20c-1.30371,0-2.41602,0.83594-2.8291,2H1 c-0.55273,0-1,0.44775-1,1s0.44727,1,1,1h22c0.55273,0,1-0.44775,1-1S23.55273,22,23,22z"></path>
    </SvgIcon>
  )
}

const LiveWalletSceneContent = inject('uiConstantsStore')(inject('UIStore')(observer((props) => {
  
  let styles = getStyles(props)
  
  let labelColorProps = {
    backgroundColorLeft : props.uiConstantsStore.darkPrimaryColor, // props.middleSectionDarkBaseColor,
    backgroundColorRight : props.uiConstantsStore.higlightColor // props.middleSectionHighlightColor
  }
  
  return (
    <div style={styles.root}>
      
      <MiddleSection backgroundColor={props.uiConstantsStore.primaryColor} height='120px'>
        
        <div style={styles.middleSectionInnerContainer}>
          
          <Toolbar>
            
            <ToolbarButton title="send"
                           onClick={() => { props.UIStore.walletSceneStore.sendClicked() }}
                           iconNode={<SendIcon color={"#ffffff"} style={{ height : '16px', width: '16px'}}/>}
            />
            
            <div style={{
              width: '10px',
              //backgroundColor: '#49a749',
              height: '55px'
            }}>
            </div>
            
            <ToolbarButton title="receive"
                           onClick={() => { props.UIStore.walletSceneStore.receiveClicked()}}
                           iconNode={<ReceiveIcon color={"#ffffff"} style={{ height : '16px', width: '16px'}}/>}
            />

            <div style={{
              width: '10px',
              //backgroundColor: '#49a749',
              height: '55px'
            }}>
            </div>

            <ToolbarButton title="backup"
                           onClick={() => { props.UIStore.walletSceneStore.viewWalletSeedClicked()}}
                           iconNode={<SeedIcon color={"#ffffff"} style={{ height : '16px', width: '16px'}}/>}
            />

            <div style={{
              width: '10px',
              //backgroundColor: '#49a749',
              height: '55px'
            }}>
            </div>

            {

              /** Only display free coins button if the user can actually claim them **/

              props.UIStore.walletSceneStore.allowAttemptToClaimFreeBCH
                && props.UIStore.walletSceneStore.totalBalance === 0
              ?
                <ToolbarButton title="free coins"
                               onClick={props.UIStore.walletSceneStore.claimFreeBCH}
                               iconNode={<GetCoinsIcon color={"#ffffff"} style={{ height : '16px', width: '16px'}}/>}
                               colors={
                                 {
                                   normalColor: '#4caf50',
                                   hoverColor: '#419544',
                                   activeColor: '#2c632d',
                                   borderBottomColor: '#3b873e'
                                 }
                               }
                />
              :
                null
            }

            { /**
             
             <ToolbarButton title="view seed"
             onClick={() => { console.log('view seed')}}
             iconNode={<SeedIcon color={"#ffffff"} style={{ height : '16px', width: '16px'}}/>}
             />
             **/
            }
          
          
          </Toolbar>
          
          <MaxFlexSpacer />
          
          <LabelContainer>
            {/* Disabled - high CPU utilization when animating circural progress
            <WalletStatusLabel synchronizationPercentage={props.UIStore.walletSceneStore.synchronizationPercentage}
                               {...labelColorProps}
            />*/}
            
            {/*<CurrencyLabel labelText={"PENDING"}
                           satoshies={props.UIStore.walletSceneStore.pendingBalance}
                           {...labelColorProps}
            />*/}
          
          </LabelContainer>
        
        </div>
      
      </MiddleSection>
      
      <div style={styles.paymentsTableContainer}>
        <PaymentsTable walletSceneStore={props.UIStore.walletSceneStore}/>
      </div>
      
      <SendingDialog sendDialogStore={props.UIStore.walletSceneStore.visibleDialog && props.UIStore.walletSceneStore.visibleDialog.constructor.name === 'SendDialogStore' ? props.UIStore.walletSceneStore.visibleDialog : null} />
      <ReceiveDialog receiveDialogStore={props.UIStore.walletSceneStore.visibleDialog && props.UIStore.walletSceneStore.visibleDialog.constructor.name === 'ReceiveDialogStore' ? props.UIStore.walletSceneStore.visibleDialog : null} />
      <ClaimFreeBCHFlowDialog claimFreeBCHFlowDialogStore={props.UIStore.walletSceneStore.visibleDialog && props.UIStore.walletSceneStore.visibleDialog.constructor.name === 'ClaimFreeBCHFlowStore' ? props.UIStore.walletSceneStore.visibleDialog : null} />
      <ViewHDSeedDialog viewHDSeedDialogStore={props.UIStore.walletSceneStore.visibleDialog && props.UIStore.walletSceneStore.visibleDialog.constructor.name === 'ViewHDSeedDialogStore' ? props.UIStore.walletSceneStore.visibleDialog : null}/>
    
    </div>
  )
})))

LiveWalletSceneContent.propTypes = {
  walletStore : PropTypes.object // can't use instanceof due to HMR bug
}


export default LiveWalletSceneContent
