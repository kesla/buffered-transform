var factory = function (callback) {
      var transformBuffer = null
        , _transform = function (chunk, encoding, done) {
            var self = this
              , endPtr
              , ptr = 0
              , chunks = []
              , finish = function () {
                  if (ptr !== 0)
                    transformBuffer = transformBuffer.slice(ptr)

                  if (chunks.length > 0)
                    callback.call(self, chunks, done)
                  else
                    done()
                }

            if (transformBuffer)
              transformBuffer = Buffer.concat([
                  transformBuffer, chunk
              ])
            else
              transformBuffer = chunk

            while (ptr + 4 < transformBuffer.length) {
              endPtr = ptr + transformBuffer.readUInt32LE(ptr) + 4
              if (endPtr > transformBuffer.length)
                return finish()

              chunks.push(transformBuffer.slice(ptr + 4, endPtr))
              ptr = endPtr
            }

            finish()
          }

      return _transform
    }

module.exports = factory