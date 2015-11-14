'use strict'

const bcrypt = require('bcrypt')

module.exports = function build (db) {
  let collection
  var checkUserPass = function (username, password, callback) {
    if (!collection) {
      collection = db.collection('users')
    }
    collection.findOne({ username: username }, function getUser (err, user) {
      if (err) return callback(err)
      if (!user) {
        return callback(null, false)
      }
      bcrypt.compare(password, user.password, (err, isValid) => {
        callback(err, isValid)
      })
    })
  }

  return checkUserPass
}
