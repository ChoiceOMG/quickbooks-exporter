#!/usr/bin/env node

/**
 * Module dependencies.
 */

const { server } = require('../src/app')
const path = require('path')
const debug = require('debug')('newsport-backend:server')
const http = require('http')
const models = require('../src/models/index')
const { getProductionConfig, getDevelopmentConfig } = require('../src/config')
const env = process.env.NODE_ENV || 'development'
const config = env == 'production' ? getProductionConfig() : getDevelopmentConfig() 
const port = config.PORT

models.sequelize.sync(/*{force: true}*/).then(function () {
  /**
   * Listen on provided port, on all network interfaces.
   */

  server.listen(port, function () {
    console.log('Express server listening on port ' + server.address().port)
  })
  server.on('error', onError)
  server.on('listening', onListening)

  
})

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort (val) {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  if (error.code === 'EACCES') {
    console.error(bind + ' requires elevated privileges')
    process.exit(1)
  } else if (error.code === 'EADDRINUSE') {
    console.error(bind + ' is already in use')
    process.exit(1)
  } else {
    throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening () {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
