/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'
import {convenientBytes} from '../../common'

function getStyles(props) {

    return {
        container : {
            display : 'flex',
            alignItems: 'flex-end'
        },
        value :  {
            fontWeight: 'bold',
        },

        unit : {
            marginLeft: '4px',
            //fontSize: '14px'
        }
    }
}

const BytesField = (props) => {

    let styles = getStyles(props)
    let representation = convenientBytes(props.bytes, {decimalPlaces : props.decimalPlaces})

    return (
        <Field>
            <div style={styles.container}>
                <span style={styles.value}>{representation.value}</span>
                <span style={styles.unit}>{representation.unit}</span>
            </div>
        </Field>
    )
}

BytesField.propTypes = {
    bytes : PropTypes.number.isRequired,
    decimalPlaces : PropTypes.number
}

BytesField.defaultProps = {
    decimalPlaces : 0
}

export default BytesField