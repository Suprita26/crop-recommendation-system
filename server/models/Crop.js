const mongoose = require("mongoose");

const RangeSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  { _id: false }
);

const CropSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: "" },
    season: { type: String, default: "" }, // e.g. "Kharif", "Rabi", "Zaid", "Year-round"
    imageUrl: { type: String, default: "" }, // optional photo shown in recommendation results
    nitrogen: { type: RangeSchema, required: true },
    phosphorus: { type: RangeSchema, required: true },
    potassium: { type: RangeSchema, required: true },
    temperature: { type: RangeSchema, required: true }, // Celsius
    humidity: { type: RangeSchema, required: true }, // %
    ph: { type: RangeSchema, required: true },
    rainfall: { type: RangeSchema, required: true }, // mm
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", CropSchema);
