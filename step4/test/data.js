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

const url = require('./helper').url

const talks = require('../lib/data')

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
        expect(entry2).to.equal(entry)
        done()
      })
    })
  })

  it('should put and list entries', (done) => {
    const instance = talks(db)
    const expected1 = {
      title: 'Hapi workshop',
      speaker: 'Matteo Collina'
    }
    const expected2 = {
      title: 'Connected House',
      speaker: 'Marco Piraccini'
    }

    instance.put(expected1, (err, entry1) => {
      expect(err).to.be.null()
      expect(entry1).to.include(expected1)
      expect(entry1._id).to.exists()

      instance.put(expected2, (err, entry2) => {
        expect(err).to.be.null()
        expect(entry2).to.include(expected2)
        expect(entry2._id).to.exists()

        instance.list((err, entries) => {
          expect(err).to.be.null()
          expect(entries).to.equal([
            entry1,
            entry2
          ])
          done()
        })
      })
    })
  })
})
