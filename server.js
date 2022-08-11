const { createApp } = require('ilp-connector')
const {
  convert,
  connectCoinCap,
  exchangeQuantity
} = require('@kava-labs/crypto-rate-utils')
const { parse, resolve } = require('path')
const chokidar = require('chokidar')

async function run() {
  const rateBackend = await connectCoinCap()

  const config = {
    env: 'test',
    spread: 0,
    backend: '@kava-labs/ilp-backend-crypto',
    ilpAddress: process.env.ILPAddress,
    initialConnectTimeout: 60000,
    adminApi:true,
    adminApiPort: 7769,
    store:'ilp-store-redis',
    storeConfig: {
      prefix: process.env.RedisPrefix, // used as prefix for keys and publish
      port: process.env.RedisPort,
      password: process.env.RedisPasswork,
      host: process.env.RedisHost,
      connectTimeout: 10000
    },
    accounts: {
    }
  }

  const { listen, addPlugin, removePlugin } = createApp(config)

  // Start the connector
  await listen()

  const paths = ['./servers/**/*.js']

  const watcher = chokidar.watch(paths, {
    awaitWriteFinish: true
  })

  const add = async path => {
    const { name: accountId, ext } = parse(path)
    if (ext === '.js') {
      const createConfig = require(resolve(path))

      // Convert the given amount of USD to the given unit
      const convertUsdTo = (usdAmount, unit) =>
        convert(
          exchangeQuantity(
            {
              symbol: 'USD',
              exchangeScale: 2,
              accountScale: 2,
              scale: 2
            },
            usdAmount
          ),
          unit,
          rateBackend
        ).amount

      const accountConfig = createConfig(convertUsdTo)

      await addPlugin(accountId, accountConfig)
    }
  }

  const remove = async path => {
    const { name: accountId } = parse(path)
    await removePlugin(accountId)
  }

  watcher.on('add', add)
  watcher.on('change', async path => {
    await remove(path)
    await add(path)
  })
  watcher.on('unlink', remove)


}

run()