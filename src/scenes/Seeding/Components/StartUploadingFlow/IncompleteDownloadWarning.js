/**
 * Created by bedeho on 30/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import { InnerDialogHeading, TransparentButton } from '../../../../components/FullScreenDialog'
import ElevatedAutoLitButton from '../../../../components/ElevatedAutoLitButton'

function getStyles (props) {
  return {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    subtitle: {
      padding: '20px',
      marginTop: '30px',
      width: '800px'
    },
    completedText: {
      fontWeight: 'bold'
    },
    folderLocationContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '30px'
    },
    folderLocation: {
      textAlign: 'center',
      padding: '10px',
      paddingLeft: '30px',
      paddingRight: '30px',
      borderRadius: '60px',
      backgroundColor: 'hsla(0, 0%, 90%, 1)',
      fontSize: '22px',
      fontWeight: 'bold'
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '50px'
    },
    buttonSpacer: {
      width: '100px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      fontStyle: 'italic'
    }
  }
}

const IncompleteDownloadWarning = (props) => {
  let styles = getStyles(props)

  let savePath = props.uploadingStore.torrentStoreBeingAdded.savePath

  return (
    <InnerDialogHeading title='Missing download'>
      <div style={styles.container}>

        <div style={styles.subtitle}>
          Downloading was started since you are missing a <span style={styles.completedText}>complete</span> download in the provided folder.
        </div>

        <div style={styles.folderLocationContainer}>
          <div style={styles.folderLocation}>{savePath}</div>
        </div>

        <div style={styles.buttonContainer}>

          <TransparentButton label='Drop download'
            onClick={() => { props.uploadingStore.dropDownloadClicked() }} />

          <div style={styles.buttonSpacer}>
            <span>or</span>
          </div>

          <ElevatedAutoLitButton title='Ok, keep going'
            onClick={() => { props.uploadingStore.keepDownloadingClicked() }}
            hue={212}
            saturation={100} />

        </div>
      </div>
    </InnerDialogHeading>
  )
}

/**
green
hue={120}
saturation={40}

blue
hue={212}
saturation={100}
*/

IncompleteDownloadWarning.propTypes = {
  uploadingStore: PropTypes.object.isRequired
}

export default IncompleteDownloadWarning
