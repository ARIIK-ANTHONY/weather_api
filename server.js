const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const compression = require("compression");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000; // Uses PORT from .env (defaults to 5000 if not set)

// Middleware
app.use(compression());
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    hsts: { maxAge: 31536000, includeSubDomains: true },
    frameguard: { action: "deny" },
    xssFilter: true,
    noSniff: true,
  })
);

// Create a log file for server logs
const logStream = fs.createWriteStream(
  "/home/ubuntu/weather_api/server.log",
  { flags: "a" }
);

// Debugging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rate limiting for /api-key
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use("/api-key", apiLimiter);

// ===== ROUTES =====
app.get("/", (req, res) => res.send("Welcome to the Weather API backend!"));

app.get("/api-key", (req, res) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API key not found in .env file");
    return res.status(500).json({ error: "API key not found in .env file" });
  }
  res.json({ apiKey });
});

app.get("/health", (req, res) =>
  res.json({ status: "Server is running", timestamp: new Date() })
);

app.get("/api/weather", (req, res) => {
  res.json({
    location: "New York",
    temperature: 72,
    unit: "fahrenheit",
    conditions: "sunny",
    forecast: [
      { day: "Monday", high: 75, low: 68 },
      { day: "Tuesday", high: 78, low: 70 },
    ],
  });
});

// 404 Handler
app.use((req, res) => res.status(404).json({ error: "Endpoint not found" }));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal server error",
    message: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Debug: Print all registered routes
console.log("\n=== Registered Routes ===");
app._router.stack
  .filter((layer) => layer.route)
  .forEach((layer) => {
    const methods = Object.keys(layer.route.methods)
      .map((m) => m.toUpperCase())
      .join(", ");
    console.log(`${methods} ${layer.route.path}`);
  });

// Start the server on the correct port
app.listen(PORT, () => {
  const message = `Server is running on http://0.0.0.0:${PORT}\n`;
  console.log(message);
  logStream.write(message);
});
