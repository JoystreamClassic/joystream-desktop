/**
* Created by bedeho on 10/11/2017.
*/

const Payment = require('./Payment').default
const EventEmitter = require('events')
const assert = require('assert')
const safeBcoinEventHandlerShim = require('./safeEventHandler')
const bcoin = require('bcoin')

/**
* Wallet
* @emits state(Wallet.STATE) wallet state changed
* @emits stopped
* @emits opening-spv-node
* @emits getting-wallet
* @emits getting_balance
* @emits connecting-to-network
* @emits scanningNewTransactionsForPaymentsProgressPercentage({Number})
* @emits started
* @emits stopping
* @emits catastrophic-error
* @emits totalBalanceChanged({Amount}) - unconfirmed balance changed
* @emits confirmedBalanceChanged({Amount}) - confirmed balance changed
* @emits receiveAddressChanged({Address}) receive address changed
* @emits blockTipHeightChanged({Number})
* @emits synchronizedBlockHeightChanged({Number})
* @emits paymentAdded({Payment})
* @emits error({String})
*/
class Wallet extends EventEmitter {

  static STATE = {

    /**
     * Before and after wallet has been started and stopped.
     */
    STOPPED: 0,

    /**
     * Opening Bcoin SPVNode.
     */
    OPENING_SPV_NODE : 1,

    /**
     * Recover wallet from wallet database.
     */
    GETTING_WALLET : 2,

    /**
     * Recover balance from wallet.
     */
    GETTING_BALANCE : 3,

    /**
     * SPVNode connecting to peer network.
     */
    CONNECTING_TO_NETWORK: 4,

    /**
     * Ready to do all core functions, including stopping.
     */
    STARTED : 5,

    /**
     * Stopping wallet
     * We are not unpacking this into all the substates
     * as during starting, as its not so important to keep
     * track of stopping process,
     */
    STOPPING : 6,

    /**
     * Some catastrophic error occured, from which one cannot recover.
     * It is described in error property. No actions are valid at this point.
     */
    CATASTROPHIC_ERROR : 7
  }

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

  /**
   * Constructor
   * @param spvNode {bcoin.spvnode} - an unopened spv node
   * @param paymentDatabase {PaymentDatabase}
   */
  constructor(spvNode, paymentDatabase)  {

    super()

    // Set public properties
    this.state = Wallet.STATE.STOPPED
    this.scanningNewTransactionsForPaymentsProgressPercentage = 0
    this.totalBalance = 0
    this.confirmedBalance = 0
    this.receiveAddress = null
    this.blockTipHeight = 0
    this.synchronizedBlockHeight = 0
    this.paymentsInTransactionWithTXID = new Map()
    this.catastrophicErrorMessage = null

    // Set hidden properties
    this._spvNode = spvNode // make assertion about spvNode state?
    this._wallet = null // Is set in GETTING_WALLET step
    this._paymentDatabase = paymentDatabase
  }

  /**
   * Start wallet.
   * Only possible when `Wallet.STATE.STOPPED`
   * @returns {Promise.<number>}
   */
  async start() {

    if(this.state !== Wallet.STATE.STOPPED)
      throw Error('Can only start when already stopped.')

    /// Hook into various SPVNode/Chain/Pool events
    /// NB: notice that we are emitting these unconditionally, we dont
    /// guard them with our own state, no clear need as of yet.

    // Attach the walletdb plugin
    this._spvNode.use(bcoin.wallet.plugin)

    // Disable http/rpc - to avoid any port conflict issues. Also more secure option
    this._spvNode.http = null

    // Ask for the mempool after syncing is done
    overrideBcoinPoolHandleTxInv(this._spvNode.pool)

    this._spvNode.chain.on('block', safeBcoinEventHandlerShim((block, entry) => {
      // Update height of chain
      this._setBlockTipHeight(this._spvNode.chain.height)

      // Update synch
      let synchronizedBlockHeight = this.synchronizedBlockHeight * this._spvNode.chain.getProgress()
      this._setSynchronizedBlockHeight(synchronizedBlockHeight)

      // _spvNode.pool.x?  what do peers report as the current tip of their longest chain?
      // it is sent in the version message when we connect to them
    }), 'spvnode.chain.block')

    this._spvNode.on('error', (err) => {
      this._spvNodeError(err)
    })

    /// Open SPV Node

    this._setState(Wallet.STATE.OPENING_SPV_NODE)

    try {

      // Ensure wallet prefix folder available. Creates it if not.
      await this._spvNode.ensure()

      // Open
      await this._spvNode.open()

      // Make sure that we were not interrupted to be stopped,
      // if so we are done.
      if(this.state !== Wallet.STATE.OPENING_SPV_NODE) {
        assert(this.state === Wallet.STATE.STOPPED)
        return
      }

    } catch(err) {

      this.catastrophicErrorMessage = 'Could not open SPVNode: ' + err
      this._setState(Wallet.STATE.CATASTROPHIC_ERROR)

      return Wallet.STATE.CATASTROPHIC_ERROR
    }

    // Set initial height
    this._setBlockTipHeight(this._spvNode.chain.height)

    // Set initial synchronized height
    this._setSynchronizedBlockHeight(this.blockTipHeight * this._spvNode.chain.getProgress())

    /// Get wallet

    this._setState(Wallet.STATE.GETTING_WALLET)

    try {

      // Get it
      this._wallet = await this._spvNode.plugins.walletdb.get('primary')

      // Make sure that we were not interrupted to be stopped,
      // if so we are done.
      if(this.state !== Wallet.STATE.GETTING_WALLET) {
        assert(this.state === Wallet.STATE.STOPPED)
        return
      }

    } catch(err) {
      this.catastrophicErrorMessage = 'Could not get wallet: ' + err
      this._setState(Wallet.STATE.CATASTROPHIC_ERROR)

      return Wallet.STATE.CATASTROPHIC_ERROR
    }

    let currentReceiveAddress = this._wallet.getAddress()
    this._setReceiveAddress(currentReceiveAddress)

    // Setup

    this._wallet.on('tx', safeBcoinEventHandlerShim((tx, details) => {

      console.log('tx')
      console.log(tx)
      console.log(details)

      this._newTransaction(tx, details)

    }), 'wallet.tx')

    this._wallet.on('confirmed', safeBcoinEventHandlerShim((tx, details) => {
      this._transactionConfirmed(tx, details)
    }), 'wallet.confirmed')

    this._wallet.on('unconfirmed', safeBcoinEventHandlerShim((tx, details) => {
      this._transactionUnconfirmed(tx, details)
    }), 'wallet.unconfirmed')

    this._wallet.on('balance', safeBcoinEventHandlerShim((balance) => {
      this._setConfirmedBalance(balance.confirmed)
      this._setTotalBalance(balance.unconfirmed)
    }), 'wallet.balance')

    // New receive address generated
    this._wallet.on('address', safeBcoinEventHandlerShim((derived) => {
        let receiveAddress = derived[0].getAddress()

        this.emit('receiveAddressChanged', receiveAddress)
    }), 'wallet.address')

    /// Get balance

    this._setState(Wallet.STATE.GETTING_BALANCE)

    let balance

    try {
      balance = await this._wallet.getBalance()

      // Make sure that we were not interrupted to be stopped,
      // if so we are done.
      if(this.state !== Wallet.STATE.GETTING_BALANCE) {
        assert(this.state === Wallet.STATE.STOPPED)
        return
      }

    } catch(err) {
      this.catastrophicErrorMessage = 'Could not get balance: ' + err
      this._setState(Wallet.STATE.CATASTROPHIC_ERROR)

      return Wallet.STATE.CATASTROPHIC_ERROR
    }

    this._setConfirmedBalance(balance.confirmed)
    this._setTotalBalance(balance.unconfirmed)

    /// Connect to peer network

    this._setState(Wallet.STATE.CONNECTING_TO_NETWORK)

    try {

      // Connect
      await this._spvNode.connect()

      // Make sure that we were not interrupted to be stopped,
      // if so we are done.
      if(this.state !== Wallet.STATE.CONNECTING_TO_NETWORK) {
        assert(this.state === Wallet.STATE.STOPPED)
        return
      }

    } catch(err) {
      this.catastrophicErrorMessage = 'Could not connect to network: ' + err
      this._setState(Wallet.STATE.CATASTROPHIC_ERROR)

      return Wallet.STATE.CATASTROPHIC_ERROR
    }

    /// Initiate synchronization

    this._spvNode.startSync()

    ///
    this._scanNewTransactionsForPayments()

    /// Mark as started
    this._setState(Wallet.STATE.STARTED)

    return Wallet.STATE.STARTED
  }

  async _scanNewTransactionsForPayments() {

    /// Getting new transactions

    let transactionHistory = await this._wallet.getHistory()

    // Stop processing if wallet is stopping
    if(this.state === Wallet.STATE.STOPPING || this.state === Wallet.STATE.STOPPED)
      return

    /// Scan new transactions for new paymentsInTransactionWithTXID

    let numberOfTransactionsProcessed = 0
    for(var i = 0; i < transactionHistory.length;i++) {

      let txRecord = transactionHistory[i]

      // Get transaction details
      let txDetails = await this._wallet.getDetails(txRecord.hash)

      // Stop processing if wallet is stopping
      if(this.state === Wallet.STATE.STOPPING || this.state === Wallet.STATE.STOPPED)
        return

      this._processTxRecord(txRecord, txDetails)
        .then(() => {

          numberOfTransactionsProcessed++

          let processingPercentage = 100*numberOfTransactionsProcessed/transactionHistory.length

          this._setScanningNewTransactionsForPaymentsProgressPercentage(processingPercentage)
        })
    }
  }

  _spvNodeError (err) {
    console.error('spvNodeError:', err)
  }

  /**
   * Stop wallet.
   * Possible so long as not already in states
   * `Wallet.STATE.STOPPED` or `Wallet.STATE.STOPPING`
   */
  async stop() {

    // We can only stop when we are fully started
    if(this.state === Wallet.STATE.STOPPED)
      throw new Error('Cannot stop an already stopped wallet.')
    else if(this.state === Wallet.STATE.STOPPING)
      throw new Error('Cannot stop a wallet which is already being stopped.')

    /// Stopping

    this._setState(Wallet.STATE.STOPPING)

    try {

      // We always assert that we still are in the stopping state, because
      // no operation should be able to interrupt this state.

      // Stop synching blockchain
      this._spvNode.stopSync()

      assert(this.state === Wallet.STATE.STOPPING)

      // Disconnect from peer network
      await this._spvNode.disconnect()

      assert(this.state === Wallet.STATE.STOPPING)

      // Close SPVNode
      await this._spvNode.close()

      assert(this.state === Wallet.STATE.STOPPING)

    } catch(err) {

      this.catastrophicErrorMessage = 'Could stop wallet: ' + err
      this._setState(Wallet.STATE.CATASTROPHIC_ERROR)

      return Wallet.STATE.CATASTROPHIC_ERROR

    }

    /// Mark as stopped

    this._setState(Wallet.STATE.STOPPED)

    return Wallet.STATE.STOPPED
  }

  /**
   * Create and send a contract transaction
   * @param {Array.<bcoin.output>} outputs - contract commitment outputs
   * @param {Number} satsPrkBFee - number of satoshis per kB.
   * @param {String} note - note to be attached to the contract payment
   * @return {Promise} - Returns {@link bcoin.tx}
   */
  async createAndSendPaidDownloadingContract (outputs, satsPrkBFee, note) {
    // Check that we are indeed started
    if(this.state !== Wallet.STATE.STARTED)
      throw new Error('Cannot pay when wallet is not started.')

    // Do validation that bcoin has hidden as assert, much easier+cleaner
    // to guard here than wait for assert dump
    if(!bcoin.util.isNumber(satsPrkBFee))
      throw new Error('satsPrkBFee is not a valid number')

    // Mark the contract as coming from joystream without revealing anything about the torrent
    // it pertains to, using an OP_RETURN output. This should be removed in the future, it
    // is only for analytics early on to look for any problems in contract construction.

    const markerScript = bcoin.script.fromNulldata(Buffer.from('js'))
    const markerOutput = bcoin.output.fromScript(markerScript, 0)

    const tx = await this._wallet.send({
      sort: false,
      outputs: [...outputs, markerOutput],
      rate: satsPrkBFee
    })

    // Recheck wallet state
    if(this.state !== Wallet.STATE.STARTED) {
      throw new Error('createAndSendPaidDownloadingContract call interrupted by wallet state changing.')
    }

    // Process a transaction
    let payments = await this._processTx(tx)

    // There should be exactly one payment
    assert(payments.length === 1)

    return tx
  }

  /**
   * Make a payment
   * @param {bcoin.Address} address - for destination
   * @param {Number} amount - number of satoshis
   * @param {Number} satsPrkBFee - number of satoshis per kB.
   * @param {String} note - note to be attached to the payment
   * @return {Promise} - Returns {@link Payment}
   */
  async pay(address, amount, satsPrkBFee, note) {

    // Check that we are indeed started
    if(this.state !== Wallet.STATE.STARTED)
      throw new Error('Cannot pay when wallet is not started.')

    // Do validation that bcoin has hidden as assert, much easier+cleaner
    // to guard here than wait for assert dump
    if(!bcoin.util.isNumber(satsPrkBFee))
      throw new Error('satsPrkBFee is not a valid number')

    // Create transaction output
    let output = new bcoin.output({
      value : amount,
      script : bcoin.script.fromAddress(address)
    })

    // Ask wallet to build a transaction, fill it with outputs and inputs,
    // sort the members according to BIP69, set locktime, sign and broadcast.
    // Doing this all in one go prevents coins from being double spent.

    let tx = await this._wallet.send({
        sort: false,
        outputs: [output],
        rate: satsPrkBFee
      })

    // Recheck wallet state
    if(this.state !== Wallet.STATE.STARTED) {
      throw new Error('Pay call interrupted by wallet state changing.')
    }

    let txId = tx.txid()

    console.log('Wallet sent transaction with id: ' + txId)

    //
    // LATER ADD `note` to this._paymentDatabase
    //

    // Process a transaction.
    let payments = await this._processTx(tx)

    // There should be exactly one payment
    assert(payments.length === 1)

    return payments[0]

  }

  /**
   * Broadcast transaction
   * @param {TX} tx - transaction to be broadcasted
   * @returns {Promise|*}
   */
  broadcast(tx) {

    if (!(tx instanceof bcoin.primitives.TX)) {
      tx = bcoin.primitives.TX.fromRaw(tx)
    }

    console.log('spvnode: sending raw TX:', tx.toRaw().toString('hex'))
    console.log('spvnode: TX ID:', tx.txid())

    return this._spvNode.broadcast(tx)
  }

  /**
   * Provides wallet master HD key.
   * Requires that underlying wallet has been recovered from wallet database
   * i.e. `STATE.GETTING_WALLET` has been reached, but stopping has not been
   * initiated, i.e. `STATE.STOPPING` and there is no error. Hence only allowed
   * in state
   * `STATE.GETTING_BALANCE`
   * `STATE.CONNECTING_TO_NETWORK`
   * `STATE.STARTED`
   *
   * @return {Object} - wallet master key with metadata, e.g. mnemonic
   */
  getMasterKey() {

    // Make sure we are in an acceptable state
    if(!(
      this.state === Wallet.STATE.GETTING_BALANCE ||
      this.state === Wallet.STATE.CONNECTING_TO_NETWORK ||
      this.state === Wallet.STATE.STARTED
      ))
      throw Error('Wallet must be started')

    return this._wallet.master
  }

  /**
   * Process
   * @param {TX} tx
   * @param {Details} details
   * @private
   */
  _newTransaction(tx, details) {

    if(this.state !== Wallet.STATE.STARTED)
      return

    this._processTx(tx, details)
  }

  /**
   * Confirmation status of transaction updated
   * @param {TX} tx
   * @param {Details} details
   * @private
   */
  _transactionUnconfirmed(tx, details) {

    if(this.state !== Wallet.STATE.STARTED)
      return

    this._processTx(tx, details)
  }

  /**
   *
   * @param {TX} tx
   * @param {Details} details
   * @private
   */
  _transactionConfirmed(tx, details) {

    if(this.state !== Wallet.STATE.STARTED)
      return

    this._processTx(tx, details)
  }

  /**
   * Process a transaction.
   * Requires that wallet is started.
   * @param tx
   * @param details
   * @returns {Promise} - Resolves with {Array.<Payment>}, with payments found in transaction corresponding to tx
   * @private
   */
  async _processTx(tx, details) {

    assert(this.state === Wallet.STATE.STARTED)

    try {

      // If transaction details were no provided,
      // then fetch from wallet
      if (!details) {

        let txHashString = tx.hash().toString('hex')

        details = await this._wallet.getDetails(txHashString)

        if (!details)
          throw new Error('Could not get details for transaction with id: ' + tx.txid())

      }

    } catch(err) {
      console.error(err)
      return
    }


    let txRecord
    try {

      // Recover transaction record in the wallet
       txRecord = await this._wallet.txdb.getTX(details.hash)

    } catch(err) {
      console.error(err)
      return
    }

      // Make sure we are still started
      if (this.state !== Wallet.STATE.STARTED) {

        console.log('Abandoning transaction processing due to wallet no longer being started.')

        return []

      }

    try {

    return this._processTxRecord(txRecord, details)

    } catch(err) {
      console.error(err)
      return
    }
  }

  /**
   * Process a transaction record.
   * Requires wallet is started.
   * @param txRecord
   * @param details
   * @private
   * @returns {Promise} - Resolves with {Array.<Payment>}, with payments found in transaction corresponding to
   * txRecord
   */
  async _processTxRecord(txRecord, details) {

    assert(txRecord)
    assert(details)

    // Array will be populated with {Payment}s
    // and returned
    let paymentsInTx = []

    let tx = txRecord.tx

    try {

      // If we don't know this transaction
      if (!this.paymentsInTransactionWithTXID.has(details.hash)) {

        // Get fee
        let coinView = await this._wallet.getCoinView(tx)

        let feeAmount = tx.getFee(coinView)

        // then lets look for paymentsInTransactionWithTXID
        paymentsInTx = Payment.paymentsFromTransaction(txRecord, details, feeAmount)

        // If any found
        if (paymentsInTx.length > 0) {

          // ***
          // In the future recover metadata from `paymentsDatabase`
          // to decorate payment further
          // ***

          paymentsInTx.forEach((payment) => {
            this.emit('paymentAdded', payment)
          })

          this.paymentsInTransactionWithTXID.set(details.hash, paymentsInTx)
        }

      } else {

        // otherwise, lets refresh relevant payment properties
        paymentsInTx = this.paymentsInTransactionWithTXID.get(details.hash)

        assert(paymentsInTx)
        assert(paymentsInTx.length > 0)

        // Update payment
        paymentsInTx.forEach((payment) => {

          let confirmed = txRecord.height !== -1

          payment.updateSeenDate(new Date(txRecord.ps * 1000))
          payment.updateMinedDate(new Date(txRecord.ts * 1000))
          payment.updateConfirmed(confirmed)
          payment.updateBlockIdOfBlockHoldingTransaction(confirmed ? txRecord.block : undefined)
          payment.updateBlockHeightOfBlockHoldingTransaction(confirmed ? txRecord.height : undefined)
        })

      }

    } catch(err) {
      console.error(err)
      return
    }


    return paymentsInTx

  }

  _setState(state) {

    this.state = state
    this.emit('state', this.state)
    this.emit(stateToString(this.state))

    // Some helpful logging in case there was a serious error
    if(this.state === Wallet.STATE.CATASTROPHIC_ERROR)
      console.log(this.catastrophicErrorMessage)
  }

  _setScanningNewTransactionsForPaymentsProgressPercentage(scanningNewTransactionsForPaymentsProgressPercentage) {
    this.scanningNewTransactionsForPaymentsProgressPercentage = scanningNewTransactionsForPaymentsProgressPercentage
    this.emit('scanningNewTransactionsForPaymentsProgressPercentage', scanningNewTransactionsForPaymentsProgressPercentage)
  }

  _setTotalBalance(balance) {
    this.totalBalance = balance
    this.emit('totalBalanceChanged', balance)
  }

  _setConfirmedBalance(balance) {
    this.confirmedBalance = balance
    this.emit('confirmedBalanceChanged', balance)
  }

  _setReceiveAddress(address) {
    this.receiveAddress = address
    this.emit('receiveAddressChanged', address)
  }

  _setBlockTipHeight(height) {
    this.blockTipHeight = height
    this.emit('blockTipHeightChanged', height)
  }

  _setSynchronizedBlockHeight(height) {
    this.synchronizedBlockHeight = height
    this.emit('synchronizedBlockHeightChanged', height)
  }

}

function stateToString(state) {

  let str

  switch(state) {

    case Wallet.STATE.STOPPED:
      str = 'stopped'
      break
    case Wallet.STATE.OPENING_SPV_NODE:
      str = 'opening-spv-node'
      break
    case Wallet.STATE.GETTING_WALLET:
      str = 'getting-wallet'
      break
    case Wallet.STATE.GETTING_BALANCE:
      str = 'getting_balance'
      break
    case Wallet.STATE.CONNECTING_TO_NETWORK:
      str = 'connecting-to-network'
      break
    case Wallet.STATE.STARTED:
      str = 'started'
      break
    case Wallet.STATE.STOPPING:
      str = 'stopping'
      break
    case Wallet.STATE.CATASTROPHIC_ERROR:
      str = 'catastrophic-error'
      break
    default:
      assert(false)
  }

  return str
}

function overrideBcoinPoolHandleTxInv (pool) {
  // bcoin's "co-routine" library
  var co = bcoin.co

  // We are choosing to only override the instance method rather than the prototype
  pool.handleTXInv = co(function * handleTXInv (peer, hashes) {

    // Make sure we only do this for spvnodes
    assert(pool.options.spv)

    // Override bcoin pool normal behaviour in spv mode => Allow handling of incoming tx to mempool during syncing
    // This allows us to immedetialy start using unconfirmed balances and reflect it in the wallet
    // The consequence is that if the tx is mined into a block we will not learn about it until after
    // syncing completes.

    // As far as I can tell this does not lower the security of the spvnode, because
    // the validation performed on the incoming tx is no different than if an spvchain
    // is fully synced. (extensive validation is done by the mempool, spvnode doesn't have an instance of a mempool)

    assert(hashes.length > 0)

    // bcoin's implementation
    // if (this.syncing && !this.chain.synced) {
    //    return
    // }

    // Queues a `getdata` request to be sent. Checks tx existence before requesting.
    pool.ensureTX(peer, hashes)
  })
}

export default Wallet
