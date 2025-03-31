const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security Middleware
app.use(cors({
  origin: NODE_ENV === "development" 
    ? "http://localhost:3000" 
    : "https://your-production-domain.com"
}));

// Enhanced Helmet configuration with CSP
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'", 
        "https://fonts.googleapis.com", 
        "https://stackpath.bootstrapcdn.com"
      ],
      fontSrc: [
        "'self'", 
        "https://fonts.gstatic.com"
      ],
      scriptSrc: [
        "'self'", 
        "https://unpkg.com",
        NODE_ENV === "development" && "'unsafe-eval'"
      ].filter(Boolean),
      connectSrc: [
        "'self'", 
        `http://localhost:${PORT}`,
        "https://api.openweathermap.org",
        NODE_ENV === "development" && "ws://localhost:*"
      ].filter(Boolean),
      imgSrc: [
        "'self'", 
        "data:", 
        "https://openweathermap.org"
      ],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: NODE_ENV === "production" ? [] : null
    }
  },
  crossOriginEmbedderPolicy: NODE_ENV === "production",
  hsts: NODE_ENV === "production"
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Key Endpoint with rate limiting
app.get("/api-key", (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY; // Changed to match standard naming
  if (!apiKey) {
    return res.status(500).json({ 
      error: "API key not configured",
      solution: "Add OPENWEATHER_API_KEY to your .env file"
    });
  }
  
  // Basic obfuscation (not security, just to prevent casual scraping)
  const maskedKey = `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}`;
  res.json({ 
    apiKey,
    hint: `Using key: ${maskedKey}`,
    expires: new Date(Date.now() + 3600000).toISOString() // 1 hour
  });
});

// Enhanced Health Check
app.get("/health", (req, res) => {
  const healthcheck = {
    status: "OK",
    timestamp: new Date(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: NODE_ENV
  };
  res.json(healthcheck);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: NODE_ENV === "development" ? err.message : undefined
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ 
    error: "Endpoint not found",
    availableEndpoints: [
      { method: "GET", path: "/api-key" },
      { method: "GET", path: "/health" }
    ]
  });
});

// Server startup
app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(`CORS configured for: ${
    NODE_ENV === "development" 
      ? "http://localhost:3000" 
      : "https://your-production-domain.com"
  }`);
});
