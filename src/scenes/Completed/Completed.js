import React, { Component } from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import {
  LabelContainer,
  MiddleSection,
  MaxFlexSpacer,
  TorrentCountLabel,
  CurrencyLabel
} from './../../components/MiddleSection'

import { TorrentTable } from './components'

function getStyles (props) {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1
    }
  }
}

const Completed = inject('UIStore')(observer((props) => {
  
  let styles = getStyles(props)
  
  let labelColorProps = {
    backgroundColorLeft: props.middleSectionDarkBaseColor,
    backgroundColorRight: props.middleSectionHighlightColor
  }
  
  return (
    <div style={styles.root}>
      
      <MiddleSection backgroundColor={props.middleSectionBaseColor} height="120px">
        
        <MaxFlexSpacer />

        <LabelContainer>

          { /**
           <TorrentCountLabel
           count={props.UIStore.completedStore.torrentRowStores.length}
           {...labelColorProps} />
           **/
          }

          <CurrencyLabel
            tooltip={'Total spending on downloads'}
            satoshies={props.UIStore.totalSpendingOnPieces}
            amountInFiat={props.UIStore.totalSpendingOnPiecesInFiat}
            {...labelColorProps} />

          <CurrencyLabel
            tooltip={'Total revenue from uploads'}
            satoshies={props.UIStore.totalRevenueFromPieces}
            amountInFiat={props.UIStore.totalRevenueFromPiecesInFiat}
            {...labelColorProps} />
        </LabelContainer>
      </MiddleSection>

      <TorrentTable completedStore={props.UIStore.completedStore}/>

    </div>
  )
  
}))

Completed.propTypes = {
  middleSectionBaseColor: PropTypes.string.isRequired,
  middleSectionDarkBaseColor: PropTypes.string.isRequired,
  middleSectionHighlightColor: PropTypes.string.isRequired
}

export default Completed
