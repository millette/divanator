'use strict'

const divanator = require('.')

const jsonlog = (x) => console.log(JSON.stringify(x, null, ' '))

divanator('ddoc/app')
  .then(jsonlog)
  .catch(console.log)
