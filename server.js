const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate Limiting
const apiKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});

// API Key Endpoint
app.get("/api-key", apiKeyLimiter, (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }
  res.json({ apiKey });
});

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});