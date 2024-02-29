const router = require('express').Router();
const {auth} = require('../middleware/auth');
const {getItems, deleteItemById, createItem, likeItem, unlikeItem} = require('../controllers/clothingitems');
const { validateCreateItemData, validateId } = require('../middleware/validation');

router.get('/', getItems);
router.delete('/:id', auth, validateId, deleteItemById);
router.post('/', auth, validateCreateItemData, createItem);
router.put('/:id/likes', auth, validateId, likeItem);
router.delete('/:id/likes', auth, validateId, unlikeItem);
module.exports = router;