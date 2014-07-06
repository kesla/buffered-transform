var Transform = require('stream').Transform

  , test = require('tape')
  , bufferedTransform = require('./stream')

test('stream with one chunk and one data block', function (t) {
  t.plan(2)

  var stream = new Transform()

  stream._transform = bufferedTransform(
    function (chunk, enc, callback) {
      this.push(chunk)
      callback()
    }
  )

  stream.on('data', function (chunk) {
    t.deepEqual(chunk, new Buffer([ 1, 2, 3, 4, 5 ]))
  })

  stream.once('end', function () {
    t.pass('should emit end')
    t.end()
  })

  stream.write(new Buffer([ 5, 0, 0, 0, 1, 2, 3, 4, 5 ]))
  stream.end()
})

test('stream with 1 byte chunks', function (t) {
  t.end()
})

test('stream with chunks of different lengths', function (t) {
  t.end()
})

test('stream with one chunk with multiple data blocks', function (t) {
  t.end()
})