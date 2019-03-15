/**
 * Created by bedeho on 14/03/2018.
 */


import EventEmitter from 'events'
import sinon from 'sinon'

class MockPayment extends EventEmitter  {

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

  updateConfirmed(confirmed) {
    this.confirmed = confirmed
    this.emit('confirmedChanged', confirmed)
  }

  updateBlockIdOfBlockHoldingTransaction(blockIdOfBlockHoldingTransaction) {

    this.blockIdOfBlockHoldingTransaction = blockIdOfBlockHoldingTransaction
    this.emit('blockIdOfBlockHoldingTransactionChanged', blockIdOfBlockHoldingTransaction)
  }

  updateBlockHeightOfBlockHoldingTransaction(blockHeightOfBlockHoldingTransaction) {

    this.blockHeightOfBlockHoldingTransaction = blockHeightOfBlockHoldingTransaction
    this.emit('blockHeightOfBlockHoldingTransactionChanged', blockHeightOfBlockHoldingTransaction)
  }

  updateNote(note) {
    this.note = note
    this.emit('noteChanged', note)
  }



}

export default MockPayment