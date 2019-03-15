/**
 * Created by bedeho on 10/11/2017.
 */

var EventEmitter = require('events')

/**
 * Payment
 * @emits confirmedChanged({Bool})
 * @emits blockIdOfBlockHoldingTransactionChanged
 * @emits blockHeightOfBlockHoldingTransactionChanged
 * @emits noteChanged
 */
class Payment extends EventEmitter {

  static TYPE = {

    INBOUND: 0,

    OUTBOUND: 1

    // Do we need the notion of a payment being submitted, e.g. fo
    // purpose of rebroadcasting, etc. ?

    // normal_receive : { inbound address, amount }
    // normal_spend (only carries a single payment) : { destination address, amount sent, fee, change}

    // opens_channel_as_payor :
    // refunds_channel_as_payor :
    // settles_channel_as_payor :

    // opens_channel_as_payee :
    // refunds_channel_as_payee :
    // settles_channel_as_payee :
  }

  /**
   * @property {TYPE} payment - Payment type
   */
  type

  /**
   * @property {Hash} txId - The transaction id carrying the payment
   */
  txId

  /**
   * @property {Number} Index of output in `tx` corresponding to payment.
   */
  outputIndex

  /**
   * @property {Date} When transaction was first observed.
   */
  seenDate

  /**
   * @property {Date} When main chain block was mined.
   */
  minedDate

  /**
   * @property {Address} Destination address for payment.
   */
  toAddress

  /**
   * @property {Amount} Amount carried by payment
   */
  amount

  /**
   * @property {Amount} Fee paid by transaction. Notice that this fee
   * may be covering multiple paymentsInTransactionWithTXID.
   */
  fee

  /**
   * @property {Bool} Whether payment is in a transaction which is confirmed or not.
   *
   */
  confirmed

  /**
   * @property {Hash} Block identifier. Only set if transaction is confirmed,
   * otherwise `undefined`.
   */
  blockIdOfBlockHoldingTransaction

  /**
   * @property {Number} Height of block (from genesis). Only set if transaction is confirmed,
   * otherwise `undefined`.
   */
  blockHeightOfBlockHoldingTransaction

  /**
   * @property {String} User defined payment note
   */
  note

  /**
   * Constructor
   * @param type {TYPE}
   * @param txId {Hash}
   * @param outputIndex {Number}
   * @param seenDate {Date}
   * @param minedDate {Date}
   * @param toAddress {Address}
   * @param amount {Amount}
   * @param fee {Amount}
   * @param blockIdOfBlockHoldingTransaction {Hash}
   * @param blockHeightOfBlockHoldingTransaction {Number}
   * @param note {String}
   */
  constructor(type,
              txId,
              outputIndex,
              seenDate,
              minedDate,
              toAddress,
              amount,
              fee,
              confirmed,
              blockIdOfBlockHoldingTransaction,
              blockHeightOfBlockHoldingTransaction,
              note) {
    super()

    this.type = type
    this.txId = txId
    this.outputIndex = outputIndex
    this.seenDate = seenDate
    this.minedDate = minedDate
    this.toAddress = toAddress
    this.amount = amount
    this.fee = fee
    this.confirmed = confirmed
    this.blockIdOfBlockHoldingTransaction = blockIdOfBlockHoldingTransaction
    this.blockHeightOfBlockHoldingTransaction = blockHeightOfBlockHoldingTransaction
    this.note = note
  }

  updateMinedDate(date) {
    this.minedDate = date
  }

  updateSeenDate(date) {
    this.seenDate = date
  }

  updateConfirmed(confirmed) {
    this.confirmed = confirmed
    this.emit('confirmedChanged', confirmed, this.seenDate, this.minedDate)
  }

  /**
   * Update blockIdOfBlockHoldingTransaction
   * @param blockIdOfBlockHoldingTransaction
   */
  updateBlockIdOfBlockHoldingTransaction(blockIdOfBlockHoldingTransaction) {

    this.blockIdOfBlockHoldingTransaction = blockIdOfBlockHoldingTransaction
    this.emit('blockIdOfBlockHoldingTransactionChanged', blockIdOfBlockHoldingTransaction)
  }

  /**
   * Update blockHeightOfBlockHoldingTransaction
   * @param blockHeightOfBlockHoldingTransaction
   */
  updateBlockHeightOfBlockHoldingTransaction(blockHeightOfBlockHoldingTransaction) {

    this.blockHeightOfBlockHoldingTransaction = blockHeightOfBlockHoldingTransaction
    this.emit('blockHeightOfBlockHoldingTransactionChanged', blockHeightOfBlockHoldingTransaction)
  }

  /**
   * Update note
   * @param note
   */
  updateNote(note) {
    this.note = note
    this.emit('noteChanged', note)
  }

  /**
   * Recover paymentsInTransactionWithTXID carried in a transaction.
   * This routine works as follows
   *
   * - if at least one input corresponds to a wallet address, then
   * all non-wallet outputs are considered corresponding to its own
   * individual outbound payment.
   *
   * - if an output allocates funds to a non-change wallet address, then
   * we consider it to correspond to an inbound payment.
   *
   * Notice from this
   * - we accept that a transaction can hold multiple outbound paymentsInTransactionWithTXID.
   * - we accept that a transaction can hold both inbound and outbound paymentsInTransactionWithTXID simultaneously
   *
   * @param txRecord {TXRecord} Wallet transaction record for transaction carrying payment
   * @param txDetails {Details} Details corresponding to transaction carrying paymentsInTransactionWithTXID
   * @param fee {Number}
   * @returns {Payment[]}
   */
  static paymentsFromTransaction(txRecord, txDetails, fee) {

    // Recover transaction from the record
    let tx = txRecord.tx
    let txId = txRecord.tx.txid()
    let seenDate = new Date(txRecord.ps * 1000)
    let minedDate = new Date(txRecord.ts * 1000)
    let confirmed = txRecord.block != null
    let blockIdOfBlockHoldingTransaction = confirmed ? txRecord.block.hash : null
    let blockHeightOfBlockHoldingTransaction = confirmed ? txRecord.height : null

    // Iterate inputs, identify whether any wallet
    // outputs are being spent. If so, then this may be
    // an outbound payment
    let inputsSpendingWalletUTXO = []

    for(var i = 0;i < tx.inputs.length;i++) {

      let input = tx.inputs[i]
      let detailsMember = txDetails.inputs[i]

      // If path is set for this input, then its spending
      // a wallet address output
      if(detailsMember.path) {
        inputsSpendingWalletUTXO.push(input)
      }

    }

    let txSpendsWalletUTXO = inputsSpendingWalletUTXO.length > 0

    // Payments found
    var payments = []

    // Iterate outputs to identify any potential payments
    for(var i = 0;i < tx.outputs.length;i++) {

      let output = tx.outputs[i]
      let detailsMember = txDetails.outputs[i]

      let paymentType = null

      // Is this output controlled by a key in this wallet?
      if(detailsMember.path) {

        // Is this an external (i.e. non-change) output,
        // if so, then we have an inbound payment.
        // Otherwise, its just a change output, and we
        // don't consider that a payment in of itself.
        if(detailsMember.path.branch === 0)
          paymentType = Payment.TYPE.INBOUND

      } else {
        // if OP_RETURN output ignore
        if (detailsMember.value === 0) continue

        // Is this non-wallet output part of a transaction
        // which spends wallet outputs? If so, then we have
        // an inbound payment.
        if(txSpendsWalletUTXO)
          paymentType = Payment.TYPE.OUTBOUND

      }

      // Was a payment type identified?
      if(paymentType != null) {

        let amount = output.value

        // Create payment
        let payment = new Payment(paymentType,
                                  txId,
                                  i,
                                  seenDate,
                                  minedDate,
                                  detailsMember.address,
                                  amount,
                                  fee,
                                  confirmed,
                                  blockIdOfBlockHoldingTransaction,
                                  blockHeightOfBlockHoldingTransaction,
                                  '')

        payments.push(payment)

      }

    }

    return payments
  }

}

export default Payment
