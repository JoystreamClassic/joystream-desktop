/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'

import {
    convenientHumanizeDuration,
    standardHumanizeDurationOptions
} from '../../common'

function getStyles(props) {

    return {

        root : {
            marginRight: '4px'
        },
        value : {
            fontWeight : 'bold'
        },
        unit : {
            //fontSize: '14px'
        }
    }
}

const ETAField = (props) => {

    let totalSeconds = 0

    if(props.bytes_per_second && props.bytes_per_second > 0)
        totalSeconds = props.bytes_remaining/props.bytes_per_second

    let representation = convenientHumanizeDuration(totalSeconds, standardHumanizeDurationOptions())

    let styles = getStyles(props)

    return (
        <Field>
            {
                representation.map((e, index) => {

                    let value

                    if(index >= props.maximumNumberOfTokens)
                        value = null
                    else
                        value = (
                            <div key={index} style={styles.root}>
                                <span style={styles.value}>{e.value}</span>
                                <span style={styles.unit}>{e.unit}</span>
                            </div>
                        )

                    return value
                })
            }
        </Field>
    )
}

ETAField.propTypes = {
    bytes_remaining : PropTypes.number.isRequired,
    bytes_per_second : PropTypes.number.isRequired,
    maximumNumberOfTokens : PropTypes.number.isRequired
}

ETAField.defaultProps = {
    maximumNumberOfTokens : 2
}

export default ETAField