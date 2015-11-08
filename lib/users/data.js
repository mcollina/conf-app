'use strict'

const bcrypt = require('bcrypt')

module.exports = function build (db) {
  const collection = db.collection('users')

  return {
    put: put,
    list: list
  }

  function put (user, callback) {
    bcrypt.genSalt(10, function genSalt (err, salt) {
      if (err) return callback(err)
      bcrypt.hash(user.password, salt, function pwdHash (err, hash) {
        if (err) return callback(err)
        user.password = hash
        collection.insert(user, function wrap (err, result) {
          if (err) { return callback(err) }
          return callback(null, result.ops[0])
        })
      })
    })
  }

  function list (callback) {
    collection.find().toArray(function wrap (err, result) {
      if (err) { return callback(err) }

      callback(null, result)
    })
  }
}
