const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    {usernameField: 'email', session: false},
    async function(email, password, done) {
      if (email) {
        const user = await User.findOne({email});
        if (user) {
          if (await user.checkPassword(password)) {
            done(null, user);
            return;
          }
          done(null, false, 'Неверный пароль');
          return;
        }
      }
      done(null, false, 'Нет такого пользователя');
    }
);
