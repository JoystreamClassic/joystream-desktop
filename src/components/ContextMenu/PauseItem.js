import React from 'react'
import Item from './Item'
import PropTypes from 'prop-types'

const PauseItem = (props) => {
  var pauseStatusProps

  if (props.paused) {
    pauseStatusProps = {
      onClick: props.onChangePauseStatus,
      className: 'continue-item',
      label: 'Continue'
    }
  } else {
    pauseStatusProps = {
      onClick: props.onChangePauseStatus,
      className: 'pause-item item-disabled',
      label: 'Pause'
    }
  }
  return (
    <Item {...pauseStatusProps} />
  )
}

PauseItem.propTypes = {
  paused: PropTypes.bool.isRequired,
  onChangePauseStatus: PropTypes.func.isRequired // whether paused or not
}

export default PauseItem
