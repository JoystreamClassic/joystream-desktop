/**
 * Created by bedeho on 09/11/2017.
 */

import {observable, action} from 'mobx'

class PaymentStore {

  /**
   * {TYPE} Payment type
   */
  @observable type

  /**
   * {Transaction} The transaction carrying the 
   */
  @observable txId

  /**
   * {Number} Index of output in `tx` corresponding to 
   */
  @observable outputIndex

  /**
   * {Date} When transaction was first observed.
   */
  @observable seenDate

  /**
   * {Date} When main chain block was mined.
   */
  @observable minedDate

  /**
   * {Address} Destination address for 
   */
  @observable toAddress

  /**
   * {Amount} Amount carried by payment
   */
  @observable amount

  /**
   * {Amount} Fee paid by transaction. Notice that this fee
   * may be covering multiple paymentsInTransactionWithTXID.
   */
  @observable fee

  /**
   * {Bool} Whether payment is in a transaction which is confirmed or not.
   */
  @observable confirmed

  /**
   * {Hash} Block identifier
   */
  @observable blockIdOfBlockHoldingTransaction

  /**
   * {Number} Height of block (from genesis)
   */
  @observable blockHeightOfBlockHoldingTransaction

  /**
   * {String} Payment note
   */
  @observable note

  /**
   * Constructor
   */
  constructor({
        type,
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
        note}) {

    this.setType(type)
    this.setTxId(txId)
    this.setOutputIndex(outputIndex)
    this.setSeenDate(seenDate)
    this.setMinedDate(minedDate)
    this.setToAddress(toAddress)
    this.setAmount(amount)
    this.setFee(fee)
    this.setConfirmed(confirmed)
    this.setBlockIdOfBlockHoldingTransaction(blockIdOfBlockHoldingTransaction)
    this.setBlockHeightOfBlockHoldingTransaction(blockHeightOfBlockHoldingTransaction)
    this.setNote(note)

  }

  @action.bound
  setType(type) {
    this.type = type
  }

  @action.bound
  setTxId(txId) {
    this.txId = txId
  }

  @action.bound
  setOutputIndex(outputIndex) {
    this.outputIndex = outputIndex
  }

  @action.bound
  setSeenDate(seenDate) {
    this.seenDate = seenDate
  }

  @action.bound
  setMinedDate(minedDate) {
    this.minedDate = minedDate
  }

  @action.bound
  setToAddress(toAddress) {
    this.toAddress = toAddress
  }

  @action.bound
  setAmount(amount) {
    this.amount = amount
  }

  @action.bound
  setFee(fee) {
    this.fee = fee
  }

  @action.bound
  setConfirmed(confirmed) {
    this.confirmed = confirmed
  }

  @action.bound
  setBlockIdOfBlockHoldingTransaction(blockIdOfBlockHoldingTransaction) {
    this.blockIdOfBlockHoldingTransaction = blockIdOfBlockHoldingTransaction
  }

  @action.bound
  setBlockHeightOfBlockHoldingTransaction(blockHeightOfBlockHoldingTransaction) {
    this.blockHeightOfBlockHoldingTransaction = blockHeightOfBlockHoldingTransaction
  }

  @action.bound
  setNote(note) {
    this.note = note
  }
}

export default PaymentStore
