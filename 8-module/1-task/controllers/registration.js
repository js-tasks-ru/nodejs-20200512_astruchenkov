const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

// const

module.exports.register = async (ctx, next) => {
  try {
    let user = await User.findOne({email: ctx.request.body.email});
    if (user) {
      ctx.status = 400;
      ctx.body = {errors: {email: 'Такой email уже существует'}};
      return;
    }
    user = await new User({
      email: ctx.request.body.email,
      displayName: ctx.request.body.displayName,
      verificationToken: uuid(),
    });
    await user.setPassword(ctx.request.body.password);
    await user.save();

    // Отправим email пользователю
    if (user) {
      await sendMail({
        template: 'confirmation',
        locals: {token: user.verificationToken},
        to: user.email,
        subject: 'Подтвердите почту',
      });
      ctx.status = 200;
      ctx.body = {status: 'ok'};
    }
  } catch (e) {
    console.log(e);
    throw e;
  }
};

module.exports.confirm = async (ctx, next) => {
  try {
    const verificationToken = ctx.request.body.verificationToken;
    const user = await User.findOne({verificationToken});
    if (!user) {
      ctx.status = 400;
      ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
      return;
    }
    user.verificationToken = undefined;
    await user.save();
    ctx.status = 200;
    ctx.body = {token: uuid()};
  } catch (e) {
    console.log(e);
    throw e;
  }
};
