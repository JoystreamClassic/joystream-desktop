import React from 'react'
import PropTypes from 'prop-types'
import IconButton from 'material-ui/IconButton'

const CommunityButton = (props) => {
  return (
    <IconButton tooltip={props.title} onClick={props.onClick}>
      {props.icon}
    </IconButton> 
  )
}

CommunityButton.propTypes = {
  title: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.node.isRequired
}

export default CommunityButton
