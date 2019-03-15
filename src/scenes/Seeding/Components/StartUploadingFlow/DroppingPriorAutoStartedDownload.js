/**
 * Created by bedeho on 28/03/2018.
 */

import React from 'react'
import PropTypes from 'prop-types'

import { InnerDialogHeading } from '../../../../components/FullScreenDialog'

function getStyles (props) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      flexGrow: '1'
    },
    progress : {
      marginTop: '100px'
    }
  }
}

import CircularProgress from 'material-ui/CircularProgress'

const DroppingPriorAutoStartedDownload = (props) => {

  let styles = getStyles(props)

  return (
    <InnerDialogHeading title='Dropping download'>
      <div style={styles.container}>

        <CircularProgress size={120} thickness={5} style={styles.progress}/>

      </div>
    </InnerDialogHeading>
  )
}

DroppingPriorAutoStartedDownload.propTypes = {
  uploadingStore: PropTypes.object.isRequired
}

export default DroppingPriorAutoStartedDownload