const createError = require('http-errors');

exports.updateProfile = (req, res, next) => {
  const user = req.user;

  const { name, about } = req.body;

  // Update user profile
  user.name = name;
  user.about = about;
  user.avatar = req.file ? req.file.filename : user.avatar;

  user
    .save()
    .then(updated => {
      sendUserProfile(updated);
      res.json();
    })
    .catch(err => next(err));
};

exports.changePassword = async (req, res, next) => {
  const user = req.user;

  const { password, newPassword } = req.body;

  try {
    const checkPassword = await user.checkPassword(password);

    if (!checkPassword) {
      return next(createError(401, 'كلمة المرور خاطئة'));
    }

    user.password = newPassword;
    user
      .save()
      .then(() => {
        res.json();
      })
      .catch(err => next(err));
  } catch (error) {
    console.error(error);
  }
};

const sendUserProfile = user => {
  io.emit('update_user', user.getData());
};
