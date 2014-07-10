var varint = require('varint')

  , factory = function (callback) {
      var transformBuffer = null
        , _transform = function (chunk, encoding, done) {
            var self = this
              , dataSize
              , dataSizeLength
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

            while(true) {
              dataSize = varint.decode(transformBuffer, ptr)
              dataSizeLength = varint.decode.bytes
              if (dataSize === undefined)
                break

              endPtr = ptr + dataSize + dataSizeLength

              if (endPtr > transformBuffer.length)
                break

              chunks.push(transformBuffer.slice(ptr + dataSizeLength, endPtr))
              ptr = endPtr
            }

            finish()
          }

      return _transform
    }

module.exports = factory