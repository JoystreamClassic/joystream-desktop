import React from 'react'
import Item from './Item'
import PropTypes from 'prop-types'

const RemoveItem = (props) => {
  return (
    <Item
      onClick={props.onRemoveClicked}
      className='remove-item'
      label='Remove' />
  ) // description="Remove from application only."
}

RemoveItem.propTypes = {
  onRemoveClicked: PropTypes.func.isRequired
}

export default RemoveItem
