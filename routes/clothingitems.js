const router = require('express').Router();
const {getItems, deleteItemById, createItem, likeItem, unlikeItem} = require('../controllers/clothingitems');

router.get('/', getItems);
router.delete('/:id', deleteItemById);
router.post('/', createItem);
router.put('/:id/likes', likeItem);
router.delete('/:id/likes', unlikeItem);
module.exports = router;