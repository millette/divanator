'use strict'
import test from 'ava'
import fn from './'

// test.serial('go', async t => {
test('go', async t => {
  const result = await fn('ddoc/app')
  t.is(result._id, '_design/app')
})

test('not a ddoc', async t => await t.throws(fn('ddoc/app666'), 'Are you sure ddoc/app666 is a design doc?'))

if (process.env.MEVLA_COUCHDB) {
  test.serial('db', async t => {
    const result = await fn('ddoc/app', 'http://localhost:5984/bobo')
    t.is(result.id, '_design/app')
  })

  test.serial('not a db', async t => await t.throws(fn('ddoc/app', 'http://localhost:5984/notexist'), 'no_db_file'))
}

test('not a couchdb', async t => await t.throws(fn('ddoc/app', 'http://localhost:5987/notexist'), 'error happened in your connection'))
