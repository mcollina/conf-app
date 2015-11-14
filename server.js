'use strict'

const minimist = require('minimist')
const Hapi = require('hapi')

function build (opts, cb) {
  const server = new Hapi.Server()

  cb = cb || noop

  server.connection({ port: opts.port })
  // Register before, otherwise the route config auth to simple will fail
  server.register(require('hapi-auth-cookie'), (err) => {
    if (err) return cb(err)
    // Authentication strategies
    server.auth.strategy('session', 'cookie', true, {
      password: 'supersecretpassword', // cookie secret
      cookie: 'workshop-cookie', // Cookie name
      ttl: 60 * 60 * 1000, // Set session to 1 hour
      isSecure: false // IF NOT THE AUTH FAILS IF NOT HTTPS
    })

    server.register([{
      register: require('hapi-mongodb'),
      options: {
        url: opts.url
      }
    }, require('./lib/talks'), require('./lib/users'), require('./lib/auth')], (err) => {
      cb(err, server)
    })
  })

  return server
}

function noop (err) {
  if (err) {
    throw err
  }
}

module.exports = build

function start (opts, cb) {
  build(opts, (err, server) => {
    if (err) return cb(err)

    server.start((err) => {
      cb(err, server)
    })
  })
}

module.exports.start = start

if (require.main === module) {
  start(minimist(process.argv.slice(2), {
    integer: ['port'],
    alias: {
      port: 'p'
    },
    default: {
      port: 3000
    }
  }), (err, server) => {
    if (err) {
      throw err
    }

    console.log('Server running at:', server.info.uri)
  })
}
