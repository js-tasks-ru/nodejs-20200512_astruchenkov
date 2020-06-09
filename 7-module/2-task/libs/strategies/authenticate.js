const User = require('../../models/User');
module.exports = async function authenticate(strategy, email, displayName, done) {
  if (!email) {
    return done(null, false, 'Не указан email');
  }
  let user = await User.findOne({email});
  if (!user) {
    user = await new User({email, displayName});
    try {
      await user.save();
    } catch (e) {
      return done(e);
    }
  }
  return done(null, user, null);
};
