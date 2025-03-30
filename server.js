const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(cors());
app.use(helmet());

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rate limiting (specific to /api-key)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api-key", apiLimiter);

// ===== ROUTES =====
app.get("/", (req, res) => {
  res.send("Welcome to the Weather API backend!");
});

app.get("/api-key", (req, res) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API key not found in .env file");
    return res.status(500).json({ error: "API key not found in .env file" });
  }
  res.json({ apiKey });
});

app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// NEW WEATHER ENDPOINT
app.get('/api/weather', (req, res) => {
  // Example response - replace with real weather data
  res.json({
    location: "New York",
    temperature: 72,
    unit: "fahrenheit",
    conditions: "sunny",
    forecast: [
      { day: "Monday", high: 75, low: 68 },
      { day: "Tuesday", high: 78, low: 70 }
    ]
  });
});

// ===== ERROR HANDLERS =====
// 404 Handler (for undefined routes)
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler (MUST BE LAST MIDDLEWARE)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: "Internal server error",
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== SERVER START =====
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
