'use strict'

const buildCheckUsers = require('./check')

exports.register = function (server, options, next) {
  const db = server.plugins['hapi-mongodb'].db
  const checkUser = buildCheckUsers(db)

  server.route({
    method: 'POST',
    path: '/login',
    config: {
      auth: {
        mode: 'try',
        strategy: 'session'
      }
    },
    handler: function login (request, reply) {
      if (!request.payload) {
        return reply('Missing username or password')
      }
      var username = request.payload.username
      var password = request.payload.password
      if (!username || !password) {
        return reply('Missing username or password')
      }

      checkUser(username, password, function checkUser (err, isValid) {
        if ((!err) && (isValid)) {
          request.auth.session.set({username: 'username'})
          return reply('Login Successful')
        }
        return reply('Login NOT Successful')
      })
    }
  })

  // No Auth required for logout
  server.route({
    method: 'GET',
    path: '/logout',
    handler: function logout (request, reply) {
      request.auth.session.clear()
      return reply('Logout Successful')
    }
  })

  next()
}

exports.register.attributes = {
  name: 'auth',
  version: '0.0.1'
}
