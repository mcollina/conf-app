'use strict'

const Lab = require('lab')
const Code = require('code')
const request = require('request')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

const buildServer = require('../server')

describe('server', () => {
  it('should start the server', (done) => {
    buildServer.start({
      port: 0
    }, (err, server) => {
      if (err) { return done(err) }

      request(server.info.uri, (err, res, body) => {
        if (err) { return done(err) }
        expect(res.statusCode).to.equal(404)
        done()
      })
    })
  })
})
