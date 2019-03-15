/**
 * Created by bedeho on 11/12/2017.
 */

import React, {Component} from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import Dialog, {
  HeaderSection,
  ButtonSection,
  PrimaryButton,
  SecondaryButton,
  ButtonSectionSpacer
} from '../../components/Dialog'

class DialogScenario extends Component {

  constructor(props) {
    super(props)

    this.state = { showDialog : false }
  }

  handleRequestClose = () => {
    this.setState({ showDialog : false })
  }

  handleShow = () => {
    this.setState({ showDialog : true })
  }

  render() {

    let styles = {
      scenario_A : {
        padding : '20px',
        fontSize : '18px',
        height: '200px',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center'
      }
    }

    return (
      <Card>
        <CardTitle title="Dialog" subtitle="Scenario A" />

        <Dialog title="Great title"
                open={this.state.showDialog}
                onRequestClose={this.handleRequestClose}
                width="735px"
        >
          <div style={styles.scenario_A}>
            This is my example content
          </div>

          <ButtonSection>

            <PrimaryButton label="Send"
                           onClick={() => { console.log('send')}}
                           disabled={false}

            />

          </ButtonSection>
        </Dialog>

        <CardActions>
          <FlatButton label="Show"
                      onTouchTap={this.handleShow}/>
        </CardActions>
      </Card>
    )
  }

}

export default DialogScenario