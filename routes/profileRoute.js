const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const profileController = require("../controllers/profileController");

router.get("/:userId", profileController.getProfile);
router.patch("/:userId", profileController.updateProfile);
router.post("/image/:userId", upload.single("profilePhoto"), profileController.updateImageProfile);

module.exports = router;
