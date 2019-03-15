import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Wallet from '../../../core/Wallet'
import BCHInformationNoticeSceneContent from './BCHInformationNoticeSceneContent'
import LoadingWalletSceneContent from './LoadingWalletSceneContent'
import LiveWalletSceneContent from './LiveWalletSceneContent'

const WalletScene = inject('UIStore')(observer((props) => {
  
  let walletStore = props.UIStore.applicationStore.walletStore

  if(props.UIStore.onboardingStore && props.UIStore.onboardingStore.showBCHNoticeInWallet)
    return <BCHInformationNoticeSceneContent onAcceptClick={props.UIStore.onboardingStore.acceptBCHInformationNotice}
                                             onClickWhyBCH={props.UIStore.onboardingStore.whyBCH}/>
  else if(!walletStore || walletStore.state !== Wallet.STATE.STARTED)
    return <LoadingWalletSceneContent walletStore={walletStore}/>
  else
    return <LiveWalletSceneContent/>
  

}))

export default WalletScene
