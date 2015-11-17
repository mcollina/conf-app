'use strict'

const Lab = require('lab')
const Code = require('code')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const beforeEach = lab.beforeEach
const it = lab.it
const expect = Code.expect

const buildServer = require('../server')

describe('server', () => {
  let server

  beforeEach((done) => {
    server = buildServer({ port: 3000 })
    done()
  })

  it('should support a /talks endpoint', (done) => {
    server.inject('/talks', (res) => {
      expect(JSON.parse(res.payload)).to.deep.equal([])
      done()
    })
  })

  it('should GET empty /talks', (done) => {
    server.inject({ url: '/talks' }, (res) => {
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
      payload: expected
    }, (res) => {
      const stored = JSON.parse(res.payload)
      expect(res.statusCode).to.equal(201)
      expect(stored).to.include(expected)
      server.inject({url: '/talks'}, (res) => {
        expect(JSON.parse(res.payload)).to.deep.equal([stored])
        done()
      })
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
      payload: expected
    }, (res) => {
      const stored = JSON.parse(res.payload)
      expect(stored).to.include(expected)
      server.inject({url: '/talks/' + stored._id}, (res) => {
        expect(res.statusCode).to.equal(200)
        expect(JSON.parse(res.payload)).to.deep.equal(stored)
        done()
      })
    })
  })
})
