const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');

router.get('/', categoryController.getCategories);
router.post('/', auth(['admin_principal']), categoryController.createCategory);
router.put('/:id', auth(['admin_principal']), categoryController.updateCategory);
router.delete('/:id', auth(['admin_principal']), categoryController.deleteCategory);

module.exports = router;
