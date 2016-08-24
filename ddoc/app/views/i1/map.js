/* globals emit */
'use strict'
module.exports = function (doc, mocks) {
  if (!mocks) { mocks = { emit: emit } }
  mocks.emit(doc._id, doc._rev)
}
