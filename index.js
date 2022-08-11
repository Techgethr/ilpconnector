const Connector = require('ilp-connector')

const UPLINK_SERVER = "btp+wss://:@localhost:8000/btp"

const connector = Connector.createApp({
  spread: 0,
  backend: 'ecb-plus-xrp',
  initialConnectTimeout: 60000,
  adminApi:true,
  adminApiPort:7781,
  store:'ilp-store-redis',
  storeConfig: {
    prefix: 'test.peerpay.xrp1', // used as prefix for keys and publish
    port: 6380,
    password: 'SEsHnh5qiyIiZHWcSIvWeUNtzc98u1WmoAzCaG1uyok=',
    host: 'ilppeerpay.redis.cache.windows.net'
  },
  accounts: {
    uplink: {
      relation: 'parent',
      sendRoutes: false,
      receiveRoutes: false,
      plugin: 'ilp-plugin-btp',
      assetCode: 'XRP',
      assetScale: 6,
      options: {
        server: UPLINK_SERVER
      }
    },
    local: {
      relation: 'child',
      sendRoutes: false,
      receiveRoutes: false,
      plugin: 'ilp-plugin-mini-accounts',
      assetCode: 'USD',
      assetScale: 6,
      options: {
        port: 8001
      }
    },
  }
})

connector.listen()
  .catch(err => {
    const errInfo = (err && typeof err === 'object' && err.stack) ? err.stack : err
    console.error(errInfo)
  })
