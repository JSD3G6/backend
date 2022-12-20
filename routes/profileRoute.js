const express = require('express');
const router = express.Router();

const upload = require('../middleware/upload');
const profileController = require('../controllers/profileController');

router.get('/getMe', profileController.getMe);
router.get('/:userId', profileController.getProfile);
router.patch('/:userId', upload.single('profilePhoto'), profileController.updateProfile);
// router.post("/image/:userId", upload.single("profilePhoto"), profileController.updateImageProfile);

module.exports = router;
