'use strict'

const Lab = require('lab')
const Code = require('code')
const clean = require('mongo-clean')

const lab = exports.lab = Lab.script()
const describe = lab.describe
const it = lab.it
const expect = Code.expect
const beforeEach = lab.beforeEach
const afterEach = lab.afterEach

const talks = require('../../lib/data/talks')

const url = 'mongodb://localhost:27017/tests'

describe('talks', () => {
  let db

  beforeEach((done) => {
    clean(url, (err, toSet) => {
      db = toSet
      done(err)
    })
  })

  afterEach((done) => {
    db.close(done)
    db = null
  })

  it('should put and get an entry', (done) => {
    const instance = talks(db)
    const expected = {
      title: 'Hapi workshop',
      speaker: 'Matteo Collina'
    }

    instance.put(expected, (err, entry) => {
      expect(err).to.be.null()
      expect(entry).to.include(expected)
      expect(entry._id).to.exists()

      instance.getById(entry._id, (err, entry2) => {
        expect(err).to.be.null()
        expect(entry2).to.deep.equal(entry)
        done()
      })
    })
  })
})
