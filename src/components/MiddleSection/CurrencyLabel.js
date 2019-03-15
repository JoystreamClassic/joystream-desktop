/**
 * Created by bedeho on 19/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import SimpleLabel from  './SimpleLabel'
import currencyFormatter from 'currency-formatter'
import ReactTooltip from 'react-tooltip'

import {getCompactBitcoinUnits} from '../../common'

function getStyles(props) {

    return {
      root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        marginRight: '10px'
      },
      amount : {
        fontSize : '22px',
        fontFamily: 'Helvetica',
        fontWeight: '500',
        marginTop: '-4px',
        color: 'rgba(205, 215, 234, 1)'
      },
      amountUnit : {
        fontSize : '14px',
        fontFamily: 'Arial',
        fontWeight: 'bold',
        marginRight: '5px',
        color: 'rgba(255,255,255,0.5)'
      },
      amountFiat: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: '14px',
        marginTop: '-8px',
        //marginRight: '40px'
      }
    }

}

// NB: CurrencyLabel & BandwidthLabel really should just be using a "unit label" which
// supports the idea of having value&unit combo, that would be more resuable, as is its not great

import SvgIcon from 'material-ui/SvgIcon'

const PaymentIcon = (props) => {

  return (
    <SvgIcon viewBox="0 0 32 32" style={props.style}>
      <path fill={props.color} d="M7,10c-2.951,0-5.403-0.639-7-1.712V10c0,1.657,3.134,3,7,3s7-1.343,7-3V8.288C12.403,9.361,9.951,10,7,10z"></path>
      <ellipse fill={props.color} cx="7" cy="5" rx="7" ry="3"></ellipse> 
      <ellipse fill={props.color} cx="25" cy="9" rx="7" ry="3"></ellipse>
      <path fill={props.color} d="M17,23c-2.951,0-5.403-0.639-7-1.712V23c0,1.657,3.134,3,7,3s7-1.343,7-3v-1.712 C22.403,22.361,19.951,23,17,23z"></path>
      <path fill={props.color} d="M17,28c-2.951,0-5.403-0.639-7-1.712V28c0,1.657,3.134,3,7,3s7-1.343,7-3v-1.712 C22.403,27.361,19.951,28,17,28z"></path>
      <path fill={props.color} d="M25,14c-1.061,0-2.054-0.086-2.969-0.241c1.996,0.691,3.363,1.816,3.809,3.218 C29.309,16.798,32,15.535,32,14v-1.712C30.403,13.361,27.951,14,25,14z"></path>
      <path fill={props.color} d="M9.92,14.766C9.018,14.916,8.042,15,7,15c-2.951,0-5.403-0.639-7-1.712V15c0,1.657,3.134,3,7,3 c0.341,0,0.674-0.014,1.003-0.034C8.015,16.703,8.71,15.606,9.92,14.766z"></path>
      <ellipse fill={props.color} cx="17" cy="18" rx="7" ry="3"></ellipse>
      <path fill={props.color} d="M26,18.973v2.993c3.391-0.208,6-1.455,6-2.966v-1.712C30.588,18.237,28.504,18.845,26,18.973z"></path> 
      <path fill={props.color} d="M26,23.973v2.993c3.391-0.208,6-1.455,6-2.966v-1.712C30.588,23.237,28.504,23.845,26,23.973z"></path>
      <path fill={props.color} d="M8,19.973C7.673,19.989,7.341,20,7,20c-2.951,0-5.403-0.639-7-1.712V20c0,1.657,3.134,3,7,3 c0.34,0,0.673-0.014,1-0.034V19.973z"></path>
      <path fill={props.color} d="M8,24.973C7.673,24.989,7.341,25,7,25c-2.951,0-5.403-0.639-7-1.712V25c0,1.657,3.134,3,7,3 c0.34,0,0.673-0.014,1-0.034V24.973z"></path>
    </SvgIcon>
  )
}

const CurrencyLabel = (props) => {

  let styles = getStyles(props)

  let value = (
    <div style={styles.root} data-tip data-for={"currencyLabel"}>

      <span style={styles.amount}>
        <span style={styles.amountUnit}>BCH</span>
        {(props.satoshies/100000000).toFixed(8)}
      </span>

      <span style={styles.amountFiat}>
        { currencyFormatter.format(props.amountInFiat, { code: 'USD', precision: 4 }) }
      </span>

      {
        props.tooltip
          ?
          <ReactTooltip place='top'
                        effect='solid'
                        className="torrent_table_toolbar_tooltip"
                        id="currencyLabel"
          >
            {props.tooltip}
          </ReactTooltip>
          :
          null
      }

    </div>
  )

  return (
      <SimpleLabel labelNode={<PaymentIcon color={'rgba(165, 183, 217, 1)'}/>}
                   valueNode={value}
                   valueFieldWidth="173px"
                   {...props}
      />
  )

}

CurrencyLabel.propTypes = {
    tooltip : PropTypes.string.isRequired,
    satoshies : PropTypes.number.isRequired,
    amountInFiat : PropTypes.number,
    backgroundColorLeft : PropTypes.string.isRequired,
    backgroundColorRight : PropTypes.string.isRequired
}

export default CurrencyLabel