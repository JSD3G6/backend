const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const profileController = require("../controllers/profileController");

router.get("/:userId", profileController.getProfile);
router.patch("/:userId", profileController.updateProfile);
router.post("/image", upload.single("profilePic"), profileController.updateImageProfile);

module.exports = router;
