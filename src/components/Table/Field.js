/**
 * Created by bedeho on 06/05/17.
 */

import React from 'react'
import {observer} from "mobx-react"
import PropTypes from 'prop-types'

const Field = (props) => {

  if(props.style)
    return <div className="field" style={props.style}> {props.children} </div>
  else
    return <div className="field"> {props.children} </div>
}

Field.propTypes = {
  style : PropTypes.object
}

const ObserverField = observer(Field)

export default Field
export {ObserverField}