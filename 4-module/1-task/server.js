const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('Не поддерживаются вложенные пути');
    return;
  }
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      fs.createReadStream(filepath)
          .on('error', (error) => {
            switch (error.code) {
              case 'ENOENT':
                res.statusCode = 404;
                res.end('Файл не найден');
                break;
              default:
                res.statusCode = 500;
                res.end('ошибка сервера');
            }
          })
          .pipe(res);

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
