/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'
import {getCompactBitcoinUnits} from './../../common'

function getStyles(props) {

    return {
        container : {
            display : 'flex',
            alignItems: 'flex-end'
        },
        value :  {
            display: 'flex',
            justifyContent: 'flex-end',
            fontWeight : 'bold',
        },
        unit: {
            display: 'flex',
            justifyContent: 'flex-end',
            marginLeft: '4px',
            fontSize: '14px'
        }
    }
}

const BitcoinValueField = (props) => {

    let styles = getStyles(props)
    let representation = getCompactBitcoinUnits(props.satoshis)

    return (
        <Field>
            <div style={styles.container}>
                <span style={styles.value}>{representation.value}</span>
                <span style={styles.unit}>{representation.unit}</span>
            </div>
        </Field>
    )
}

BitcoinValueField.propTypes = {
    satoshis : PropTypes.number.isRequired
}

export default BitcoinValueField