(function () {
  'use strict'

  return function (doc, req) {
    var ret = '<html><head><meta charset="utf-8"></head><body>'

    if (req.id && !doc) {
      ret += '<p>404, oups.</p>'
      ret += '<pre>' + JSON.stringify(req, null, ' ') + '</pre>'
      return {
        code: 404,
        body: ret
      }
    }

    ret += '<p>Hello monde</p>'
    ret += '<pre>' + JSON.stringify(doc, null, ' ') + '</pre>'
    ret += '<pre>' + JSON.stringify(req, null, ' ') + '</pre>'
    return ret
  }
}())
