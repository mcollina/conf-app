'use strict'

const Lab = require('lab')
const Code = require('code')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect

const buildServer = require('./server')

describe('server', () => {
  it('should support a /talks endpoint', (done) => {
    const server = buildServer()
    server.inject('/talks', (res) => {
      expect(JSON.parse(res.payload)).to.deep.equal([])
      done()
    })
  })
})
