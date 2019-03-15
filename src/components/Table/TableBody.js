/**
 * Created by bedeho on 23/03/2018.
 */

import React from 'react'
import PropTypes from 'prop-types';

function getStyle(props) {

  return {
    root: {

    }
  }
}

const TableBody = (props) => {

  let styles = getStyle(props)

  return (
    <div className="content osx_scrollbar">
      {props.children}
    </div>
  )

}

export default TableBody
