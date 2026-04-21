const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', articleController.getArticles);
router.get('/categories', articleController.getCategories);
router.get('/cities', articleController.getCities);
router.get('/authors', articleController.getAuthors);

router.post('/', auth(['admin_principal', 'admin_secondaire']), upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), articleController.createArticle);

router.put('/:id', auth(['admin_principal', 'admin_secondaire']), upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), articleController.updateArticle);

router.delete('/:id', auth(['admin_principal', 'admin_secondaire']), articleController.deleteArticle);

router.put('/validate/:id', auth(['admin_principal']), articleController.validateArticle);

module.exports = router;
