const express = require('express');
const router = express.Router();
const contactTeamController = require('../controllers/contactTeamController');
const auth = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.get('/', contactTeamController.getTeamMembers);
router.post('/', auth(['admin_principal']), upload.single('image'), contactTeamController.addTeamMember);
router.delete('/:id', auth(['admin_principal']), contactTeamController.deleteTeamMember);

module.exports = router;
