/**
 * Created by bedeho on 21/10/2017.
 */

function Stopped() {
}

function AlreadyStarted() {
}

function InViable(swarmViability) {
    this.swarmViability = swarmViability // <== this really can never be viable, so all inviable cases within ViabilityOfPaidDownloadingSwarm need to be factored out
}

function WalletNotReady() {
}

function InsufficientFunds(estimate, available) {
    this.estimate = estimate
    this.available = available
}

function CanStart(suitablePeers, estimate) {
    this.suitablePeers = suitablePeers
    this.estimate = estimate
}

// Torrent is still being loaded
function NotLoaded() {
}

// Torrent is fully downloaded and it doesn't make sense to pay for it
function FullyDownloaded() {
}

export {
  Stopped,
  AlreadyStarted,
  InViable,
  WalletNotReady,
  InsufficientFunds,
  CanStart,
  NotLoaded,
  FullyDownloaded
}
