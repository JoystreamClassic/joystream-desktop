/**
 * Created by bedeho on 23/03/2018.
 */

import React from 'react'
import PropTypes from 'prop-types';

import Field from "./Field"

const StringHeaderLabel = (props) => {

  return (
    <Field key={props.title}>
      {props.title}
    </Field>
  )
}

StringHeaderLabel.propTypes = {
  title: PropTypes.string.isRequired
}

export default StringHeaderLabel