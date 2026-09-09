const express = require("express");
const router = express.Router();
const { recommend, getHistory } = require("../controllers/recommendationController");
const { protect } = require("../middleware/auth");

router.post("/", protect, recommend);
router.get("/history", protect, getHistory);

module.exports = router;
