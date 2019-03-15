/**
 * Created by bedeho on 07/10/2017.
 */

import React, {Component} from 'react'
import PropTypes from 'prop-types'
import AbsolutePositionChildren from '../../components/AbsolutePositionChildren'
import ElevatedAutoLitButton from '../../components/ElevatedAutoLitButton'

const FocusCircle = (props) => {

    let styles = {
        circle: {
            borderRadius: '50%',
            height: '25px',
            width: '25px',
            backgroundColor: 'red'
        }
    }

    return (
        <div style={styles.circle}>
        </div>
    )
}

class Button extends Component {

    constructor(props) {
        super(props)

        this.state = { hover: false}
    }

    handleMouseEnter = () => {
        this.setState({ hover : true})
    }

    handleMouseLeave = () => {
        this.setState({ hover : false})
    }

    render() {

        let style = {
            textAlign: 'center',
            padding: '15px',
            textTransform: 'capitalize',
            backgroundColor: this.state.hover ? 'hsl(120, 39%, 45%)' : 'hsl(120, 39%, 55%)',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            //borderBottom: '3px solid hsla(120, 39%, 40%, 1)'
            //textShadow: '1px 1px hsla(120, 39%, 42%, 1)'
        }

        return (
            <div style={style}
                 onClick={this.props.onClick}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseLeave={this.handleMouseLeave}
            >
                {this.props.title}
            </div>
        )

    }
}

const Section = (props) => {

    let styles = {
        root : {
            display : 'flex',
            flexDirection : 'column'
        },
        title : {
            fontWeight : 'bold',
            color : '#656565'
        },
        body : {

        }
    }

    return (
        <div style={styles.root}>
            <div style={styles.title}>{props.title}</div>
            <div> {props.text}</div>
        </div>
    )
}

Section.propTypes = {
    title : PropTypes.node.isRequired,
    text : PropTypes.node.isRequired
}

const SectionSpacer = (props) => {

    let styles = {
        root : {
            height : props.height
        }
    }

    return (
        <div style={styles.root}></div>
    )
}

SectionSpacer.propTypes = {
    height : PropTypes.string.isRequired
}

const ExplainerTip = (props) => {

    let styles = {
        root : {
            display: 'flex',
            position: 'relative',
            flexDirection: 'column',
            backgroundColor : 'hsla(0, 0%, 97%, 1)', //'white',
            borderRadius: '5px',
            boxShadow: '3px 3px hsla(0, 0%, 83%, 0.15)', // translucent
            border: '1px solid hsla(0, 0%, 91%, 1)',
            overflow: 'hidden'
        },
        title : {
            paddingTop: '21px',
            //paddingBottom: '15px',
            paddingLeft: '30px',
            paddingRight: '30px',
            fontSize: '30px',
            fontWeight: 'bold',
            color: 'hsla(0, 0%, 30%, 1)',
            //borderBottom: '1px solid grey'
        },
        body : {
            paddingLeft: '30px',
            paddingRight: '30px',
            fontSize: '20px',
            //width: '380px',
            fontFamily: 'Helvetica',
            fontWeight: 100,
            paddingTop: '10px',
            paddingBottom: '20px'
        }
    }

    let zIndex = props.zIndex ? props.zIndex : 10

    return (
        <div>

            <AbsolutePositionChildren left={props.circleLeft}
                                      top={props.circleTop}
                                      zIndex={zIndex - 1}>
                <FocusCircle />
            </AbsolutePositionChildren>

            <AbsolutePositionChildren left={props.explainerLeft}
                                      top={props.explainerTop}
                                      zIndex={zIndex}>
                <div style={styles.root}>

                    <div style={styles.title}>
                        {props.title}
                    </div>

                    <div style={styles.body}>
                        {props.children}
                    </div>

                     <Button title={props.buttonTitle}
                             onClick={props.buttonClick}
                     />

                </div>
            </AbsolutePositionChildren>

        </div>
    )
}

ExplainerTip.propTypes = {
    circleTop : PropTypes.number.isRequired,
    circleLeft : PropTypes.number.isRequired,
    explainerTop : PropTypes.number.isRequired,
    explainerLeft : PropTypes.number.isRequired,
    zIndex : PropTypes.number,
    title : PropTypes.string.isRequired,
    buttonTitle : PropTypes.string.isRequired,
    buttonClick : PropTypes.func.isRequired
}

export default ExplainerTip
export {
    Section,
    SectionSpacer
}