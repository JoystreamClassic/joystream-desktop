/**
 * Created by bedeho on 24/09/17.
 */

import React, {Component} from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import AlertDialog from '../../components/AlertDialog'

class ApplicationHeaderScenarios extends Component {

    constructor(props) {
        super(props)

        this.state = { showDialog : false }
    }

    render() {

        return (
            <Card>
                <CardTitle title="Alert dialog" subtitle="Try it out" />
                <AlertDialog title="You broke the app"
                             body={"Would you like to give this another try?"}
                             open={this.state.showDialog}
                             buttonTitles={["CANCEL", "RETRY", "OK"]}
                             buttonClicked={() => { this.setState({ showDialog : false })}}
                />
                <CardActions>
                    <FlatButton label="Show"
                                onTouchTap={() => { this.setState({ showDialog : true })}}/>
                </CardActions>
            </Card>
        )
    }

}

export default ApplicationHeaderScenarios