/**
 * Created by bedeho on 23/03/2018.
 */

import React from 'react'
import PropTypes from 'prop-types';

function getStyle(props) {

  return {
    root: {
      display: 'flex',
      flexDirection: 'row',

      // Lateral padding must match total offset on row field
      paddingLeft: '20px',
      paddingRight: '33px', // 20px + + $scrollbar-width=13px

      flex : '0 0 45px',

      fontFamily: 'Arial', //$major-font-family;
      fontSize: '11px',
      fontWeight: 'bold',
      color: 'hsl(219, 41%, 76%)',

      backgroundColor: '#496daf'
    }
  }
}

const TableHeader = (props) => {

  let styles = getStyle(props)

  return (
    <div style={styles.root}>
    {props.children}
    </div>
  )

}

export default TableHeader
