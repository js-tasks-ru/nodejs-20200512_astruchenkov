const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.encoding = options.encoding;
    this.line = '';
  }

  _transform(chunk, encoding, callback) {

    const chunkStr = chunk.toString(this.encoding);
    const lines = chunkStr.split(os.EOL);
    if (lines.length > 1) {
      for (let i = 0; i < lines.length - 1; i++) {
        this.line += lines[i];
        this.push(this.line);
      }
      this.line = lines[lines.length - 1];
    } else {
      this.line += chunkStr;
    }

    callback();
  }

  _flush(callback) {
    callback(null, this.line);
  }
}

module.exports = LineSplitStream;