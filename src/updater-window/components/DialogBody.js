/**
 * Created by bedeho on 10/10/2017.
 */

import React from 'react'
import PropTypes from 'prop-types'

function getStyles(props) {

    return {
        root : {
            display : 'flex',
            flexDirection: 'column',
            justifyContent : 'center',
            alignItems : 'center',
            color: 'white',
            fontFamily: 'Arial'
        },
        title : {
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            paddingTop: '54px',
        },
        message: {
            paddingTop: '6px',
            fontSize: '18px',
            textAlign: 'center',
            paddingLeft: '40px',
            paddingRight: '40px'
        }
    }
}

const DialogBody = (props) => {

    let styles = getStyles(props)

    return (
        <div style={styles.root}>

            <div style={styles.title}>
                {props.title}
            </div>

            {
                props.message

                ?

                <div style={styles.message}>
                    {props.message}
                </div>

                :

                null
            }

            {props.children}

        </div>
    )
}

DialogBody.propTypes = {
    title : PropTypes.node.isRequired,
    message : PropTypes.node
}

const ButtonGroup = (props) => {

    let styles = {
        root : {
            display: 'flex'
        }
    }

    return (
        <div style={styles.root}>
            { props.children }
        </div>
    )
}

const VerticalSpacer = (props) => {

    return (
        <div style={{marginTop : props.height}}></div>
    )
}

import ElevatedAutoLitButton from '../../components/ElevatedAutoLitButton'
import FlatBorderButton from '../../components/FlatBorderButton'

const PrimaryButton = (props) => {

    let styles = {
        button : {
            fontSize: '22px',
            borderRadius: '8px',
            borderBottomWidth: '4px'
        }
    }

    return (
        <ElevatedAutoLitButton title={props.title}
                               hue={128}
                               saturation={81}
                               lightingLevels={[33, 30, 28]}
                               elevationLevels={[5, 3]}
                               height={65}
                               width={props.width}
                               onClick={props.onClick}
                               style={styles.button}
        />
    )
}

PrimaryButton.propTypes = {
    title : PropTypes.node.isRequired,
    onClick : PropTypes.func.isRequired,
    width : PropTypes.number.isRequired
}

const SecondaryButton = (props) => {

    let style = {
        fontSize : '18px'
    }

    return (
        <FlatBorderButton title="Use old version"
                          hue={200}
                          saturation={21}
                          backgroundColor={'#1C262B'}
                          height={65}
                          width={186}
                          lightingLevels={[50, 40, 30]}
                          onClick={props.onClick}
                          style={style}
        />
    )
}

SecondaryButton.propTypes = {
    title : PropTypes.node.isRequired,
    onClick : PropTypes.func.isRequired,
    width : PropTypes.number.isRequired
}

const ButtonSeparator = (props) => {

    return (
        <div style={{ width: '15px'}}></div>
    )

}

export {
    PrimaryButton,
    SecondaryButton,
    ButtonGroup,
    ButtonSeparator,
    VerticalSpacer
}

export default DialogBody