/**
 * Created by bedeho on 08/12/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

import SvgIcon from 'material-ui/SvgIcon'

const AddTorrentIcon = (props) => {

  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="M23,9h-8V1c0-0.6-0.4-1-1-1h-4C9.4,0,9,0.4,9,1v8H1c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1h8v8c0,0.6,0.4,1,1,1 h4c0.6,0,1-0.4,1-1v-8h8c0.6,0,1-0.4,1-1v-4C24,9.4,23.6,9,23,9z"></path>
    </SvgIcon>
  )
}

export default AddTorrentIcon