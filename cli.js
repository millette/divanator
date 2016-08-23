#!/usr/bin/env node
'use strict'

const divanator = require('.')

const jsonlog = (x) => console.log(JSON.stringify(x, null, ' '))

if (!process.argv[2]) {
  console.error('Need design doc path as argument.')
  process.exit()
}

divanator(process.argv[2], process.argv[3])
  .then(jsonlog)
  .catch(console.error)
