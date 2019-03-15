/**
 * Created by bedeho on 13/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyles(props) {

    return {

        root :  {
            backgroundColor : props.backgroundColor,
            //borderBottom : '2px solid hsl(219, 41%, 60%)',
            display: 'flex',
            flexDirection: 'row',
            flex: '0 0 ' + props.height,
            alignItems: 'center',
            justifyContent: 'center'
        }
    }
}

const MiddleSection = (props) => {

    let styles = getStyles(props)

    return (
        <section style={styles.root}>
            {props.children}
        </section>
    )

}

MiddleSection.propTypes = {
  backgroundColor : PropTypes.string.isRequired,
  height : PropTypes.string,
}

MiddleSection.defaultProps = {
    height : '100px'
}

export default MiddleSection