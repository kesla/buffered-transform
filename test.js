var Transform = require('stream').Transform

  , test = require('tape')
  , bufferedTransform = require('./stream')

  , collectData = function (stream, callback) {
      var data = []

      stream.on('data', function (chunk) {
        data.push(chunk)
      })
      stream.once('end', function () {
        callback(null, data)
      })
    }

test('stream with one chunk and one data block', function (t) {
  t.plan(4)

  var stream = new Transform()

  stream._transform = bufferedTransform(
    function (chunks, callback) {
      t.equal(chunks.length, 1, 'correct number of chunks')
      t.deepEqual(chunks[0], new Buffer([ 1, 2, 3, 4, 5 ]))
      this.push(chunks[0])
      callback()
    }
  )

  collectData(stream, function (err, data) {
    t.equal(data.length, 1, 'correct chunks emitted')
    t.deepEqual(data[0], new Buffer([ 1, 2, 3, 4, 5 ]))
    t.end()
  })

  stream.write(new Buffer([
    // size
    5, 0, 0, 0,
    // data
    1, 2, 3, 4, 5
  ]))
  stream.end()
})

test('stream with 1 byte chunks', function (t) {
  t.end()
})

test('stream with chunks of different lengths', function (t) {
  t.end()
})

test('stream with one chunk with multiple data blocks', function (t) {
  var stream = new Transform()

  stream._transform = bufferedTransform(
    function (chunks, callback) {
      var self = this
      t.equal(chunks.length, 3, 'correct number of chunks')
      t.deepEqual(chunks[0], new Buffer([ 1, 2, 3 ]))
      t.deepEqual(chunks[1], new Buffer([ 4, 7, 1, 1 ]))
      t.deepEqual(chunks[2], new Buffer([ 9 ]))
      chunks.forEach(function (chunk) {
        self.push(chunk)
      })
      callback()
    }
  )

  collectData(stream, function (err, data) {
    t.equal(data.length, 3, 'correct chunks emitted')
    t.deepEqual(data[0], new Buffer([ 1, 2, 3 ]))
    t.deepEqual(data[1], new Buffer([ 4, 7, 1, 1 ]))
    t.deepEqual(data[2], new Buffer([ 9 ]))
    t.end()
  })

  stream.write(new Buffer([
    // size
    3, 0, 0, 0,
    // data
    1, 2, 3,
    // size
    4, 0, 0, 0,
    // data
    4, 7, 1, 1,
    // size
    1, 0, 0, 0,
    9
  ]))
  stream.end()

})