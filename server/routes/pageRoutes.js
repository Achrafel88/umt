const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');
const auth = require('../middlewares/auth');

router.get('/', pageController.getPages);
router.get('/:slug', pageController.getPageBySlug);
router.post('/', auth(['admin_principal']), pageController.createPage);
router.put('/:id', auth(['admin_principal']), pageController.updatePage);
router.delete('/:id', auth(['admin_principal']), pageController.deletePage);

module.exports = router;
