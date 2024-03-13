const router = require('express').Router();
const {getCurrentUser, modifyCurrentUserData} = require('../controllers/users');
const { validateModifyUserData } = require('../middleware/validation');

router.get('/me', getCurrentUser);
router.patch('/me', validateModifyUserData, modifyCurrentUserData);
module.exports = router;