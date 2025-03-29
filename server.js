const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000; // Define the PORT variable

// Enable CORS to allow requests from the frontend
app.use(cors());

// Add security headers
app.use(helmet());

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Rate limiting for the /api-key endpoint
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use("/api-key", apiLimiter);

// Default route for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the Weather API backend!");
});

// Endpoint to fetch the API key
app.get("/api-key", (req, res) => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API key not found in .env file");
    return res.status(500).json({ error: "API key not found in .env file" });
  }
  console.log("API Key sent to client:", apiKey); // Debugging
  res.json({ apiKey });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date() });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});