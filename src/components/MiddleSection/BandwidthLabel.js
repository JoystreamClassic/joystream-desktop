/**
 * Created by bedeho on 20/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import SimpleLabel from  './SimpleLabel'
import ReactTooltip from 'react-tooltip'

import {convenientBytes} from '../../common'

function getStyles(props) {

    return {
        value : {
          marginRight : '3px',
          fontSize: '22px',
          color: 'rgba(205, 215, 234, 1)'
        },
        unit : {
          fontSize: '18px',
          color: 'rgba(255,255,255,0.5)'
        }
    }

}

import SvgIcon from 'material-ui/SvgIcon'

const DownIcon = (props) => {

  return (
    <SvgIcon viewBox="0 0 32 32" style={props.style}>
      <polygon fill={props.color} points="26,5.586 16,15.586 6,5.586 0.586,11 16,26.414 31.414,11 "></polygon>
    </SvgIcon>
  )
}

const UpIcon = (props) => {

  return(
    <SvgIcon viewBox="0 0 32 32" style={props.style}>
      <polygon fill={props.color} points="0.586,21 6,26.414 16,16.414 26,26.414 31.414,21 16,5.586 "></polygon>
    </SvgIcon>
  )
}

const BandwidthLabel = (props) => {

    let styles = getStyles(props)

    let representation

    if(!props.bytesPerSecond)
      representation = {
        value : null,
        unit: null
      }
    else
      representation = convenientBytes(props.bytesPerSecond)

    let value = (
        <div style={styles.root} data-tip data-for={"BandwidthLabel"}>
            <span style={styles.value}>{representation.value}</span>
            <span style={styles.unit}>{representation.unit ? representation.unit + '/s' : null}</span>

            {
              props.tooltip
                ?
                <ReactTooltip place='top'
                              effect='solid'
                              className="torrent_table_toolbar_tooltip"
                              id="BandwidthLabel"
                >
                  {props.tooltip}
                </ReactTooltip>
                :
                null
            }

        </div>
    )

    return (
        <SimpleLabel labelNode={
          props.isUp
            ?
          <UpIcon color='rgba(165, 183, 217, 1)' />
            :
          <DownIcon color='rgba(165, 183, 217, 1)' />
          }

           valueNode={value}
           valueFieldWidth="130px"
           {...props}
        />
    )

}

BandwidthLabel.propTypes = {
    tooltip : PropTypes.string.isRequired,
    isUp : PropTypes.bool.isRequired,
    bytesPerSecond : PropTypes.number,
    backgroundColorLeft : PropTypes.string.isRequired,
    backgroundColorRight : PropTypes.string.isRequired
}

export default BandwidthLabel