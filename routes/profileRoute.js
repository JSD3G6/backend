const express = require("express");
const router = express.Router();

const profileController = require("../controllers/profileController");

router.get("/:userId", profileController.getProfile);
router.patch("/", profileController.updateProfile);
router.put("/image", profileController.updateImageProfileFromFront);
router.post("/image", profileController.updateImageProfile);

module.exports = router;
