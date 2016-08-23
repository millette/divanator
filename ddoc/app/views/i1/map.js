/* globals emit */
export default function (doc) {
  emit(doc._id, doc._rev)
}
