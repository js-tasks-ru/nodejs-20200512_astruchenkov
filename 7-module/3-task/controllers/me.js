const Session = require('../models/Session');
module.exports.me = async function me(ctx, next) {
  const token = (ctx.header.authorization) ? ctx.header.authorization.split('Bearer ')[1] : null;
  if (!token) {
    ctx.status = 401;
    ctx.body = {error: 'Пользователь не залогинен'};
    return;
  }

  try {
    const session = await Session.findOne({token: token}).populate('user');
    if (session) {
      session.lastVisit = new Date();
      await session.save();
      ctx.user = session.user;
    } else {
      ctx.status = 401;
      ctx.body = {error: 'Неверный аутентификационный токен'};
      return;
    }

    if (ctx.user) {
      ctx.body = {
        email: ctx.user.email,
        displayName: ctx.user.displayName,
      };
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};
