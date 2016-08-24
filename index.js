'use strict'

// core
const path = require('path')
const fs = require('fs')

// npm
const UglifyJS = require('uglify-js')
const babel = require('babel-core')
const _ = require('lodash')
const glob = require('glob')
const nano = require('nano')
const pify = require('pify')
const fileType = require('file-type')
const mime = require('mime')

const readFile = (fn, bin) => new Promise((resolve, reject) => fs.readFile(
  fn, bin ? null : 'utf-8',
  (err, ok) => err ? reject(new Error(err)) : resolve(ok)
))

const globNoLib = (w, p) => new Promise((resolve, reject) => glob(
  p, { cwd: w, ignore: 'views/lib/**' },
  (err, ok) => err ? reject(new Error(err)) : resolve(ok)
))

const globAtts = (w) => new Promise((resolve, reject) => glob(
  'files/*', { cwd: w, nodir: true },
  (err, ok) => err ? reject(new Error(err)) : resolve(ok)
))

const getFiles = (w) => {
  const g = globNoLib.bind(null, w)
  return Promise.all([
    g('*(rewrites.json|rewrites.js|validate_doc_update.js)'),
    g('*(shows|lists|filters|updates)/*.js'),
    g('views/*/map.js'),
    g('views/*/reduce'),
    g('views/*/reduce.js')
  ]).then(_.flatten)
}

const divanatorFile = (() => {
  const exported = (() => {
    const re = /module.exports = (function \([^]+\})/
    return (str) => str.code.match(re)[1]
  })()
  const minjs = (() => {
    const repin = (str) => str.replace('function (', 'function fn(')
    const repout = (str) => str.replace('function fn(', 'function(')
    return (str) =>
      repout(UglifyJS.minify(repin(exported(str)), { fromString: true }).code)
  })()
  const transform = (fn, resolve, reject) => babel.transformFile(
    fn, { presets: ['es2015'] },
    (err, ok) => err ? reject(new Error(err)) : resolve(minjs(ok))
  )

  return (fn2, resolver) => {
    const fn = resolver(fn2)
    let out
    switch (path.extname(fn)) {
      case '.js':
        out = new Promise(transform.bind(null, fn))
        break
      case '.json':
        out = require(fn)
        break
      case '':
        out = readFile(fn)
        break
      // default:
        // throw new Error('unknown extension')
    }
    return Promise.resolve(out)
      .then((a) => {
        const z = path.parse(fn2)
        z.base = z.name // remove extension
        const y = path.format(z)
        const x = y.split('/')
        const xl = x.length
        const ddoc = { _id: '_design/' + fn.split('/').slice(-xl - 1, -xl)[0] }

        switch (xl) {
          case 1:
            ddoc[x[0]] = a
            break

          case 2:
            ddoc[x[0]] = { }
            ddoc[x[0]][x[1]] = a
            break

          case 3:
            ddoc[x[0]] = { }
            ddoc[x[0]][x[1]] = { }
            ddoc[x[0]][x[1]][x[2]] = a
            break

          // default:
            // throw new Error('In too deep.')
        }
        return ddoc
      })
  }
})()

module.exports = (ddocPath, dbURL) => {
  const resolver = path.resolve.bind(null, ddocPath)

  const p = getFiles(ddocPath)
    .then((f) => Promise.all(f.map((z) => divanatorFile(z, resolver))))
    .then((g) => {
      const ddoc = _.merge.apply(null, g)
      if (!ddoc._id) { throw new Error('Are you sure ' + ddocPath + ' is a design doc?') }
      return ddoc
    })

  if (!dbURL) { return p }

  const db = nano(dbURL)
  return p
    .then((ddoc) => {
      const info = pify(db.info)
      return Promise.all([ddoc, info()])
    })
    .then((gg) => {
      const ddoc = gg[0]
      const head = (docid) => new Promise((resolve, reject) =>
        db.head(docid, (err, body, headers) => resolve(err ? { } : headers))
      )
      return Promise.all([ddoc, head(ddoc._id)])
    })
    .then((gg) => {
      const ddoc = gg[0]
      const a = gg[1]
      if (a.etag) { ddoc._rev = a.etag.slice(1, -1) }
      return ddoc
    })
    .then((ddoc) => Promise.all([ddoc, globAtts(ddocPath)]))
    .then((gg) => {
      const ddoc = gg[0]
      const atts = gg[1]
      const attObj = (fn, f) => {
        let ft = fileType(f)
        ft = ft && ft.mime ? ft.mime : mime.lookup(fn)
        return {
          name: path.basename(fn),
          data: f,
          content_type: ft
        }
      }
      const ha = atts.map((fn) => readFile(resolver(fn), true).then(attObj.bind(null, fn)))
      ha.unshift(ddoc)
      return Promise.all(ha)
    })
    .then((tt) => {
      const ddoc = tt[0]
      const atts = tt.slice(1)
      const insert = pify(db.multipart.insert)
      return insert(ddoc, atts, ddoc._id)
    })
}
