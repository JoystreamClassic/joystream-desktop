/**
 * Created by bedeho on 05/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types';

const Table = (props) => {

    return (
        <div className="my_table">
          {props.children}
        </div>
    )

}

export default Table
