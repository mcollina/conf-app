'use strict'

const Joi = require('joi')
const buildUsers = require('./data')

exports.register = function (server, options, next) {
  server.dependency('hapi-mongodb')

  const db = server.plugins['hapi-mongodb'].db
  const users = buildUsers(db)

  server.route({
    method: 'GET',
    path: '/users',
    handler: function getAllUsers (request, reply) {
      return users.list(reply)
    }
  })

  server.route({
    method: 'POST',
    path: '/users',
    config: {
      validate: {
        payload: {
          username: Joi.string().min(3).required(),
          password: Joi.string().min(3).required()
        }
      }
    },
    handler: function addUser (request, reply) {
      users.put(request.payload, function wrap (err, result) {
        if (err) { return reply(err) }

        reply(result).code(201)
      })
    }
  })

  next()
}

exports.register.attributes = {
  name: 'users',
  version: '0.0.1'
}
