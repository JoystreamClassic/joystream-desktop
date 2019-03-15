/**
 * Created by bedeho on 18/08/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import {Field} from './../Table'

const NameField = (props) => {

  let styles = {
    root : {
      fontSize : '18px',
    }
  }

  return (
      <Field style={styles.root}>
          {props.name}
      </Field>
  )
}

NameField.propTypes = {
    name : PropTypes.string.isRequired
}

export default NameField