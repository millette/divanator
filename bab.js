// core
const path = require('path')

// npm
const UglifyJS = require('uglify-js')
const babel = require('babel-core')

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
    (err, ok) => err ? reject(new Error(err)) : resolve(minjs(noiife(ok)))
  )
  return (fn) => new Promise(transform.bind(null, fn))
})()

const divanator = (ddocPath) => {
  const resolve = path.resolve
  const lp = path.basename(ddocPath)
  return Promise.all([
    divanatorFile(resolve(ddocPath, 'shows/front.js')),
    divanatorFile(resolve(ddocPath, 'views/i1/map.js'))
  ])
    .then((x) => {
      return {
        _id: '_design/' + lp,
        rewrites: require(resolve(ddocPath, 'rewrites.json')),
        language: 'javascript',
        shows: { front: x[0] },
        views: { i1: { map: x[1], reduce: '_count' } }
      }
    })
}

const jsonlog = (x) => console.log(JSON.stringify(x, null, ' '))

// divanator('.')
divanator('ddoc/app')
  .then(jsonlog)
  .catch(console.log)
