# buffered-transform[![build status](https://secure.travis-ci.org/kesla/buffered-transform.svg)](http://travis-ci.org/kesla/buffered-transform)

Buffer up data and give it to a transform-like method

[![NPM](https://nodei.co/npm/buffered-transform.png?downloads&stars)](https://nodei.co/npm/buffered-transform/)

[![NPM](https://nodei.co/npm-dl/buffered-transform.png)](https://nodei.co/npm/buffered-transform/)

## Installation

```
npm install buffered-transform
```

## Example

### Input

```javascript
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
```

### Output

```
the chunks of data
Hello
World!
the chunks of data
foo
the chunks of data
bar
```

## Licence

Copyright (c) 2014 David Björklund

This software is released under the MIT license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
