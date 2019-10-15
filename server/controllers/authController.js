const User = require('../models/User');
const createError = require('http-errors');

exports.register = async (req, res, next) => {
  // There should be some validation of input here.
  const { name, username, password } = req.body;

  try {
    const user = await User.create({
      name,
      username,
      password,
    });

    this.sendNewUser(user);

    res.json(user.signJwt());
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  // There should be some validation of input here.
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      throw createError(403, 'هناك خطأ في اسم المستخدم أو كلمة المرور.');
    }

    const isMatching = await user.checkPassword(password);

    if (!isMatching) {
      throw createError(403, 'هناك خطأ في اسم المستخدم أو كلمة المرور.');
    }

    res.json(user.signJwt());
  } catch (error) {
    next(error);
  }
};

exports.sendNewUser = user => {
  const { name, username, avatar } = user;
  let newUser = { name, username, avatar };

  io.emit('new_user', newUser);
};
