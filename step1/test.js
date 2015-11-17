'use strict'

const Lab = require('lab')
const Code = require('code')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

const buildServer = require('./server')

describe('server', () => {
  it('should support return a 404 when accessing /', (done) => {
    const server = buildServer()
    server.inject('/', (res) => {
      expect(res.statusCode).to.equal(404)
      done()
    })
  })
})
