const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 20,
  },
  pw: {
    type: String,
    required: true,
    alias: 'password',
  },
  about: {
    type: String,
    maxlength: 100,
  },
  avatar: {
    type: String,
  },
});

userSchema.pre('save', async function() {
  if (this.isNew || this.isModified('pw')) {
    this.password = await bcrypt.hash(
      this.password,
      process.env.HASH_SALT || 10
    );
  }
});

userSchema.methods.getData = function() {
  return {
    id: this._id,
    name: this.name,
    username: this.username,
    about: this.about,
    avatar: this.avatar,
  };
};

userSchema.methods.signJwt = function() {
  const userData = this.getData();

  userData.token = jwt.sign(
    userData,
    process.env.JWT_SECRET || 'secret for local testing'
  );

  return userData;
};

userSchema.methods.checkPassword = async function(password) {
  try {
    const isMathcing = await bcrypt.compare(password, this.password);
    return isMathcing;
  } catch (error) {
    console.log(error);
  }
};

/**
 * Append id attribute.
 */
userSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

/**
 * Enable virtual attributes (id).
 */
userSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('User', userSchema);
