'use strict'
import test from 'ava'
import fn from './ddoc/app/shows/front'
import fn2 from './ddoc/app/views/i1/map'

test('show front', t => {
  const doc = {}
  const req = {}
  const result = fn(doc, req)
  t.is(result, '<html><head><meta charset="utf-8"></head><body><p>Hello monde</p><pre>{}</pre><pre>{}</pre>')
})

test('show front 404', t => {
  const doc = null
  const req = { id: 'abc' }
  const result = fn(doc, req)
  t.is(result.code, 404)
})

test('view il', t => {
  const doc = { _id: 'le-id', _rev: '1-abc' }
  t.plan(2)
  fn2(doc, {
    emit: (k, v) => {
      t.is(k, 'le-id')
      t.is(v, '1-abc')
    }
  })
})
