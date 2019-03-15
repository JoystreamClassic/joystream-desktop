/**
 * Created by bedeho on 06/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyles(props) {

    return {
        root : {
            display: 'flex',
            flexDirection: 'row',

            backgroundColor: props.backgroundColor,
            color: 'hsla(0, 0%, 60%, 1)',
            //borderBottom: '1px solid #ededed',

            fontSize: '18px',

            // Prevent growing or shrinking, and start out at 60px tall
            flex: '0 0 80px', // 70px

            paddingLeft: '20px',
            paddingRight: '20px'
        }
    }
}

const Row = (props) => {

    let styles = getStyles(props)

    return (
        <div
          style={styles.root}
          onMouseEnter={props.onMouseEnter}
          onMouseLeave={props.onMouseLeave}
          className="table_row"
        >
          {props.children}
        </div>
    )
}

Row.propTypes = {
  onMouseEnter : PropTypes.func,
  onMouseLeave : PropTypes.func,
  backgroundColor : PropTypes.string.isRequired
}

export default Row
