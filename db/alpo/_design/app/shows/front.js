(() => function (doc, req) {
  let ret = '<html><head><meta charset="utf-8"></head><body>'

  if (req.id && !doc) {
    ret += '<p>404, oups.</p>'
    ret += `<pre>${JSON.stringify(this, null, ' ')}</pre>`
    ret += `<pre>${JSON.stringify(req, null, ' ')}</pre>`
    return {
      code: 404,
      body: ret
    }
  }

  ret += '<p>Hello monde</p>'
  ret += `<pre>${JSON.stringify(this, null, ' ')}</pre>`
  ret += `<pre>${JSON.stringify(req, null, ' ')}</pre>`
  ret += `<pre>${JSON.stringify(doc, null, ' ')}</pre>`
  return ret
})()
