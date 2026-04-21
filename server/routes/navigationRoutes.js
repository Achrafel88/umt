const express = require('express');
const router = express.Router();
const navigationController = require('../controllers/navigationController');
const auth = require('../middlewares/auth');

router.get('/', navigationController.getNavigation);
router.post('/', auth(['admin_principal']), navigationController.createNavigationItem);
router.put('/:id', auth(['admin_principal']), navigationController.updateNavigationItem);
router.delete('/:id', auth(['admin_principal']), navigationController.deleteNavigationItem);
router.post('/reorder', auth(['admin_principal']), navigationController.reorderNavigation);

module.exports = router;
