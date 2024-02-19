const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {UAUTHORIZED, BAD_REQUEST, NOT_FOUND, CONFLICT, INTERNAL_SERVER_ERROR} = require('../utils/errors');
const {JWT_SECRET} = require('../utils/config');

module.exports.getUsers = (req, res) => {
  User.find({})
  .then((users) => {
    console.log('Get all users');
    res.send( {data: users} );
  })
  .catch(err => {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'})
  });
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
  .orFail()
  .then(user => {
    res.send(user);
    console.log(`User ${user.name} found`);
  })
  .catch(err => {
    console.error(err.name);
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send( {message: `The id: '${req.params.id}' is invalid`});
      return;
    }
    if (err.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND).send( {message: `There's no user with id: ${req.params.id}`});
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'});
  });
}

module.exports.getCurrentUser = (req, res) => {
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
      res.status(BAD_REQUEST).send( {message: `The id: '${req.user._id}' is invalid`});
      return;
    }
    if (err.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND).send( {message: `There's no user with id: ${req.user._id}`});
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'});
  });
}

module.exports.createUser = (req, res) => {
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
      res.status(BAD_REQUEST).send( {message: 'Invalid data'});
      return;
    }
    if (err.name === 'MongoServerError' || err.code === 11000) {
      res.status(CONFLICT).send( {message: 'User already exists'});
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'});
  });
}

module.exports.modifyCurrentUserData = (req, res) => {
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
      res.status(NOT_FOUND).send( {message: `There's no user with id: ${req.user._id}`});
      return;
    }
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send( {message: 'Invalid data'});
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'});
  })
}

module.exports.login = (req, res) => {
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
      res.status(UAUTHORIZED).send( {message: err.message});
      return;
    }
    if (err.message === 'Invalid data') {
      res.status(BAD_REQUEST).send( {message: err.message});
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error'} );
  });
}