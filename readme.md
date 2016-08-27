# Divanator

[![Build Status](https://travis-ci.org/millette/divanator.svg?branch=master)](https://travis-ci.org/millette/divanator)
[![Coverage Status](https://coveralls.io/repos/github/millette/divanator/badge.svg?branch=master)](https://coveralls.io/github/millette/divanator?branch=master)
[![Dependency Status](https://gemnasium.com/badges/github.com/millette/divanator.svg)](https://gemnasium.com/github.com/millette/divanator)
> Compile CouchDB design docs written in modern JavaScript.

## Install
```
$ npm install --save divanator
```

Database name is "alpo".

By default, http://localhost:5984

To change the deployment URL:

npm config set alpo:dburl https://USERNAME:PASSWORD@server.example.com

## Building on divanator
[feverish][] builds on divanator, providing a cli with built-in help.
See that project for an example to use divanator. You can expect that
a few features will migrate upwards from [feverish][] to this project.

## Missing features
Currently doesn't handle view/lib/ content.

We're not providing polyfills thru babel yet. So some things like
```Object.assign()``` won't work in a design document function.

## License
AGPL-v3 © [Robin Millette](http://robin.millette.info)

[feverish]: <https://github.com/millette/feverish>
