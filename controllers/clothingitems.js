const {BAD_REQUEST, NOT_FOUND, FORBIDDEN, INTERNAL_SERVER_ERROR} = require('../utils/errors');
const ClothingItem = require('../models/clothingitems');

module.exports.getItems = (req, res) => {
  ClothingItem.find({})
  .then((clothingItems) => {
    console.log('Get all items');
    res.send( {data: clothingItems} );
  })
  .catch(err => {
    console.error(err);
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'})
  });
}

module.exports.deleteItemById = (req, res) => {
  ClothingItem.findById(req.params.id)
  .orFail()
  .then(itemToCheckOwnership => {
    if (itemToCheckOwnership.owner.toString() !== req.user._id) {
      return Promise.reject(new Error());
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
      res.status(NOT_FOUND).send( {message: `There's no item with id: ${req.params.id}`});
      return;
    }
    if (err.name === 'CastError') {
      res.status(BAD_REQUEST).send( {message: `Id '${req.params.id}' is invalid`});
      return;
    }
    if (err.name === 'Error') {
      res.status(FORBIDDEN).send( {message: "Unauthorized delete"});
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'});
  })
}

module.exports.createItem = (req, res) => {
  ClothingItem.create( {...req.body, owner: req.user._id} )
  .then(item => {
    res.send(item);
    console.log('Item created');
  })
  .catch((err) => {
    console.log(err.name);
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send( {message: 'Invalid data passed for creating an item'});
    } else {
      res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'});
    }
  })
}

module.exports.likeItem = (req, res) => {
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
      res.status(BAD_REQUEST).send( {message: `Id '${req.params.id}' is invalid`});
      return;
    }
    if (err.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND).send( {message: `There's no item with id: ${req.params.id}`});
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'});
  })
}

module.exports.unlikeItem = (req, res) => {
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
      res.status(BAD_REQUEST).send( {message: `Id '${req.params.id}' is invalid`});
      return;
    }
    if (err.name === 'DocumentNotFoundError') {
      res.status(NOT_FOUND).send( {message: `There's no item with id: ${req.params.id}`});
      return;
    }
    res.status(INTERNAL_SERVER_ERROR).send( {message: 'Server error. Try later'});

  })
}