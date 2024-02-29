const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ConflictError = require('../utils/errors/ConflictError');
const {JWT_SECRET} = require('../utils/config');

module.exports.getUsers = (req, res, next) => {
  User.find({})
  .then((users) => {
    console.log('Get all users');
    res.send( {data: users} );
  })
  .catch(next);
}

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
  .orFail()
  .then(user => {
    res.send(user);
    console.log(`User ${user.name} found`);
  })
  .catch(err => {
    console.error(err.name);
    if (err.name === 'CastError') {
      next(new BadRequestError(`The id: '${req.params.id}' is invalid`));
      return;
    }
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError(`There's no user with id: ${req.params.id}`));
      return;
    }
    next(err);
  });
}

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
  .orFail()
  .then(user => {
    const userWithoutPass = (({password, ...restProps}) => restProps)(user._doc);
    res.send(userWithoutPass);
    console.log(`User ${user.name} found`);
  })
  .catch(err => {
    console.error(err.name);
    if (err.name === 'CastError') {
      next(new BadRequestError(`The id: '${req.user._id}' is invalid`));
      return;
    }
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError(`There's no user with id: ${req.user._id}`));
      return;
    }
    next(err);
  });
}

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => User.create({...req.body, password: hash}))
  .then(user => {
    const userWithoutPass = (({password, ...restProps}) => restProps)(user._doc);
    res.send(userWithoutPass);
    console.log(`User created: ${user.name}`);
  })
  .catch(err => {
    console.error(err.name, '|', err.message);
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid data'));
      return;
    }
    if (err.name === 'MongoServerError' || err.code === 11000) {
      next(new ConflictError('User already exists'));
      return;
    }
    next(err);
  });
}

module.exports.modifyCurrentUserData = (req, res, next) => {
  const {name, avatar} = req.body;
  User.findByIdAndUpdate(req.user._id, { name, avatar }, { new: true, runValidators: true })
  .then(user => {
    const userWithoutPass = (({password, ...restProps}) => restProps)(user._doc);
    res.send(userWithoutPass);
    console.log(`User ${user.name} modified`);
  })
  .catch(err => {
    console.error(err.name);
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError(`There's no user with id: ${req.user._id}`));
      return;
    }
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid data'));
      return;
    }
    next(err);
  })
}

module.exports.login = (req, res, next) => {
  console.log("Login");
  User.findUserByCredentials(req.body.email, req.body.password)
  .then(user => {
    console.log('Successful user login:', user.name);
    const token = jwt.sign( {_id: user._id}, JWT_SECRET, {expiresIn: "7d"} );
    res.send( {token, name: user.name, avatar: user.avatar, email: user.email, _id: user._id} );
  })
  .catch(err => {
    console.error('Error:', err.message);
    if (err.message === 'Incorrect username or password') {
      next(new UnauthorizedError(err.message));
      return;
    }
    if (err.message === 'Invalid data') {
      next(new BadRequestError(err.message));
      return;
    }
    next(err);
  });
}