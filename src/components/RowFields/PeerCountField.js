/**
 * Created by bedeho on 17/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

import {Field} from './../Table'

const PeerCountField = (props) => {
    return (
        <Field>
            {props.count}
        </Field>
    )
}

PeerCountField.propTypes = {
    count : PropTypes.number.isRequired
}

export default PeerCountField