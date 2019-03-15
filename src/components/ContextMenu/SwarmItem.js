/**
 * Created by bedeho on 10/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import Item from './Item'

/**
 * Stateless react component for information box
 * @param props
 * @returns {XML}
 * @constructor
 */
const InfoBox = (props) => {
  return (
    <div className='info-box'>
      <span className='title'>{props.title}</span>
      <span className='value'>{props.value}</span>
    </div>
  )
}

InfoBox.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired
}

/**
 * Stateless react component for bittorrent swarm information box.
 * @param props : see .propTypes
 * @returns {XML}
 * @constructor
 */
const SwarmItem = (props) => {
  return (
    <Item className='swarm-item' label='Swarm'>
      <div className='info-box-container'>
        <InfoBox title='BUYERS' value={props.numberOfBuyers} />
        <InfoBox title='SELLERS' value={props.numberOfSellers} />
        <InfoBox title='OBSERVERS' value={props.numberOfObservers} />
        <InfoBox title='NORMAL' value={props.numberOfNormalPeers} />
      </div>
    </Item>
  )
}

SwarmItem.propTypes = {
  numberOfBuyers: PropTypes.number.isRequired,
  numberOfSellers: PropTypes.number.isRequired,
  numberOfObservers: PropTypes.number.isRequired,
  numberOfNormalPeers: PropTypes.number.isRequired
}

SwarmItem.InfoBox = InfoBox

export default SwarmItem
