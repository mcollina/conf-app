'use strict'

const Lab = require('lab')
const Code = require('code')
const Hapi = require('hapi')
const clean = require('mongo-clean')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect
const beforeEach = lab.beforeEach
const url = require('../helper').url

const talks = require('../../lib/talks')
const testCredentials = {username: 'test', password: 'test'}

describe('talks', () => {
  let server

  beforeEach((done) => {
    server = new Hapi.Server()
    server.connection({ port: 0 })

    server.register(require('hapi-auth-basic'), (err) => {
      if (err) return done(err)
      server.auth.strategy('simple', 'basic', { validateFunc: require('../../lib/users/check')(server) })
      server.register([{
        register: require('hapi-mongodb'),
        options: {
          url: url
        }
      }, talks], (err) => {
        if (err) { return done(err) }
        clean(server.plugins['hapi-mongodb'].db, done)
      })
    })
  })

  it('should GET empty /talks', (done) => {
    server.inject({url: '/talks', credentials: testCredentials}, (res) => {
      expect(JSON.parse(res.payload)).to.deep.equal([])
      done()
    })
  })

  it('should POST /talks', (done) => {
    const expected = {
      title: 'We are not Object-Oriented anymore',
      speaker: 'Mateo Collina'
    }
    server.inject({
      method: 'POST',
      url: '/talks',
      payload: expected,
      credentials: testCredentials
    }, (res) => {
      const stored = JSON.parse(res.payload)
      expect(res.statusCode).to.equal(201)
      expect(stored).to.include(expected)
      server.inject({url: '/talks', credentials: testCredentials}, (res) => {
        expect(JSON.parse(res.payload)).to.deep.equal([stored])
        done()
      })
    })
  })

  it('should not POST /talks with missing speaker', (done) => {
    const expected = {
      title: 'We are not Object-Oriented anymore'
    }
    server.inject({
      method: 'POST',
      url: '/talks',
      payload: expected, credentials: testCredentials

    }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })

  it('should not POST /talks with missing speaker', (done) => {
    const expected = {
      speaker: 'Mateo Collina'
    }
    server.inject({
      method: 'POST',
      url: '/talks',
      payload: expected, credentials: testCredentials

    }, (res) => {
      expect(res.statusCode).to.equal(400)
      done()
    })
  })

  it('should GET /talks/{id}', (done) => {
    const expected = {
      title: 'We are not Object-Oriented anymore',
      speaker: 'Mateo Collina'
    }
    server.inject({
      method: 'POST',
      url: '/talks',
      payload: expected, credentials: testCredentials

    }, (res) => {
      const stored = JSON.parse(res.payload)
      expect(stored).to.include(expected)
      server.inject({url: '/talks/' + stored._id, credentials: testCredentials}, (res) => {
        expect(res.statusCode).to.equal(200)
        expect(JSON.parse(res.payload)).to.deep.equal(stored)
        done()
      })
    })
  })
})
