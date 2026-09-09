const Crop = require("../models/Crop");
const Recommendation = require("../models/Recommendation");
const { getRecommendations } = require("../utils/recommendationEngine");

// @route POST /api/recommend
exports.recommend = async (req, res) => {
  try {
    const { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall } = req.body;

    const inputFields = { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall };
    for (const [key, value] of Object.entries(inputFields)) {
      if (value === undefined || value === null || value === "" || isNaN(Number(value))) {
        return res.status(400).json({ message: `"${key}" must be a valid number` });
      }
    }

    const crops = await Crop.find();
    if (crops.length === 0) {
      return res.status(400).json({
        message: "No crops in the database yet. Ask an admin to add crops, or run the seed script.",
      });
    }

    const numericInput = {
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      temperature: Number(temperature),
      humidity: Number(humidity),
      ph: Number(ph),
      rainfall: Number(rainfall),
    };

    const topMatches = getRecommendations(numericInput, crops, 5);

    const results = topMatches.map((m) => ({
      crop: m.crop._id,
      cropName: m.crop.name,
      matchPercentage: m.matchPercentage,
      notes: m.notes,
    }));

    const recommendation = await Recommendation.create({
      user: req.user._id,
      input: numericInput,
      results,
    });

    res.status(201).json({
      recommendation,
      results: topMatches.map((m) => ({
        cropId: m.crop._id,
        name: m.crop.name,
        description: m.crop.description,
        season: m.crop.season,
        imageUrl: m.crop.imageUrl,
        matchPercentage: m.matchPercentage,
        notes: m.notes,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate recommendation", error: err.message });
  }
};

// @route GET /api/recommend/history
exports.getHistory = async (req, res) => {
  try {
    const history = await Recommendation.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("results.crop", "imageUrl");
    res.json({ history });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch history", error: err.message });
  }
};
