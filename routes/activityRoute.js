const express = require("express");
const activityController = require("../controllers/activityController");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/", upload.single("photo"), activityController.createActivity);
router.patch("/:activityId", upload.single("photo"), activityController.updateActivity);
router.delete("/:activityId", activityController.deleteActivity);
router.get("/:activityId", activityController.getActivity);
router.get("/all/:userId", activityController.getAllActivity);
router.get("/type/all", activityController.getActivityType);

module.exports = router;
