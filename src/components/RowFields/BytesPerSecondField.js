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

const BytesPerSecondField = (props) => {

    let styles = getStyles(props)
    let representation

    if(props.bytes && props.bytes > 3000)
        representation = convenientBytes(props.bytes, {decimalPlaces : props.decimalPlaces})
    else
        representation = {
            value : '',
            unit : ''
        }

    return (
        <Field>
            <div style={styles.container}>
                <span style={styles.value}>{representation.value}</span>
                <span style={styles.unit}>{representation.unit ? representation.unit + '/s' : ''}</span>
            </div>
        </Field>
    )

}

BytesPerSecondField.propTypes = {
    bytes : PropTypes.number.isRequired,
    decimalPlaces : PropTypes.number
}


BytesPerSecondField.defaultProps = {
    decimalPlaces : 0
}

export default BytesPerSecondField
