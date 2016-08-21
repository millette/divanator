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
    fn,
    { presets: ['es2015'] },
    (err, ok) => err ? reject(new Error(err)) : resolve(minjs(noiife(ok)))
  )
  return (fn) => new Promise(transform.bind(null, fn))
})()

const jsonlog = (x) => console.log(JSON.stringify(x, null, ' '))

Promise.all([
  divanatorFile('db/alpo/_design/app/shows/front.js'),
  divanatorFile('db/alpo/_design/app/views/i1/map.js')
])
  .then((x) => {
    return {
      _id: '_design/app',
      language: 'javascript',
      shows: {
        front: x[0]
      },
      views: {
        i1: {
          map: x[1],
          reduce: '_count'
        }
      }
    }
  })
  .then(jsonlog)
  .catch(console.log)
