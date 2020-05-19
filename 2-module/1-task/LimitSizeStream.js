const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.bufferSize = 0;
  }

  _transform(chunk, encoding, callback) {
    // LimitExceededError
    this.bufferSize += chunk.length;
    if (this.bufferSize > this.limit) {
      this.destroy(new LimitExceededError());
    } else {
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;