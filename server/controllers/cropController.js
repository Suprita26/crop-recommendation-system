const Crop = require("../models/Crop");

// @route GET /api/crops
exports.getCrops = async (req, res) => {
  try {
    const crops = await Crop.find().sort({ name: 1 });
    res.json({ crops });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch crops", error: err.message });
  }
};

// @route GET /api/crops/:id
exports.getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json({ crop });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch crop", error: err.message });
  }
};

const REQUIRED_RANGE_FIELDS = [
  "nitrogen",
  "phosphorus",
  "potassium",
  "temperature",
  "humidity",
  "ph",
  "rainfall",
];

function validateCropPayload(body) {
  if (!body.name) return "Crop name is required";
  for (const field of REQUIRED_RANGE_FIELDS) {
    const range = body[field];
    if (!range || typeof range.min !== "number" || typeof range.max !== "number") {
      return `Field "${field}" must include numeric min and max`;
    }
    if (range.min > range.max) {
      return `Field "${field}" min cannot be greater than max`;
    }
  }
  return null;
}

// @route POST /api/crops (admin)
exports.createCrop = async (req, res) => {
  try {
    const error = validateCropPayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const existing = await Crop.findOne({ name: req.body.name.trim() });
    if (existing) {
      return res.status(409).json({ message: "A crop with this name already exists" });
    }

    const crop = await Crop.create(req.body);
    res.status(201).json({ crop });
  } catch (err) {
    res.status(500).json({ message: "Failed to create crop", error: err.message });
  }
};

// @route PUT /api/crops/:id (admin)
exports.updateCrop = async (req, res) => {
  try {
    const error = validateCropPayload(req.body);
    if (error) return res.status(400).json({ message: error });

    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json({ crop });
  } catch (err) {
    res.status(500).json({ message: "Failed to update crop", error: err.message });
  }
};

// @route DELETE /api/crops/:id (admin)
exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) return res.status(404).json({ message: "Crop not found" });
    res.json({ message: "Crop deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete crop", error: err.message });
  }
};
