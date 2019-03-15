/**
 * Created by bedeho on 15/05/17.
 */

import React from 'react'
import PropTypes from 'prop-types'
import ReactTooltip from 'react-tooltip'

const Section = (props) =>  {

    var classes = "section " +  (props.className ? props.className : "")

    return (
        <div className={classes}
             onClick={props.onClick ? props.onClick : null}
             data-tip data-for={props.className}>
            {props.tooltip ? <ReactTooltip id={props.className}
                                           place='top'
                                           effect='solid'
                                           className="torrent_table_toolbar_tooltip"> {props.tooltip} </ReactTooltip> : null }
            {props.children}
        </div>
    )
}

Section.propTypes = {
    onClick : PropTypes.func,
    tooltip : PropTypes.string,
    className : PropTypes.string,
}

export default Section