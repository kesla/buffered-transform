var factory = function (callback) {
  var _transform = function (chunk, encoding, done) {
        var length = chunk.readUInt32LE(0)
          , self = this

        callback.call(this, chunk.slice(4, 4 + length), encoding, function (err) {
          chunk = chunk.slice(4 + length)

          if (err)
            done(err)
          else if (chunk.length === 0)
            done()
          else
            _transform.call(self, chunk, encoding, done)
        })
      }

  return _transform
}

module.exports = factory