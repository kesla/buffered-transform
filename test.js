var Transform = require('stream').Transform

  , test = require('tape')
  , varint = require('varint')

  , bufferedTransform = require('./buffered-transform')

  , collectData = function (stream, callback) {
      var data = []

      stream.on('data', function (chunk) {
        data.push(chunk)
      })
      stream.once('end', function () {
        callback(null, data)
      })
    }

  , INPUT = input = []
      // size
      .concat(varint.encode(3))
      // data
      .concat([1, 2, 3])
      // size
      .concat(varint.encode(4))
      // data
      .concat([4, 7, 1, 1])
      // size
      .concat(varint.encode(1))
      // data
      .concat([9])

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

  stream.write(Buffer.concat([
      // size
      new Buffer(varint.encode(5))
      // data
    , new Buffer([ 1, 2, 3, 4, 5 ])
  ]))

  stream.end()
})

test('stream with 1 byte chunks', function (t) {
  var stream = new Transform()
    , count = 0
    , expected = [
          new Buffer([ 1, 2, 3 ])
        , new Buffer([ 4, 7, 1, 1 ])
        , new Buffer([ 9 ])
      ]

  stream._transform = bufferedTransform(
    function (chunks, callback) {
      var self = this
      t.equal(chunks.length, 1, 'correct number of chunks')
      t.deepEqual(chunks[0], expected[count])
      count++
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

  INPUT.forEach(function (num) {
    stream.write(new Buffer([ num ]))
  })
  stream.end()
})

test('stream with chunks of different lengths', function (t) {
  var stream = new Transform()
    , count = 0
    , expected = [
          new Buffer([ 1, 2, 3 ])
        , new Buffer([ 4, 7, 1, 1 ])
        , new Buffer([ 9 ])
      ]

  stream._transform = bufferedTransform(
    function (chunks, callback) {
      var self = this
      chunks.forEach(function (chunk) {
        t.deepEqual(chunk, expected[count])
        count++
        self.push(chunk)
      })
      callback()
    }
  )

  collectData(stream, function (err, data) {
    t.equal(data.length, 3, 'correct chunks emitted')
    t.deepEqual(data[0], expected[0])
    t.deepEqual(data[1], expected[1])
    t.deepEqual(data[2], expected[2])
    t.end()
  })

  for(var i = 0; i + 4 < INPUT.length; i += 4)
    stream.write(new Buffer(INPUT.slice(i, i + 4)))
  stream.write(new Buffer(INPUT.slice(i)))

  stream.end()
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

  stream.write(new Buffer(INPUT))
  stream.end()

})