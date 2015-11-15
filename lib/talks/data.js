'use strict'

var reduce = require('stream-reduce')
var concat = require('concat-stream')
var pump = require('pump')

module.exports = function build (db) {
  const collection = db.collection('talks')

  return {
    put: put,
    getById: getById,
    list: list,
    talksnum: talksnum
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

  function list (callback) {
    collection.find().toArray(function wrap (err, result) {
      if (err) { return callback(err) }

      callback(null, result)
    })
  }

  function talksnum (callback) {
    pump(collection.find(), reduce((actual, data) => {
      actual[data['speaker']] = ++actual[data['speaker']] || 1
      return actual
    }, {}), concat(res => {
      return callback(null, res)
    }), function (err) {
      if (err) return callback(err)
    })
  }
}
