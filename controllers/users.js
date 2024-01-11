const {BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR} = require('../utils/errors');
const User = require('../models/users');

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

module.exports.createUser = (req, res) => {
  User.create(req.body)
  .then(user => {
    res.send(user);
    console.log(`User created: ${user}`);
  })
  .catch(err => {
    console.error(err);
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send( {message: err.message});
    } else {
      res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'});
    }
  });
}