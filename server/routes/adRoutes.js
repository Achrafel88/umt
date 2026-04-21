const express = require('express');
const router = express.Router();
const adController = require('../controllers/adController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', adController.getAds);
router.get('/all', auth(['admin_principal']), adController.getAllAds);
router.post('/', auth(['admin_principal']), upload.single('image'), adController.createAd);
router.put('/:id', auth(['admin_principal']), upload.single('image'), adController.updateAd);
router.delete('/:id', auth(['admin_principal']), adController.deleteAd);

module.exports = router;
