/**
 * Created by bedeho on 26/09/17.
 */

import React, {Component} from 'react'
import {ScenarioContainer} from '../common'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

import FullScreenDialog, {InnerDialogHeading} from '../../components/FullScreenDialog'

function getStyles(props) {

    return {
        root : {
            display : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%'
        },
        textContainer : {
            fontFamily : 'Arial',
            fontSize : '60px',
            fontWeight : 'bold'
        },
        innerDialogContent : {
            width : '100%',
            textAlign : 'center',
            padding : '40px',
            fontFamily: 'Helvetica',
            fontSize:'28px',
            color: 'hsla(0, 0%, 50%, 1)'
        }
    }
}

class ControllableFullScreenDialog extends Component {

    constructor(props) {

        super(props)
        this.state = {
            open : false,
            innerHeadingDialogOpen : false
        }
    }

    handleCloseClick = () => {
        this.setState({
            open : false,
            innerHeadingDialogOpen :  false
        })
    }

    handleOpenClick = () => {
        this.setState({
            open : true,
            innerHeadingDialogOpen : false
        })
    }

    handleInnerHeadingOpenClick = () => {
        this.setState({
            open : false,
            innerHeadingDialogOpen :  true
        })
    }

    handleInnerHeadingCloseClick = () => {
        this.setState({
            open : false,
            innerHeadingDialogOpen :  false
        })
    }

    render () {

        let styles = getStyles(this.props)

        return (
            <div>
                <ScenarioContainer title="Normal">

                    // Basic
                    <FullScreenDialog closeClick={this.handleCloseClick}
                                      open={this.state.open}
                                      enableCloseButton={true}
                    >
                        <div style={styles.root}>
                            <div style={styles.textContainer}>Click top right button to close</div>
                        </div>
                    </FullScreenDialog>

                    <CardActions>
                        <FlatButton label="Basic" onTouchTap={this.handleOpenClick}/>
                    </CardActions>

                    // Inner heading
                    <FullScreenDialog closeClick={this.handleInnerHeadingCloseClick}
                                      open={this.state.innerHeadingDialogOpen}
                                      enableCloseButton={true}
                    >
                        <InnerDialogHeading title={"Settings"}>
                            <div style={styles.innerDialogContent}>
                                Hello, this is a screen where you can alter your settings
                            </div>
                        </InnerDialogHeading>
                    </FullScreenDialog>
                    <CardActions>
                        <FlatButton label="Basic + inner heading" onTouchTap={this.handleInnerHeadingOpenClick}/>
                    </CardActions>
                </ScenarioContainer>
            </div>
        )

    }
}


export default ControllableFullScreenDialog
