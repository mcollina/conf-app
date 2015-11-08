'use strict'

const bcrypt = require('bcrypt')

module.exports = function buildUserChecker (server) {
  let collection
  var checkUserPass = function (request, username, password, callback) {
    if (!collection) {
      collection = server.plugins['hapi-mongodb'].db.collection('users')
    }
    collection.findOne({ username: username }, function getUser (err, user) {
      if (err) return callback(err)
      if (!user) {
        return callback(null, false)
      }
      bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid, { id: user.id, name: user.name })
      })
    })
  }

  return checkUserPass
}
