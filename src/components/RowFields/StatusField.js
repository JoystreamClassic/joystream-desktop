/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'

const StatusIndicator = (props) => {

    if(props.paused)
        return <span className="label paused-label">PAUSED</span>
    else
        return<span className="label inactive-label">STARTED</span>
}

StatusIndicator.propTypes = {
    paused : PropTypes.bool.isRequired
}

const StatusField = (props) => {

    return (
        <Field>
            <StatusIndicator paused={props.paused} />
        </Field>
    )
}

StatusField.propTypes = {
    paused : PropTypes.bool.isRequired
}

export default StatusField