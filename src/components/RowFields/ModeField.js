/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'

const ModeIndicator = (props) => {
    if(props.paid) {
        return <span className="label paid-label">PAID</span>
    }
    else {
        return<span className="label free-label">FREE</span>
    }
}

ModeIndicator.propTypes = {
    paid : PropTypes.bool.isRequired
}

const ModeField = (props) => {

    return (
        <Field>
            <ModeIndicator paid={props.isPaid} />
        </Field>
    )
}

ModeField.propTypes = {
    isPaid : PropTypes.bool.isRequired
}

export default ModeField