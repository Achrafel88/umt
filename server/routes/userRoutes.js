const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/', auth(['admin_principal']), userController.getUsers);
router.post('/', auth(['admin_principal']), userController.createUser);
router.put('/:id', auth(['admin_principal']), userController.updateUser);
router.delete('/:id', auth(['admin_principal']), userController.deleteUser);

module.exports = router;
