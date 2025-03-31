document.addEventListener("DOMContentLoaded", function () {
  const config = {
    defaultCity: "Kigali",
    apiEndpoints: {
      backend: 'http://localhost:5000/api-key',
      weather: 'https://api.openweathermap.org/data/2.5/weather',
      forecast: 'https://api.openweathermap.org/data/2.5/forecast'
    }
  };

  let currentUnit = "metric";
  let apiKey = "";

  const elements = {
    time: document.querySelector("#current-time"),
    day: document.querySelector("#current-day"),
    temp: document.querySelector("#current-temperature"),
    city: document.querySelector("#searched-city"),
    weatherType: document.querySelector("#weather-type"),
    humidity: document.querySelector("#humidity"),
    wind: document.querySelector("#wind"),
    feelsLike: document.querySelector("#feels-like"),
    pressure: document.querySelector("#pressure"),
    searchForm: document.querySelector("#search-form"),
    searchInput: document.querySelector("#search-input"),
    celsiusLink: document.querySelector("#celcius-link"),
    fahrenheitLink: document.querySelector("#fahrenheit-link"),
    forecastContainer: document.querySelector(".week-forecast")
  };

  const helpers = {
    formatTime: date => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    formatDay: date => date.toLocaleDateString("en-US", { weekday: "long" }),
    formatShortDay: timestamp => new Date(timestamp * 1000).toLocaleDateString("en-US", { weekday: "short" }),
    updateDateTime: () => {
      const now = new Date();
      elements.time.textContent = helpers.formatTime(now);
      elements.day.textContent = helpers.formatDay(now);
    }
  };

  const weather = {
    displayCurrent: data => {
      elements.city.textContent = data.name;
      elements.temp.textContent = `${Math.round(data.main.temp)}°`;
      elements.weatherType.textContent = data.weather[0].main;
      elements.humidity.textContent = `${data.main.humidity}%`;
      elements.wind.textContent = `${Math.round(data.wind.speed)} ${currentUnit === "metric" ? "km/h" : "mph"}`;
      elements.feelsLike.textContent = `${Math.round(data.main.feels_like)}°`;
      elements.pressure.textContent = `${data.main.pressure} hPa`;
    },
    displayForecast: data => {
      elements.forecastContainer.innerHTML = data.list
        .filter((_, index) => index % 8 === 0)
        .slice(0, 5)
        .map(forecast => `
          <div class="col">
            <h3>${helpers.formatShortDay(forecast.dt)}</h3>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" 
                 alt="${forecast.weather[0].main}" />
            <p>${forecast.weather[0].main}</p>
            <span>${Math.round(forecast.main.temp)}°</span>
          </div>
        `).join('');
    },
    fetchData: async (endpoint, city) => {
      try {
        const response = await axios.get(
          `${endpoint}?q=${city}&units=${currentUnit}&appid=${apiKey}`
        );
        return response.data;
      } catch (error) {
        console.error(`Error fetching ${endpoint.includes('forecast') ? 'forecast' : 'weather'} data:`, error);
        alert("Failed to fetch weather data. Please try again later.");
        throw error;
      }
    }
  };

  const api = {
    fetchKey: async () => {
      try {
        const response = await fetch(config.apiEndpoints.backend);
        if (!response.ok) {
          throw new Error(`Failed to fetch API key: ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.apiKey) throw new Error("Invalid API key response");
        apiKey = data.apiKey;
      } catch (error) {
        console.error("Error fetching API key:", error);
        alert("Failed to fetch API key. Please check your backend server.");
        throw error;
      }
    }
  };

  const init = async () => {
    try {
      await api.fetchKey();
      helpers.updateDateTime();
      setInterval(helpers.updateDateTime, 60000);
      
      const [current, forecast] = await Promise.all([
        weather.fetchData(config.apiEndpoints.weather, config.defaultCity),
        weather.fetchData(config.apiEndpoints.forecast, config.defaultCity)
      ]);
      weather.displayCurrent(current);
      weather.displayForecast(forecast);
      
      elements.searchForm.addEventListener("submit", async event => {
        event.preventDefault();
        const city = elements.searchInput.value.trim();
        if (!city) {
          alert("Please enter a city name.");
          return;
        }
        try {
          const [current, forecast] = await Promise.all([
            weather.fetchData(config.apiEndpoints.weather, city),
            weather.fetchData(config.apiEndpoints.forecast, city)
          ]);
          weather.displayCurrent(current);
          weather.displayForecast(forecast);
          elements.searchInput.value = "";
        } catch {
          alert("City not found. Please try again.");
        }
      });
    } catch (error) {
      alert("Failed to initialize application. Please try again later.");
      console.error("Initialization error:", error);
    }
  };

  init();
});