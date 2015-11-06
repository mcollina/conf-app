'use strict'

exports.register = function (server, options, next) {
  server.route({
    method: 'GET',
    path: '/talks',
    handler: function handleTalks (request, reply) {
      return reply(null, [])
    }
  })

  next()
}

exports.register.attributes = {
  name: 'talks',
  version: '0.0.1'
}
