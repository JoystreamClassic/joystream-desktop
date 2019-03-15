import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'

import DownloadingStore from './Stores'

// Components
import TorrentTable from './components/TorrentTable'
import StartDownloadingFlow from './components/StartDownloadingFlow'
import CircularProgress from 'material-ui/CircularProgress'

import {
    LabelContainer,
    MiddleSection,
    Toolbar,
    ToolbarButton,
    MaxFlexSpacer,
    TorrentCountLabel,
    CurrencyLabel,
    BandwidthLabel,
    AddTorrentIcon
} from './../../components/MiddleSection'

function getStyles (props) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    },
    circularProgress : {
    },
  }
}

const Downloading = inject('UIStore')(observer((props) => {
  
  let styles = getStyles(props)
  
  let labelColorProps = {
    backgroundColorLeft : props.middleSectionDarkBaseColor,
    backgroundColorRight : props.middleSectionHighlightColor
  }

  let allowUserToAddTorrent = props.UIStore.downloadingStore.state === DownloadingStore.STATE.InitState

  return (
    <div style={styles.root}>

      <MiddleSection backgroundColor={props.middleSectionBaseColor} height="120px">

        <Toolbar>

          <ToolbarButton title="add download"
                         onClick={() => { props.UIStore.downloadingStore.startDownloadWithTorrentFileFromFilePicker() }}
                         iconNode={
                           allowUserToAddTorrent
                             ?
                           <AddTorrentIcon color={"#ffffff"} style={{ height : '16px', width: '16px'}}/>
                             :
                           <CircularProgress color={'rgba(255,255,255, 1)'}
                                             size={16}
                                             style={styles.circularProgress}
                           />
                         }
                         enabled={allowUserToAddTorrent}
          />

        </Toolbar>

        <MaxFlexSpacer />

        <LabelContainer>

          { /**
           <TorrentCountLabel count={props.UIStore.downloadingStore.torrentRowStores.length}
           {...labelColorProps}
           />
           **/
          }

          <CurrencyLabel tooltip={"Total spending on downloads"}
                         satoshies={props.UIStore.totalSpendingOnPieces}
                         amountInFiat={props.UIStore.totalSpendingOnPiecesInFiat}
                         {...labelColorProps}
          />

          <BandwidthLabel tooltip={"Total download speed"}
                          isUp={false}
                          bytesPerSecond={props.UIStore.downloadingStore.totalDownloadSpeed}
                          {...labelColorProps}
          />

        </LabelContainer>

      </MiddleSection>

      <TorrentTable downloadingStore={props.UIStore.downloadingStore}/>

      <StartDownloadingFlow downloadingStore={props.UIStore.downloadingStore}/>

    </div>
  )

}))

Downloading.propTypes = {
  middleSectionBaseColor: PropTypes.string.isRequired,
  middleSectionDarkBaseColor: PropTypes.string.isRequired,
  middleSectionHighlightColor: PropTypes.string.isRequired
}

export default Downloading
