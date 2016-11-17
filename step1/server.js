'use strict'

const minimist = require('minimist')
const Hapi = require('hapi')

const db = {}

function build (opts) {
  const server = new Hapi.Server()
  const port = opts && opts.port || 3000

  server.connection({ port: port })

  server.route({
    path: '/talks',
    method: 'GET',
    handler: (req, reply) => {
      return reply(null, Object.keys(db).map((key) => db[key]))
    }
  })

  return server
}

module.exports = build

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
