/**
 * Created by bedeho on 11/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

/**
 * A item separator
 */
const Separator = (props) => {
    return <div className={ props.full ? "full-separator" : "half-separator" }></div>;
}

Separator.propTypes = {
    full : PropTypes.bool
}

export default Separator