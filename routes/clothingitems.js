const router = require('express').Router();
const {auth} = require('../middleware/auth');
const {getItems, deleteItemById, createItem, likeItem, unlikeItem} = require('../controllers/clothingitems');

router.get('/', getItems);
router.delete('/:id', auth, deleteItemById);
router.post('/', auth, createItem);
router.put('/:id/likes', auth, likeItem);
router.delete('/:id/likes', auth, unlikeItem);
module.exports = router;