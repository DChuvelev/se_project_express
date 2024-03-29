const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "It's not a URL"
    }
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "It's not a valid e-mail address"
    }
  },
  password: {
    type: String,
    required: true,
    select: false
  }
});

userSchema.statics.findUserByCredentials = function (email, password) {
  if (!email || !password) {
    return Promise.reject(new Error('Invalid data'));
  }
  return this.findOne( {email} ).select('+password')
  .then(user => {
    console.log(user);
    if (!user) {
      return Promise.reject(new Error('Incorrect username or password'));
    }
    return bcrypt.compare(password, user.password)
    .then(matched => {
      if (!matched) {
        return Promise.reject(new Error('Incorrect username or password'));
      }
      return user;
    })
  })
}


module.exports = mongoose.model('user', userSchema);