const router = require('express').Router();
const NotFoundError = require('../utils/errors/NotFoundError');
const usersRouter = require('./users');
const itemsRouter = require('./clothingitems');
const {auth} = require('../middleware/auth');

router.use('/users', auth, usersRouter);
router.use('/items', itemsRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
})

module.exports = router;