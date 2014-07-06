var factory = function (callback) {
  var _transform = function (stream, chunk, encoding, done) {
        var length = chunk.readUInt32LE(0)

        callback.call(stream, chunk.slice(4, 4 + length), encoding, function (err) {
          chunk = chunk.slice(4 + length)

          if (err)
            done(err)
          else if (chunk.length === 0)
            done()
          else
            _transform(stream, chunk, encoding, done)
        })
      }

  return function (chunk, encoding, callback) {
    _transform(this, chunk, encoding, callback)
  }
}

module.exports = factory