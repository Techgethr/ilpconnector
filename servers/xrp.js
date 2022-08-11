const dropXrp = {
  symbol: 'XRP',
  exchangeScale: 6,
  accountScale: 0,
  scale: 0
}

module.exports = convertUsdTo => {
  const outgoingChannelAmount = convertUsdTo(20, dropXrp)
  const maxPacketAmount = convertUsdTo(0.2, dropXrp)

  return {
    relation: 'child',
    plugin: '@kava-labs/ilp-plugin-xrp-paychan',
    assetCode: 'XRP',
    assetScale: 6,
    options: {
      role: 'server',
      port: 7443,
      //secret:"XRPPeerPayGYHTAN.45",
      xrpSecret: 'snWsti5geVgt4QZMjpwTWWqAZGnDJ',
      xrpServer:'wss://s.altnet.rippletest.net:51233',
      outgoingChannelAmount,
      minIncomingChannelAmount: 0,
      // Use plugin maxPacketAmount (and not connector middleware) so F08s occur *before* T04s
      maxPacketAmount
    }
  }
}
