/**
 * Created by bedeho on 21/12/2017.
 */

import React, {Component} from 'react'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import PaymentsTable from '../../scenes/Wallet/Components/PaymentsTable'
import PriceFeedStore from '../../core-stores/PriceFeed'

import {Payment} from '../../core/Wallet'
import WalletStore, {PaymentStore} from '../../core-stores/Wallet'
import WalletSceneStore, {PaymentRowStore} from '../../scenes/Wallet/Stores'

import bcoin from 'bcoin'

class PaymentsTableScenarios extends Component {

  constructor(props) {
    super(props)

    this.state = {
      normal: makeWalletSceneStore(makePaymentsInTransactionWithTXIDFixture()),
      empty: makeWalletSceneStore(new Map())
    }

  }

  render() {

    let styles = {
      card : {
        height : '500px',
        padding : '40px',
        backgroundColor: '#e8e8e8'
      },
      cardContainerStyle : {
        height : '350px'
      }
    }

    return (
      <div>

        <Card style={styles.card} containerStyle={styles.cardContainerStyle}>
          <CardTitle title="Normal" />
          <PaymentsTable walletSceneStore={this.state.normal} height={'100%'}/>
        </Card>

        <Card style={styles.card} containerStyle={styles.cardContainerStyle}>
          <CardTitle title="Empty"/>
          <PaymentsTable walletSceneStore={this.state.empty} height={'100%'}/>
        </Card>

      </div>
    )
  }

}

function makeWalletSceneStore(paymentsInTransactionWithTXID) {

  let mockPriceFeed = {
    cryptoToUsdExchangeRate : 1289,
    on : function () {
      
    }
  }

  let priceFeedStore = new PriceFeedStore(mockPriceFeed)

  ///

  let mockWallet = {
    state : null,
    totalBalance :  273819000,
    confirmedBalance : 123789205407,
    receiveAddress : '',
    blockTipHeight : 1892920,
    synchronizedBlockHeight : 1892920 - 100,
    paymentsInTransactionWithTXID : paymentsInTransactionWithTXID,
    on : function() {

    }
  }

  return new WalletSceneStore(
    new WalletStore(mockWallet),
    priceFeedStore,
    1000,
    null,
    null,
    (txId, outputIndex) => {
      console.log('Clicked ' + txId + ':' + outputIndex)
    },
    () => { console.log('trying to claim wallet scene')},
    bcoin.protocol.consensus.COIN
  )
}

function makePaymentsInTransactionWithTXIDFixture() {

  // TX1

  let txId1 = '295cdff95d6ec7446c6bb012ec5c3c4da0a3701c21a31a8ee50e52e74718860a'

  let p1 = new Payment(
    Payment.TYPE.INBOUND,
    txId1,
    0,
    new Date('December 17, 1995 03:24:00'),
    new Date('1995-12-18T03:24:00'),
    'mhiAJ2EHEK2WG6ubNuCvwDwxdrzMZUftGb',
    18900001,
    1000,
    true,
    '00000000000001405d647ec58f7f22934c79c7471fbd5bad87e6f8193ad7436d',
    1829102,
    'This is the payment note'
  )

  let p2 = new Payment(
    Payment.TYPE.OUTBOUND,
    txId1,
    1,
    new Date('March 11, 2001 01:22:00'),
    new Date('1990-10-19T03:22:00'),
    'mhiAJ2EHEK2WG6ubNuCvwDwxdrzMZUftGb',
    8789878912,
    34545,
    true,
    '00000000000001405d647ec58f7f22934c79c7471fbd5bad87e6f8193ad7436d',
    124312343123,
    'This is the payment note 2'
  )

  // TX2

  let txId2 = '123cdff95d6ec7446c6bb012ec5c3c4da0a3701c21a31a8ee50e52e74718860a'

  let p3 = new Payment(
    Payment.TYPE.OUTBOUND,
    txId2,
    0,
    new Date('June 22, 2001 01:22:00'),
    new Date('2007-10-19T03:22:00'),
    'mhiAJ2EHEK2WG6ubNuCvwDwxdrzMZUftGb',
    8432453452,
    123416532,
    true,
    '00000000000001405d647ec58f7f22934c79c7471fbd5bad87e6f8193ad7436d',
    1234132413,
    'This is the payment note 3'
  )

  let paymentsInTransactionWithTXID = new Map()

  paymentsInTransactionWithTXID.set(txId1, [p1, p2])
  paymentsInTransactionWithTXID.set(txId2, [p3])

  return paymentsInTransactionWithTXID
}

export default PaymentsTableScenarios