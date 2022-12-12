const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");

router.get("/:userId", profileController.getProfile);
router.patch("/:userId", profileController.updateProfile);
router.post("/image", profileController.updateImageProfile);

module.exports = router;
