const express = require("express");
const activityController = require("../controllers/activityController");
const upload = require("../middleware/upload");
const router = express.Router();

router.post("/", upload.single("activityPhoto"), activityController.createActivity);
router.patch("/:activityId", activityController.updateActivity);
router.delete("/:activityId", activityController.deleteActivity);
router.get("/:activityId", activityController.getActivity);
router.get("/", activityController.getAllActivity);

module.exports = router;
