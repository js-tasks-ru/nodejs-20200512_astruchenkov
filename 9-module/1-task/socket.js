const socketIO = require('socket.io');

const Session = require('./models/Session');
const Message = require('./models/Message');

function socket(server) {
  const io = socketIO(server);

  io.use(async function(socket, next) {
    const token = socket.request._query.token;
    if (!token) {
      return socket.error('anonymous sessions are not allowed');
    }
    // Найдём сессию пользователя
    try {
      const session = await Session.findOne({token}).populate('user');
      if (!session) {
        return socket.error('wrong or expired session token');
      }
      socket.session = session;
    } catch (e) {
      console.log(e);
      throw e;
    }
    next();
  });

  io.on('connection', function(socket) {
    socket.on('message', async (msg) => {
      try {
        if (socket.session) {
          const message = await Message.create({
            date: new Date,
            text: msg,
            chat: socket.session.user._id,
            user: socket.session.user.displayName,
          });
        }
      } catch (e) {
        console.log('message error: ', e);
        throw e;
      }
    });
  });

  return io;
}

module.exports = socket;
