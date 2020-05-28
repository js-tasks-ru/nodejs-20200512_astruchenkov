const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

function sendServerError(res) {
  res.statusCode = 500;
  res.end = 'Ошибка сервера';
  return;
}

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  if (pathname.split('/').length > 1) {
    res.statusCode = 400;
    res.end('не поддерживаются вложенные пути');
    return;
  }
  const filepath = path.join(__dirname, 'files', pathname);


  switch (req.method) {
    case 'DELETE':
      try {
        fs.statSync(filepath);
      } catch (err) {
        if (err.code ==='ENOENT') {
          res.statusCode = 404;
          res.end('Файл'+pathname+ ' не найден');
          return;
        }
        sendServerError(res);
      }

      fs.unlink(filepath, (error) => {
        if (error) {
          console.error(error);
          return;
        }
        res.statusCode = 200;
        res.end('Файл '+ pathname + ' удалён');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
