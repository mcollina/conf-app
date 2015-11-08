'use strict'

module.exports = function build (db) {
  const collection = db.collection('talks')

  return {
    put: put,
    getById: getById
  }

  function put (toStore, callback) {
    collection.insert(toStore, function wrap (err, result) {
      if (err) { return callback(err) }

      callback(null, result.ops[0])
    })
  }

  function getById (id, callback) {
    collection.findOne({ _id: id }, callback)
  }
}
