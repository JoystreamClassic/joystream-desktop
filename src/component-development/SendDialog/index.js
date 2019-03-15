/**
 * Created by bedeho on 13/12/2017.
 */

import React, {Component} from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'

import SendDialog from '../../scenes/Wallet/Components/SendDialog'
import SendDialogStore from '../../scenes/Wallet/Stores/SendDialogStore'

class SendDialogScenarios extends Component {

  constructor(props) {
    super(props)

    this.state = {
      normalFlowStore : null,
      emptyWalletFlowStore : null,
      failedPaymentFlowStore : null,
      paymentBlockingFlowStore : null
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

          <SendDialog sendDialogStore={this.state.normalFlowStore} />

          <CardActions>
            <FlatButton label="Show"
                        onTouchTap={() => { this.setState({ normalFlowStore : makeNormalWalletStore(this) })}}
            />
          </CardActions>
        </Card>

        <Card>
          <CardTitle title="Empty wallet" />

          <SendDialog sendDialogStore={this.state.emptyWalletFlowStore} />

          <CardActions>
            <FlatButton label="Show"
                        onTouchTap={() => { this.setState({ emptyWalletFlowStore : makeEmptyWalletStore(this) })}}
            />
          </CardActions>
        </Card>

        <Card>
          <CardTitle title="Payment failure" />

          <SendDialog sendDialogStore={this.state.failedPaymentFlowStore} />

          <CardActions>
            <FlatButton label="Show"
                        onTouchTap={() => { this.setState({ failedPaymentFlowStore : makeFailedPaymentWalletStore(this) })}}
            />
          </CardActions>
        </Card>

        <Card>
          <CardTitle title="Payment blocks" />

          <SendDialog sendDialogStore={this.state.paymentBlockingFlowStore} />

          <CardActions>
            <FlatButton label="Show"
                        onTouchTap={() => { this.setState({ paymentBlockingFlowStore : makeBlockingPaymentWalletStore(this, 10*1000) })}}
            />
          </CardActions>
        </Card>

      </div>
    )
  }

}

const cryptoToFiatExchangeRate = 1800
const paymentFailureErrorMessage = ''
const totalFee = 100
const minimumPaymentAmount = 899

function makeNormalWalletStore(scenarioComponent) {

  let walletSceneStore = {

    closeCurrentDialog : function () {
      scenarioComponent.setState({ normalFlowStore : null})
    }
  }

  let walletStore = {

    pay : async function (pubKeyHash, amount, feeRate, note) {

      // return promise success
      return 1

    },
    totalBalance : 100000000 // 1 btc
  }

  return new SendDialogStore(walletSceneStore, cryptoToFiatExchangeRate, walletStore, paymentFailureErrorMessage, totalFee, minimumPaymentAmount)
}

function makeEmptyWalletStore(scenarioComponent) {

  let walletSceneStore = {

    closeCurrentDialog : function () {
      scenarioComponent.setState({ emptyWalletFlowStore : null})
    }
  }

  let walletStore = {

    totalBalance : 0 // 1 btc
  }

  return new SendDialogStore(walletSceneStore, cryptoToFiatExchangeRate, walletStore, paymentFailureErrorMessage, totalFee, minimumPaymentAmount)
}

function makeFailedPaymentWalletStore(scenarioComponent) {

  let walletSceneStore = {

    closeCurrentDialog : function () {
      scenarioComponent.setState({ failedPaymentFlowStore : null})
    }
  }

  let walletStore = {

    pay : async function (pubKeyHash, amount, feeRate, note) {

      throw new Error('some issue')

    },
    totalBalance : 100000000 // 1 btc
  }

  return new SendDialogStore(walletSceneStore, cryptoToFiatExchangeRate, walletStore, paymentFailureErrorMessage, totalFee, minimumPaymentAmount)

}

function makeBlockingPaymentWalletStore(scenarioComponent, blockingTimeInMS) {

  let walletSceneStore = {

    closeCurrentDialog : function () {
      scenarioComponent.setState({ paymentBlockingFlowStore : null})
    }
  }

  let walletStore = {

    pay : async function (pubKeyHash, amount, feeRate, note) {

      return new Promise((resolve) => setTimeout(resolve, blockingTimeInMS))

    },
    totalBalance : 100000000 // 1 btc
  }

  return new SendDialogStore(walletSceneStore, cryptoToFiatExchangeRate, walletStore, paymentFailureErrorMessage, totalFee, minimumPaymentAmount)
}

export default SendDialogScenarios