var factory = function (callback) {
  var _transform = function (chunk, encoding, done) {
    callback.call(this, chunk.slice(4), encoding, done)
      }

  return _transform
}

module.exports = factory