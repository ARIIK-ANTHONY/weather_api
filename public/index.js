document.addEventListener("DOMContentLoaded", function () {
  // Configuration
  const config = {
    endpoints: {
      apiKey: 'http://localhost:5000/api-key',
      weather: 'https://api.openweathermap.org/data/2.5/weather',
      forecast: 'https://api.openweathermap.org/data/2.5/forecast'
    },
    defaultCity: "Kigali",
    maxRetries: 2,
    retryDelay: 1000
  };

  // State
  const state = {
    apiKey: null,
    unit: "metric"
  };

  // DOM Elements
  const elements = {
    // ... (keep your existing element selectors)
  };

  // Initialize app
  const init = async () => {
    try {
      await fetchApiKey();
      await loadWeatherData(config.defaultCity);
      setupEventListeners();
    } catch (error) {
      showError("Failed to initialize app. Please refresh.");
      console.error("Init error:", error);
    }
  };

  // Fetch API key from backend
  const fetchApiKey = async (retry = 0) => {
    try {
      const response = await fetch(config.endpoints.apiKey);
      
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const { apiKey, expiresAt } = await response.json();
      
      if (!apiKey) throw new Error("Invalid API key response");
      if (Date.now() > expiresAt) throw new Error("API key expired");
      
      state.apiKey = apiKey;
    } catch (error) {
      if (retry < config.maxRetries) {
        await new Promise(resolve => setTimeout(resolve, config.retryDelay));
        return fetchApiKey(retry + 1);
      }
      throw error;
    }
  };

  // Load weather data
  const loadWeatherData = async (city) => {
    if (!state.apiKey) throw new Error("No API key available");
    
    try {
      const [current, forecast] = await Promise.all([
        axios.get(`${config.endpoints.weather}?q=${city}&units=${state.unit}&appid=${state.apiKey}`),
        axios.get(`${config.endpoints.forecast}?q=${city}&units=${state.unit}&appid=${state.apiKey}`)
      ]);
      
      updateUI(current.data, forecast.data);
    } catch (error) {
      throw new Error("Failed to load weather data");
    }
  };

  // ... (keep your existing UI update and helper functions)

  // Start the app
  init();
});