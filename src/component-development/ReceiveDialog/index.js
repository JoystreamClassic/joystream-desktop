/**
 * Created by bedeho on 19/12/2017.
 */

import React, {Component} from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

import ReceiveDialog from '../../scenes/Wallet/Components/ReceiveDialog'
import ReceiveDialogStore from '../../scenes/Wallet/Stores/ReceiveDialogStore'

import bcoin from 'bcoin'

class ReceiveDialogScenarios extends Component {

  constructor(props) {
    super(props)

    this.state = {
      store : null
    }

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
      <div>

        <Card>
          <CardTitle title="Normal flow" />

          <ReceiveDialog receiveDialogStore={this.state.store} />

          <CardActions>
            <FlatButton label="Show"
                        onTouchTap={() => { this.setState({ store : makeReceiveDialogStore(this) })}}
            />
          </CardActions>
        </Card>

      </div>
    )
  }

}

function makeReceiveDialogStore(scenarioComponent) {

  let walletSceneStore = {

    closeCurrentDialog : function () {
      scenarioComponent.setState({ store : null})
    },

    walletStore : {
      receiveAddress: new bcoin.address('mhiAJ2EHEK2WG6ubNuCvwDwxdrzMZUftGb')
    }

  }

  return new ReceiveDialogStore(walletSceneStore, true)
}


export default ReceiveDialogScenarios