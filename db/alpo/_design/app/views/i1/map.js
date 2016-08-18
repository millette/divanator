/* globals emit */
(function () {
  'use strict'

  return function (doc) {
    emit(doc._id, doc._rev)
  }
}())
