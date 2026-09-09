const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    input: {
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number,
      temperature: Number,
      humidity: Number,
      ph: Number,
      rainfall: Number,
    },
    results: [
      {
        crop: { type: mongoose.Schema.Types.ObjectId, ref: "Crop" },
        cropName: String,
        matchPercentage: Number,
        notes: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recommendation", RecommendationSchema);
