const BigNumber = require('bignumber.js')
const { getGasPrice } = require('../shared/gas-price')

const gweiDai = {
  symbol: 'DAI',
  exchangeScale: 18,
  accountScale: 9,
  scale: 9
}

module.exports = convertUsdTo => {
  const outgoingChannelAmount = convertUsdTo(20, gweiDai)
  const maxPacketAmount = convertUsdTo(0.2, gweiDai)

  return {
    relation: 'child',
    plugin: 'ilp-plugin-ethereum',
    assetCode: 'DAI',
    assetScale: 9,
    options: {
      role: 'server',
      port: 7444,
      ethereumPrivateKey: process.env.ETHEREUM_PRIVATEKEY,
      ethereumProvider: process.env.ETHEREUM_PROVIDER,
      getGasPrice: process.env.CONNECTOR_ENV === 'production' && getGasPrice,
      outgoingChannelAmount,
      /**
       * In crypto-rate-utils@2, if the amount is falsy, it gets set to 1.
       * When minIncomingChannelAmount is converted from gwei to wei in the constructor,
       * passing 0 here as a number causes that amount to get set to 1. Nice.
       */
      minIncomingChannelAmount: new BigNumber(0),
      // In plugin (and not connector middleware) so F08s occur *before* T04s
      maxPacketAmount,
      tokenAddress: '0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa'
    }
  }
}
