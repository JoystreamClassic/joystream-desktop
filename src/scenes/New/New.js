/**
 * Created by bedeho on 27/02/2018.
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
    explainerRoot: {
      width : '500px',
      display: 'flex',
      flexDirection: 'column'
    }

  }
}

const New = inject('uiConstantsStore')(inject('UIStore')((props) => {

  let styles = getStyles(props)

  return (
    <div style={styles.root}>
      <SceneExplainerBox title="New content"
                         explainer={
                           <div style={styles.explainerRoot}>
                             <div style={styles.explainer}>
                               This tab will contain information and features related to publishing of new content from publishers you are subscribed to.
                             </div>
                             <div style={{ fontWeight: 'bold', marginTop: '20px'}}>Will be enabled in future release.</div>
                           </div>
                         }
                         backgroundColor={'hsla(219, 41%, 40%, 1)'}
      />
    </div>
  )
}))

export default New
