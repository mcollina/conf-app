'use strict'

const buildTalks = require('./data')

exports.register = function (server, options, next) {
  server.dependency('hapi-mongodb')

  const db = server.plugins['hapi-mongodb'].db
  const ObjectID = server.plugins['hapi-mongodb'].ObjectID
  const talks = buildTalks(db)

  server.route({
    method: 'GET',
    path: '/talks',
    handler: function handleTalks (request, reply) {
      return talks.list(reply)
    }
  })

  server.route({
    method: 'POST',
    path: '/talks',
    handler: function addTalk (request, reply) {
      talks.put(request.payload, function wrap (err, result) {
        if (err) { return reply(err) }

        reply(result).code(201)
      })
    }
  })

  server.route({
    method: 'GET',
    path: '/talks/{id}',
    handler: function addTalk (request, reply) {
      return talks.getById(new ObjectID(request.params.id), reply)
    }
  })

  next()
}

exports.register.attributes = {
  name: 'talks',
  version: '0.0.1'
}
