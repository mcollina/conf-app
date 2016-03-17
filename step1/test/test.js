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
  it('returns a 404 when accessing /', (done) => {
    const server = buildServer()
    server.inject('/', (res) => {
      expect(res.statusCode).to.equal(404)
      done()
    })
  })

  it('successfully start', (done) => {
    const server = buildServer({
      port: 5000
    })
    server.start((err) => {
      if (err) { return done(err) }

      request('http://localhost:5000', (err, res) => {
        if (err) { return done(err) }

        expect(err).to.be.null()
        expect(res.statusCode).to.equal(404)
        server.stop(done)
      })
    })
  })
})
