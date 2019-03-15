/**
 * Created by bedeho on 23/03/2018.
 */

import React from 'react'
import { observer } from 'mobx-react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import Field from './Field'

import SvgIcon from 'material-ui/SvgIcon'

const InformationIcon = (props) => {

  return (
    <SvgIcon viewBox="0 0 16 16" {...props}>
      <path d="M8,0C3.6,0,0,3.6,0,8s3.6,8,8,8s8-3.6,8-8S12.4,0,8,0z M9,12H7V7h2V12z M8,6C7.4,6,7,5.6,7,5s0.4-1,1-1 s1,0.4,1,1S8.6,6,8,6z"></path>
    </SvgIcon>
  )
}

const ExplainedHeaderLabel = (props) => {

  let iconStyle = {
    height: '16px',
    width: '16px',
    marginRight: '5px',
    color: '#edf1f7',
    top: '4px',
    position: 'relative'
  }

  let identifier = props.title + '-ExplainedHeaderLabel'

  return (
    <Field key={props.title} >
      <span data-tip data-for={identifier}>
        <InformationIcon style={iconStyle} />
        {props.title}
      </span>
      <ReactTooltip id={identifier}
                    place='bottom'
                    effect='solid'
      >
        {props.tooltip}
      </ReactTooltip>
    </Field>
  )
}

ExplainedHeaderLabel.propTypes = {
  title : PropTypes.string.isRequired,
  tooltip : PropTypes.node
}

export default ExplainedHeaderLabel