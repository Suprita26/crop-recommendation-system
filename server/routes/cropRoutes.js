const express = require("express");
const router = express.Router();
const {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} = require("../controllers/cropController");
const { protect, adminOnly } = require("../middleware/auth");

router.get("/", getCrops);
router.get("/:id", getCropById);
router.post("/", protect, adminOnly, createCrop);
router.put("/:id", protect, adminOnly, updateCrop);
router.delete("/:id", protect, adminOnly, deleteCrop);

module.exports = router;
