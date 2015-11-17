'use strict'

exports.register = function (server, options, next) {
  const talks = {}
  let nextId = 0

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

  next()
}

exports.register.attributes = {
  name: 'talks',
  version: '0.0.1'
}
