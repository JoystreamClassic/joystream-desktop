/**
 * Created by bedeho on 18/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'
import {observer} from 'mobx-react'

import Section from './Section'

const ButtonSection = observer((props) => {

    return (
        <Section onClick={props.onClick} className={props.className} tooltip={props.tooltip}>
            <div className="button">
                {props.children}
            </div>
        </Section>
    )

})

// { props.tooltip ? <ReactTooltip id={props.className} position='top' effect='solid' className="button-section-tooltip"> {props.tooltip} </ReactTooltip> : null }

ButtonSection.propTypes = {
    onClick : PropTypes.func,
    tooltip : PropTypes.string,
    className : PropTypes.string.isRequired
}

export default ButtonSection
