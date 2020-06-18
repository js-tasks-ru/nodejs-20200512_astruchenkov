const passport = require('../libs/passport');
const Session = require('../models/Session');

module.exports.login = async function login(ctx, next) {
  await passport.authenticate('local', async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = {error: info};
      return;
    }

    const token = await ctx.login(user);
    try {
      let userSession = await Session.findOne({token: token}).populate('user');
      if (!userSession) {
        userSession = await Session.create({
          token: token,
          lastVisit: new Date(),
          user: user,
        });
        ctx.user = user;
      }
      // console.log(userSession);
      ctx.body = {token: (userSession) ? userSession.token: token};
    } catch (e) {
      console.log({error: e});
      throw e;
    }
  })(ctx, next);
};
