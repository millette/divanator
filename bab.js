// core
const path = require('path')
const fs = require('fs')

// npm
const UglifyJS = require('uglify-js')
const babel = require('babel-core')
const pify = require('pify')
const _ = require('lodash')

const readDir = pify(fs.readdir)

/*
f.forEach((z) => {
  divanatorFile(resolve(z))
    .then((y) => {
      ddoc[path.basename(z, path.extname(z))] = y
    })
})
*/

const divanatorFile = (() => {
  const noiife = (() => {
    const re = /return (function *\([^]+\};)/m
    return (x) => x.code.match(re)[1]
  })()
  const minjs = (() => {
    const repin = (str) => str.replace('function (', 'function fn(')
    const repout = (str) => str.replace('function fn(', 'function(')
    return (str) => repout(UglifyJS.minify(repin(str), { fromString: true }).code)
  })()
  const transform = (fn, resolve, reject) => babel.transformFile(
    fn, { presets: ['es2015'] },
    (err, ok) => err ? Promise.reject(new Error(err)) : minjs(noiife(ok))
  )
  return (fn) => {
    console.log('fn:', fn)
    switch (path.extname(fn)) {
      case '.js':
        return new Promise(transform.bind(null, fn))
      case '.json':
        return Promise.resolve(require(fn))
      default:
        throw new Error('unknown extension')
    }
  }
})()

const jsonlog = (x) => console.log(JSON.stringify(x, null, ' '))

const divanator = (ddocPath) => {
  const resolve = path.resolve.bind(null, ddocPath)

  const ddoc = {
    _id: '_design/' + path.basename(ddocPath),
    language: 'javascript'
  }

  const wantFiles = [
    'rewrites.json',
    'validate_doc_update.js'
    // 'rewrites.js', TODO
    // '_security.json', TODO
  ]

/*
  const wantDirs = [
    'shows',
    'lists',
    'filters',
    'updates',
    'views'
  ]
*/

  return readDir(ddocPath)
    .then((paths) => {
      const finder = _.intersection.bind(null, paths)
      const f = finder(wantFiles)
      // const d = finder(wantDirs)
      // console.log(paths)
      // console.log(f)
      // console.log(d)

      f.forEach((z) => {
        divanatorFile(resolve(z))
          .then((y) => {
            ddoc[path.basename(z, path.extname(z))] = y
          })
      })

/*
      const i = d.indexOf('views')
      if (i !== -1) {
        delete d[i]
        readDir(resolve('views'))
          .then((y) => {
            console.log('n2:', y)
          })
      }

      d.forEach((z, n) => {
        readDir(resolve(z))
          .then((y) => {
            console.log('n:', n, z, y)

            y.forEach((za) => {
              ddoc[z] = { }
              divanatorFile(resolve(z, za))
                .then((ya) => {
                  // console.log('ya:', ya)
                  // console.log('ay:', path.extname(za), path.basename(za, path.extname(za)))
                  ddoc[z][path.basename(za, path.extname(za))] = ya
                  jsonlog(ddoc)
                })
            })
          })
      })
*/
    })
    .then(() => ddoc)
    .catch(console.log)

  /*
   * now we should go looking for directories and files:
   * (using @ in place of *)
   * _security.json
   * rewrites.{json|js} // TODO: js with CouchDB 1.7 at least
   * validate_doc_update.js
   * shows/@.js
   * lists/@.js
   * filters/@.js
   * updates/@.js
   * views/lib/@@
   * views/@/{map|reduce}[.js]
   *
   */
}

/*
  return Promise.all([
    divanatorFile(resolve('shows/front.js')),
    divanatorFile(resolve('views/i1/map.js'))
  ])
    .then((x) => {
      return {
        _id: '_design/' + lp,
        rewrites: require(resolve('rewrites.json')),
        language: 'javascript',
        shows: { front: x[0] },
        views: { i1: { map: x[1], reduce: '_count' } }
      }
    })
}
*/

// divanator('.')
divanator('ddoc/app')
  .then(jsonlog)
  .catch(console.log)
