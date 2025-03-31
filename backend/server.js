const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enhanced CORS configuration
const corsOptions = {
  origin: [
    'http://localhost', // All localhost ports
    'http://127.0.0.1'
  ],
  methods: 'GET',
  optionsSuccessStatus: 200
};

// Security middleware
app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Rate limiting
const apiKeyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: "Too many requests, please try again later"
});

// API Key Endpoint
app.get("/api-key", apiKeyLimiter, (req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    
    if (!apiKey) {
      return res.status(500).json({ error: "API key not configured" });
    }

    res.json({ 
      apiKey,
      expiresAt: Date.now() + 3600000 // 1 hour expiration
    });

  } catch (error) {
    console.error("API key error:", error);
    res.status(500).json({ error: "Failed to retrieve API key" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  if (!process.env.OPENWEATHER_API_KEY) {
    console.error("⚠️ Warning: OPENWEATHER_API_KEY not set!");
  }
});