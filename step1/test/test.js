'use strict'

const Lab = require('lab')
const Code = require('code')
const request = require('request')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const beforeEach = lab.beforeEach
const it = lab.it
const expect = Code.expect

const buildServer = require('../server')

describe('server', () => {
  let server

  beforeEach((done) => {
    server = buildServer()
    done()
  })

  it('returns a 404 when accessing /', (done) => {
    server.inject('/', (res) => {
      expect(res.statusCode).to.equal(404)
      done()
    })
  })

  it('successfully start', (done) => {
    server = buildServer({
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

  it('returns an empty list when GET /talks', (done) => {
    server.inject('/talks', (res) => {
      expect(res.statusCode).to.equal(200)
      expect(JSON.parse(res.payload)).to.equal([])
      done()
    })
  })
})
