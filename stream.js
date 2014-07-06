var factory = function (callback) {
  var _transform = function (chunk, encoding, done) {
        var self = this
          , ptr = 0
          , chunks = []
          , finish = function () { callback.call(self, chunks, done) }

        while (ptr + 4 < chunk.length) {
          endPtr = ptr + chunk.readUInt32LE(ptr) + 4
          ptr += 4
          if (endPtr > chunk.length)
            return finish()

          chunks.push(chunk.slice(ptr, endPtr))
          ptr = endPtr
        }

        finish()
      }

  return _transform
}

module.exports = factory