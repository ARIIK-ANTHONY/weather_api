document.addEventListener("DOMContentLoaded", function () {
  let currentUnit = "metric"; // Default unit is Celsius
  let apiKey = ""; // API key will be fetched from the backend

  // DOM Elements
  const currentTimeElement = document.querySelector("#current-time");
  const currentDayElement = document.querySelector("#current-day");
  const currentTempElement = document.querySelector("#current-temperature");
  const cityElement = document.querySelector("#searched-city");
  const weatherTypeElement = document.querySelector("#weather-type");
  const humidityElement = document.querySelector("#humidity");
  const windElement = document.querySelector("#wind");
  const feelsLikeElement = document.querySelector("#feels-like");
  const pressureElement = document.querySelector("#pressure");
  const searchForm = document.querySelector("#search-form");
  const searchInput = document.querySelector("#search-input");
  const celsiusLink = document.querySelector("#celcius-link");
  const fahrenheitLink = document.querySelector("#fahrenheit-link");
  const forecastContainer = document.querySelector(".week-forecast");

  // Time and date formatting
  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function formatDay(date) {
    return date.toLocaleDateString("en-US", { weekday: "long" });
  }

  function formatShortDay(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }

  // Update current time and day
  function updateDateTime() {
    const now = new Date();
    currentTimeElement.innerHTML = formatTime(now);
    currentDayElement.innerHTML = formatDay(now);
  }

  // Update weather data display
  function displayWeatherInfo(data) {
    console.log("Updating UI with data:", data); // Debugging

    // Update city name
    cityElement.innerHTML = data.name;

    // Update temperature
    currentTempElement.innerHTML = `${Math.round(data.main.temp)}°`;

    // Update weather type
    weatherTypeElement.innerHTML = data.weather[0].main;

    // Update humidity
    humidityElement.innerHTML = `${data.main.humidity}%`;

    // Update wind speed
    windElement.innerHTML = `${Math.round(data.wind.speed)} ${
      currentUnit === "metric" ? "km/h" : "mph"
    }`;

    // Update feels like temperature
    feelsLikeElement.innerHTML = `${Math.round(data.main.feels_like)}°`;

    // Update pressure
    pressureElement.innerHTML = `${data.main.pressure} hPa`;
  }

  // Update 5-day forecast
  function displayForecast(data) {
    // Clear the existing forecast content
    forecastContainer.innerHTML = "";

    // Filter the forecast data to get one entry per day (every 8th entry in a 3-hour interval forecast)
    const forecastData = data.list.filter((item, index) => index % 8 === 0).slice(0, 5);

    // Generate HTML for each day's forecast
    forecastData.forEach((forecast) => {
      const dayName = formatShortDay(forecast.dt); // Format the day name
      const iconUrl = `https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`; // Weather icon
      const weatherDescription = forecast.weather[0].main; // Weather description
      const temperature = Math.round(forecast.main.temp); // Temperature

      // Create a column for the forecast
      const forecastHTML = `
        <div class="col">
          <h3>${dayName}</h3>
          <br />
          <img src="${iconUrl}" alt="${weatherDescription}" />
          <br />
          <p class="weather">${weatherDescription}</p>
          <span>${temperature}°</span>
        </div>
      `;

      // Append the forecast HTML to the container
      forecastContainer.innerHTML += forecastHTML;
    });
  }

  // Fetch weather data from OpenWeatherMap
  function fetchWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    axios
      .get(url)
      .then((response) => displayWeatherInfo(response.data))
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        alert("City not found. Please try again.");
      });
  }

  // Fetch forecast data from OpenWeatherMap
  function fetchForecast(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${currentUnit}&appid=${apiKey}`;
    axios
      .get(url)
      .then((response) => displayForecast(response.data))
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
      });
  }

  // Fetch API key from backend
  function fetchApiKey() {
    return fetch("http://localhost:5000/api-key")
      .then((response) => response.json())
      .then((data) => {
        apiKey = data.apiKey;
        console.log("Fetched API Key:", apiKey); // Debugging
        if (!apiKey) {
          throw new Error("API key is missing. Check your backend configuration.");
        }
      })
      .catch((error) => {
        console.error("Error fetching API key:", error);
        alert("Failed to load API key. Please try again later.");
      });
  }

  // Event Listeners
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const city = searchInput.value.trim();
    if (city) {
      fetchWeather(city);
      fetchForecast(city);
      searchInput.value = "";
    }
  });

  celsiusLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentUnit !== "metric") {
      currentUnit = "metric";
      fetchWeather(cityElement.textContent);
      fetchForecast(cityElement.textContent);
    }
  });

  fahrenheitLink.addEventListener("click", function (event) {
    event.preventDefault();
    if (currentUnit !== "imperial") {
      currentUnit = "imperial";
      fetchWeather(cityElement.textContent);
      fetchForecast(cityElement.textContent);
    }
  });

  // Initialize app
  function init() {
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update time every minute
    fetchWeather("Kigali"); // Default city
    fetchForecast("Kigali");
  }

  // Fetch API key and initialize the app
  fetchApiKey().then(init);
});