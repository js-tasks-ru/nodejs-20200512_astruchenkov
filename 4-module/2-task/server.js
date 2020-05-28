const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');
const LimitSizeStream = require('./LimitSizeStream');
const LimitExceedError = require('./LimitExceededError');
const FILE_SIZE_LIMIT = 1024*1024; // bytes

const server = new http.Server();

function sendServerError(res) {
  res.statusCode = 500;
  res.end = 'Ошибка сервера';
  return;
}


server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  if (!pathname.length) {
    res.statusCode = 400;
    res.end('Не задано имя файла');
    return;
  }

  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('не поддерживаются вложенные пути');
    return;
  }


  switch (req.method) {
    case 'POST':
      try {
        fs.statSync(filepath);
        res.statusCode = 409;
        res.end('Файл с именем '+pathname+ ' уже сохранён');
        return;
      } catch (err) {
        // console.error(err);
      }
      const fileWriteStream = fs.createWriteStream(filepath);
      const fileSizeLimitter = new LimitSizeStream({limit: FILE_SIZE_LIMIT});

      fileSizeLimitter.on('error', (error)=>{
        if (error instanceof LimitExceedError) {
          try {
            fs.unlinkSync(filepath);
          } catch (err) {
            // sendServerError(res);
          }
          fileWriteStream.destroy();
          res.statusCode = 413;
          res.end('Превышен максмальный размер файла в '+ FILE_SIZE_LIMIT + ' байт');

          return;
        } else {
          sendServerError(res);
        }
      });

      fileWriteStream
          .on('error', (err) =>{
            fs.unlink(filepath, (error) => {});
            sendServerError(res);
          });

      res.on('close', () => {
        if (res.finished) return;
        fs.unlink(filepath, (error) => {});
      });

      req.on('error', (err) => {
        fs.unlink(filepath, (error) => {});
        sendServerError(res);
      });

      req.on('end', () =>{
        res.statusCode=201;
        res.end(pathname + ' файл сохранён');
      });

      req.pipe(fileSizeLimitter).pipe(fileWriteStream);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
