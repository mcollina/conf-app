'use strict'

const minimist = require('minimist')
const Hapi = require('hapi')

function build (opts, cb) {
  const server = new Hapi.Server()
  const port = opts && opts.port || 3000

  var nextId = 0
  var talks = {}

  server.connection({ port: port })

  server.route({
    method: 'GET',
    path: '/talks',
    handler: function handleTalks (request, reply) {
      return reply(Object.keys(talks).map((id) => talks[id]))
    }
  })

  server.route({
    method: 'POST',
    path: '/talks',
    handler: function addTalk (request, reply) {
      request.payload.nextId = nextId++

      let talk = {
        _id: nextId++,
        title: request.payload.title,
        speaker: request.payload.speaker
      }

      talks[talk._id] = talk

      reply(talk).code(201)
    }
  })

  server.route({
    method: 'GET',
    path: '/talks/{id}',
    handler: function addTalk (request, reply) {
      return reply(talks[request.params.id])
    }
  })

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
