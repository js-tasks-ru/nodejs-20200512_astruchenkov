const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      if (email) {
        let user = await User.findOne({email});
        if (user) {
          if (!await user.checkPassword(password)) {
            return done(null, false, 'Неверный пароль');
          }
        } else {
          try {
            user = await new User({
              email,
              displayName: email.split('@')[0],
            });
            await user.setPassword(password);

            await user.save();
          } catch (e) {
            if (e.name !== 'ValidationError') return done(e);
            return done(null, false, e.errors.email.message);
          }
        }
        return done(null, user, null);
      }
    }
);
