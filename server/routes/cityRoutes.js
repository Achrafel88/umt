const express = require('express');
const router = express.Router();
const cityController = require('../controllers/cityController');
const auth = require('../middlewares/auth');

router.get('/', cityController.getCities);
router.post('/', auth(['admin_principal']), cityController.createCity);
router.put('/:id', auth(['admin_principal']), cityController.updateCity);
router.delete('/:id', auth(['admin_principal']), cityController.deleteCity);

module.exports = router;
