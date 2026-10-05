import 'dotenv/config'
import mongoose from 'mongoose'
import { createApp } from './app.js'
import { readConfig } from './config.js'

async function startServer() {
  let config
  try {
    config = readConfig()
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
    return
  }

  try {
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    })
  } catch {
    console.error('Cannot connect to MongoDB. Check MONGODB_URI and database access, then restart.')
    process.exitCode = 1
    await mongoose.disconnect()
    return
  }

  const app = createApp(config)
  const server = app.listen(config.port, () => {
    console.log(`Portfolio server listening on http://localhost:${config.port}${config.basePath || '/'}`)
  })

  let shuttingDown = false
  async function shutdown(exitCode = 0) {
    if (shuttingDown) return
    shuttingDown = true
    const timeout = setTimeout(() => process.exit(1), 10000)
    timeout.unref()
    await new Promise(resolve => server.close(resolve))
    await mongoose.disconnect()
    clearTimeout(timeout)
    process.exitCode = exitCode
  }

  server.on('error', async () => {
    console.error('The HTTP server could not start. Check PORT and whether it is already in use.')
    await shutdown(1)
  })
  mongoose.connection.on('error', () => {
    console.error('MongoDB connection error. Contact submissions are unavailable until reconnection.')
  })
  process.once('SIGINT', () => { void shutdown() })
  process.once('SIGTERM', () => { void shutdown() })
}

await startServer()
