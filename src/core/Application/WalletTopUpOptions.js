
class WalletTopUpOptions {
  
  /**
   * {Bool} Whether to do topup at all
   */
  doTopUp
  
  /**
   * {Number} Lower bound for wallet
   */
  walletBalanceLowerBound
  
  constructor(doTopUp, walletBalanceLowerBound) {
    
    this.doTopUp = doTopUp
    this.walletBalanceLowerBound =  walletBalanceLowerBound
  }
}

export default WalletTopUpOptions