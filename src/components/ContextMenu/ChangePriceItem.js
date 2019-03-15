import React from 'react'
import Item from './Item'
import PropTypes from 'prop-types'
import isRequiredIf from 'react-proptype-conditional-require'

const ChangePriceItem = (props) => {
  var changePriceProps

  if (props.changePriceEnabled) {
    changePriceProps = {
      onClick: props.onChangePriceClicked,
      className: 'change-price-item'
    }
  } else {
    changePriceProps = {
      onClick: null,
      className: 'change-price-disabled-item item-disabled'
    }
  }

  return (
    <Item {...changePriceProps}
      label='Change price' />
  )
}

ChangePriceItem.propTypes = {
  changePriceEnabled: PropTypes.bool.isRequired,
  onChangePriceClicked: isRequiredIf(PropTypes.func, props => props.changePriceEnabled, 'onChangePriceClicked is required when changePriceEnabled is true')
}

export default ChangePriceItem
