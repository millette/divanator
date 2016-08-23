'use strict'
import test from 'ava'
import fn from './'

test('go', async t => {
  const result = await fn('ddoc/app')
  t.is(result._id, '_design/app')
})

test('not a ddoc', async t => await t.throws(fn('ddoc/app666'), 'Are you sure ddoc/app666 is a design doc?'))