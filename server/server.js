require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const cropRoutes = require("./routes/cropRoutes");
const recommendationRoutes = require("./routes/recommendationRoutes");

const app = express();

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Crop Recommendation API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/recommend", recommendationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
