import React from 'react'
import Item from './Item'
import PropTypes from 'prop-types'

const RemoveAndDeleteDataItem = (props) => {
  return (
    <Item
      onClick={props.onRemoveAndDeleteDataClicked}
      className='remove-and-delete-data-item'
      label='Remove & delete data' />
  )  // description="Removes item from application, and all downloaded data is deleted."
}

RemoveAndDeleteDataItem.propTypes = {
  onRemoveAndDeleteDataClicked: PropTypes.func.isRequired
}

export default RemoveAndDeleteDataItem
