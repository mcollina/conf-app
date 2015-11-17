'use strict'

const minimist = require('minimist')
const Hapi = require('hapi')

function build (opts, cb) {
  const server = new Hapi.Server()
  const port = opts && opts.port || 3000

  server.connection({ port: port })

  server.register(require('./talks'), cb || noop)

  return server
}

module.exports = build

function noop () {}

function start (opts) {
  const server = build(opts)

  server.start(function (err) {
    if (err) {
      throw err
    }
    console.log('Server running at:', server.info.uri)
  })
}

if (require.main === module) {
  start(minimist(process.argv.slice(2), {
    integer: ['port'],
    alias: {
      port: 'p'
    }
  }))
}
