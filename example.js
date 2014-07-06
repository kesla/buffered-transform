var Transform = require('stream').Transform

  , bufferedTransform = require('./buffered-transform')

var stream = new Transform()

stream._transform = bufferedTransform(function (chunks, callback) {
  console.log('the chunks of data')
  chunks.forEach(function (chunk) {
    console.log(chunk.toString())
  })
  this.push('beep boop')
  callback()
})

stream.write(
  Buffer.concat([
        // size is first 4 bytes, as UInt32LE
        new Buffer([ 5, 0, 0, 0])
        // then come the actual data
      , new Buffer('Hello')
      , new Buffer([ 6, 0, 0, 0])
      , new Buffer('World!')
  ])
)

stream.write(new Buffer([ 3, 0, 0, 0]))
stream.write(new Buffer('foo'))
stream.write(new Buffer([ 3, 0, 0, 0]))
stream.write(new Buffer('bar'))
stream.end()