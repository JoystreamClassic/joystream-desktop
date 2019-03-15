/**
 * Created by bedeho on 27/09/17.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyles(props) {

    return {
        root : {
            display : 'flex',
            flexDirection : 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%'
        },
        innerRoot : {
            display : 'flex',
            flexDirection : 'column',
            //justifyContent: 'center'
            alignItems: 'center'
        },
        headingContainer : {
            display: 'flex',
            width: '100%',
            backgroundColor : 'white',
            borderBottom : '2px solid hsla(0, 0%, 94%, 1)',
            //flex: '0 0 140px',
            flexGrow: 0.15,
            justifyContent: 'center',
            alignItems: 'center' // flex-end
        },
        titleContainer : {
            fontFamily: 'Helvetica',
            fontSize: '50px',
            fontWeight: 'bold',
            color: 'hsla(0, 0%, 40%, 1)',
            paddingTop: '50px'
        },
        contentContainer : {
            width: '100%',
            backgroundColor: 'hsla(0, 0%, 97%, 1)',
            //flex: 1,
            flexGrow: 0.85,
            fontFamily: 'Helvetica',
            fontSize:'28px',
            color: 'hsla(0, 0%, 50%, 1)'
        },
        title : {
            fontSize: '60px',
            fontFamily: 'Helvetica',
            color : '#7A7A7A',
            textAlign: 'center'
        }
    }
}

const InnerDialogHeading = (props) => {

    let styles = getStyles(props)

    return (
        <div style={styles.root}>

            <div style={styles.headingContainer}>
                <div style={styles.titleContainer}>
                    {props.title}
                </div>
            </div>

            <div style={styles.contentContainer}>
                {props.children}
            </div>
        </div>
    )
}

InnerDialogHeading.propTypes = {
    title : PropTypes.string.isRequired
}

export default InnerDialogHeading