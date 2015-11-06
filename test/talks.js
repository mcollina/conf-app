'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect
const beforeEach = lab.beforeEach

const talks = require('../lib/talks')

describe('talks', () => {
  let server

  beforeEach((done) => {
    server = new Hapi.Server()
    server.connection({ port: 0 })
    server.register(talks, done)
  })

  it('should support a /talks endpoint', (done) => {
    server.inject('/talks', (res) => {
      expect(JSON.parse(res.payload)).to.deep.equal([])
      done()
    })
  })
})
