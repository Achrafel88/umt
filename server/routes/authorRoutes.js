const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorController');
const auth = require('../middlewares/auth');

router.get('/', authorController.getAuthors);
router.post('/', auth(['admin_principal']), authorController.createAuthor);
router.put('/:id', auth(['admin_principal']), authorController.updateAuthor);
router.delete('/:id', auth(['admin_principal']), authorController.deleteAuthor);

module.exports = router;
