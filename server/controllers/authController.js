const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// @route POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, farmLocation } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password, farmLocation });
    const token = signToken(user._id);

    res.status(201).json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// @route POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = signToken(user._id);
    res.json({ token, user: user.toSafeObject() });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// @route GET /api/auth/me
exports.getProfile = async (req, res) => {
  res.json({ user: req.user.toSafeObject ? req.user.toSafeObject() : req.user });
};
