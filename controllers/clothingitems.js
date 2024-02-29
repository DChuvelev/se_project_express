const BadRequestError = require('../utils/errors/BadRequestError');
const NotFoundError = require('../utils/errors/NotFoundError');
const ForbiddenError = require('../utils/errors/ForbiddenError');
const ClothingItem = require('../models/clothingitems');

module.exports.getItems = (req, res, next) => {
  ClothingItem.find({})
  .then((clothingItems) => {
    console.log('Get all items');
    res.send( {data: clothingItems} );
  })
  .catch(err => {
    console.error(err);
    next(err);
  });
}

module.exports.deleteItemById = (req, res, next) => {
  ClothingItem.findById(req.params.id)
  .orFail()
  .then(itemToCheckOwnership => {
    if (itemToCheckOwnership.owner.toString() !== req.user._id) {
      return Promise.reject(new Error('Forbidden'));
    }
    return ClothingItem.findByIdAndDelete(req.params.id)
    .then(itemToDelete => {
      res.send(itemToDelete);
      console.log('Item deleted');
    });
  })
  .catch((err) => {
    console.error(err.name);
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError(`There's no item with id: ${req.params.id}`));
      return;
    }
    if (err.name === 'CastError') {
      next(new BadRequestError(`Id '${req.params.id}' is invalid`));
      return;
    }
    if (err.name === 'Error' && err.message === 'Forbidden') {
      next(new ForbiddenError('Unauthorized delete'));
      return;
    }
    next(err);
  })
}

module.exports.createItem = (req, res, next) => {
  console.log(req.body);
  ClothingItem.create( {...req.body, owner: req.user._id} )
  .then(item => {
    res.send(item);
    console.log('Item created');
  })
  .catch((err) => {
    console.log(err.name, err.message);
    if (err.name === 'ValidationError') {
      next(new BadRequestError('Invalid data passed for creating an item'));
      return;
    }
    next(err);
  })
}

module.exports.likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .orFail()
  .then(item => {
    res.send(item);
    console.log('Added like');
  })
  .catch((err) => {
    console.log(err.name);
    if (err.name === 'CastError') {
      next(new BadRequestError(`Id '${req.params.id}' is invalid`));
      return;
    }
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError(`There's no item with id: ${req.params.id}`));
      return;
    }
    next(err);
  })
}

module.exports.unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .orFail()
  .then(item => {
    res.send(item);
    console.log('Removed like');
  })
  .catch((err) => {
    console.log(err.name);
    if (err.name === 'CastError') {
      next(new BadRequestError(`Id '${req.params.id}' is invalid`));
      return;
    }
    if (err.name === 'DocumentNotFoundError') {
      next(new NotFoundError(`There's no item with id: ${req.params.id}`));
      return;
    }
    next(err);

  })
}