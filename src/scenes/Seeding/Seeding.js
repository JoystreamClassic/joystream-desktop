import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import Radium from 'radium'
import ReactTooltip from 'react-tooltip'

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
} from  './../../components/MiddleSection'

import TorrentTable from './Components/TorrentTable'
import StartUploadingFlow from './Components/StartUploadingFlow'

function getStyles (props) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }
  }
}

const EarnMoneyExplainer = Radium((props) => {

  let styles = {
    explainerContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    explainerTextDiv: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '14px',
      backgroundColor: '#3e5c93',
      color: '#a5b7d9',
      paddingLeft: '15px',
      paddingRight: '15px',
      borderRadius: '40px',
      height: '30px',

      ':hover' :  {
        color: 'white'
      }
    },
    toolTipStyle: {
      width: '350px',
      fontSize: '18px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingTop: '18px',
      paddingBottom: '18px'
    }
  }

  return (
    <div style={styles.explainerContainer}>
      <span style={styles.explainerTextDiv}
            data-tip
            data-for={"explainer-tooltip"}>
        When will I earn money?
      </span>
      <ReactTooltip id={"explainer-tooltip"}
                    place='bottom'
                    effect='solid'
                    multiline={true}
      >
        <div style={styles.toolTipStyle}>
          Earning money may take time as it requires both that buyers are joining the torrent swarm to buy, and that you are picked out for the trade among all the sellers that are currently available on the same swarm.

          <span style={{fontWeight : 'bold', paddingLeft: '5px'}}>Be patient.</span>
        </div>
      </ReactTooltip>
    </div>
  )
})

const Seeding = inject('UIStore')(observer((props) => {

  let styles = getStyles(props)

  let labelColorProps = {
    backgroundColorRight: props.middleSectionHighlightColor,
    backgroundColorLeft: props.middleSectionDarkBaseColor
  }

  let displayedSpeed = props.UIStore.uploadingStore.totalUploadSpeed > 3000 ? props.UIStore.uploadingStore.totalUploadSpeed : null

  return (
    <div style={styles.root}>

      <MiddleSection backgroundColor={props.middleSectionBaseColor} height="120px">

        <Toolbar>

          <ToolbarButton title="add upload"
                         onClick={() => { props.UIStore.uploadingStore.startTorrentUploadFlowWithFilePicker() }}
                         iconNode={<AddTorrentIcon color={"#ffffff"} style={{ height : '16px', width: '16px'}} />}
          />

        </Toolbar>

        <MaxFlexSpacer />

        <LabelContainer>

          { /**
           <TorrentCountLabel count={props.UIStore.uploadingStore.torrentRowStores.length}
           {...labelColorProps} />
           **/
          }

          { /** Explainer **/}

          <EarnMoneyExplainer />



          <CurrencyLabel tooltip={'Total revenue from uploads'}
                         satoshies={props.UIStore.totalRevenueFromPieces}
                         amountInFiat={props.UIStore.totalRevenueFromPiecesInFiat}
            {...labelColorProps} />

          <BandwidthLabel tooltip={'Total upload speed'}
                          isUp={true}
                          bytesPerSecond={displayedSpeed}
            {...labelColorProps} />

        </LabelContainer>
      </MiddleSection>

      <TorrentTable uploadingStore={props.UIStore.uploadingStore}/>

      <StartUploadingFlow uploadingStore={props.UIStore.uploadingStore} />

    </div>
  )
}))

Seeding.propTypes = {
  middleSectionBaseColor: PropTypes.string.isRequired,
  middleSectionDarkBaseColor: PropTypes.string.isRequired,
  middleSectionHighlightColor: PropTypes.string.isRequired
}

export default Seeding
