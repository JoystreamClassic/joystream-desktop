/**
 * Created by bedeho on 26/02/2018.
 */

import React from 'react'
import { inject } from 'mobx-react'
import {SceneExplainerBox} from '../Common'

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
    explainer: {
      width : '550px'
    }

  }
}

const Livestream = inject('uiConstantsStore')(inject('UIStore')((props) => {

  let styles = getStyles(props)

  return (
    <div style={styles.root}>
      <SceneExplainerBox title="Livestreaming"
                         explainer={
                           <div style={styles.explainerRoot}>
                             <div style={styles.explainer}>
                               This tab will contain information and features related to peer-to-peer livestreaming on the JoyStream network. You will be able to stream right from your desktop screen, server or phone.
                             </div>
                             <div style={{ fontWeight: 'bold', marginTop: '20px'}}>Will be enabled in future release.</div>
                           </div>
                         }
                         backgroundColor={'hsla(219, 41%, 40%, 1)'}
      />
    </div>
  )
}))

export default Livestream
