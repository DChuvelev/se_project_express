const router = require('express').Router();
const {NOT_FOUND} = require('../utils/errors');
const usersRouter = require('./users');
const itemsRouter = require('./clothingitems');

router.use('/users', usersRouter);
router.use('/items', itemsRouter);
router.use((req, res) => {
  console.log('Recieved a request for a non-existing resource');
  res.status(NOT_FOUND).send( {message: 'Requested resource not found'} );
})

module.exports = router;