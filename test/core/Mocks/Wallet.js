import EventEmitter from 'events'
import sinon from 'sinon'

class MockWallet extends EventEmitter {
  
  /**
   * {STATE} State of the wallet
   */
  state
  
  /**
   * {Number} Represents percentage progress in scanning
   * new transactions for payments during start of wallet. Be ware that the wallet
   * will however start before this process completes.
   */
  scanningNewTransactionsForPaymentsProgressPercentage
  
  /**
   * {Number} Total (Confirmed + Unconfirmed) wallet balance (satoshis)
   */
  totalBalance
  
  /**
   * {Number} Confirmed wallet balance (satoshis)
   */
  confirmedBalance
  
  /**
   * {Address} Current receive address for wallet
   */
  receiveAddress
  
  /**
   * {Number} Height of tip of chain
   */
  blockTipHeight
  
  /**
   * {Number} Height of synchronized chain
   */
  synchronizedBlockHeight
  
  /**
   * {Map:Hash -> Payment[]} Maps transaction id to set of paymentsInTransactionWithTXID carried by the given transaction
   */
  paymentsInTransactionWithTXID
  
  /**
   * {String} Explainer for why we ended up in `state === `Wallet.STATE.CATASTROPHIC_ERROR`.
   * Remember to also look at the `state` to understand the context for the error.
   * Is `null` when there is no error
   */
  catastrophicErrorMessage
  
  constructor(state, start = sinon.spy(), stop = sinon.spy(), pay = sinon.spy(), broadcast = sinon.spy()) {
    
    super()
    
    this.state = state
    this.scanningNewTransactionsForPaymentsProgressPercentage = 0
    this.totalBalance = 0
    this.confirmedBalance = 0
    this.receiveAddress = null
    this.blockTipHeight = 0
    this.synchronizedBlockHeight = 0
    this.paymentsInTransactionWithTXID = new Map()
    this.catastrophicErrorMessage = null
    
    this.start = start
    this.stop = stop
    this.pay = pay
    this.broadcast = broadcast
  }
  
  setState(state) {
    this.state = state
    this.emit('state', state)
  }
  
  setScanningNewTransactionsForPaymentsProgressPercentage(scanningNewTransactionsForPaymentsProgressPercentage) {
    this.scanningNewTransactionsForPaymentsProgressPercentage = scanningNewTransactionsForPaymentsProgressPercentage
    this.emit('scanningNewTransactionsForPaymentsProgressPercentage', scanningNewTransactionsForPaymentsProgressPercentage)
  }
  
  setTotalBalance(balance) {
    this.totalBalance = balance
    this.emit('totalBalanceChanged', balance)
  }
  
  setConfirmedBalance(balance) {
    this.confirmedBalance = balance
    this.emit('confirmedBalanceChanged', balance)
  }
  
  setReceiveAddress(address) {
    this.receiveAddress = address
    this.emit('receiveAddressChanged', address)
  }
  
  setBlockTipHeight(height) {
    this.blockTipHeight = height
    this.emit('blockTipHeightChanged', height)
  }
  
  setSynchronizedBlockHeight(height) {
    this.synchronizedBlockHeight = height
    this.emit('synchronizedBlockHeightChanged', height)
  }

  addMockPayment(mockPayment) {

    let existingPaymentsArray = this.paymentsInTransactionWithTXID.get(mockPayment.txId)

    if(existingPaymentsArray)
      existingPaymentsArray.push(mockPayment)
    else
      this.paymentsInTransactionWithTXID.set(mockPayment.txId, [mockPayment])

    this.emit('paymentAdded', mockPayment)
  }
}

export default MockWallet