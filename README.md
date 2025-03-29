# Weather App

A dynamic weather application that fetches real-time weather data for cities and towns around the world using the OpenWeatherMap API. The app displays the current weather, a 5-day forecast, and additional details like humidity, wind speed, feels-like temperature, and pressure. Kigali is set as the default city.

## Features

- **Search for Any City**: Users can search for weather data for any city or town worldwide.
- **Default City**: Displays weather data for Kigali when the app loads.
- **Current Weather**: Shows temperature, weather type, humidity, wind speed, feels-like temperature, and pressure.
- **5-Day Forecast**: Displays a 5-day weather forecast with icons, temperatures, and weather descriptions.
- **Unit Conversion**: Toggle between Celsius (°C) and Fahrenheit (°F).
- **Responsive Design**: Works seamlessly on desktop and mobile devices.

## Technologies Used

### Frontend:
- HTML5: Structure of the application.
- CSS3: Styling and layout.
- JavaScript (ES6): Dynamic updates and API integration.
- Bootstrap: Responsive design.

### Backend:
- Node.js: Backend server.
- Express.js: Web framework for handling API requests.
- dotenv: For managing environment variables.
- Helmet: Security headers.
- CORS: Cross-origin resource sharing.
- Express Rate Limit: Rate limiting for API endpoints.

### API:
- OpenWeatherMap API: Provides real-time weather data and forecasts.

## Installation and Setup

### Prerequisites
- Node.js installed on your machine.
- npm (comes with Node.js).
- An OpenWeatherMap API key. You can get one by signing up at [OpenWeatherMap](https://openweathermap.org/).

### Steps to Run the Project

1. **Clone the Repository**:
   ```bash
   git clone [repository-url]
Set Up the Backend:

Create a .env file in the root directory and add your OpenWeatherMap API key:

Copy
API_KEY=your_api_key_here
Install backend dependencies:

bash
Copy
npm install
Start the backend server:

bash
Copy
npm start
The backend server will run on http://localhost:5000.

Set Up the Frontend:

Use a static server like http-server to serve the frontend:

bash
Copy
npx http-server
The frontend will run on http://127.0.0.1:8081.

Access the Application:

Open your browser and go to http://127.0.0.1:8081.

Project Structure
Copy
project-root/
├── public/          # Frontend files (HTML, CSS, JS)
├── server/          # Backend files (Node.js, Express)
├── .env             # Environment variables
├── package.json     # Node.js dependencies
└── README.md        # Project documentation
API Endpoints
Backend
GET /api-key: Returns the OpenWeatherMap API key.

OpenWeatherMap API
Current Weather: https://api.openweathermap.org/data/2.5/weather?q={city}&units={unit}&appid={apiKey}

5-Day Forecast: https://api.openweathermap.org/data/2.5/forecast?q={city}&units={unit}&appid={apiKey}

Features in Detail
Current Weather
City Name: Displays the name of the city.

Temperature: Shows the current temperature in Celsius or Fahrenheit.

Weather Type: Displays the weather condition (e.g., Rain, Clear, Cloudy).

Humidity: Displays the humidity percentage.

Wind Speed: Displays the wind speed in km/h or mph.

Feels Like: Displays the feels-like temperature.

Pressure: Displays the atmospheric pressure in hPa.

5-Day Forecast
Displays the weather forecast for the next 5 days. Includes:

Day of the week.

Weather icon.

Weather description.

Temperature.

Screenshots
Default City (Kigali)	Search for Another City	5-Day Forecast
<img alt="Default City" src="https://via.placeholder.com/800x400?text=Default+City+Weather">	<img alt="Search City" src="https://via.placeholder.com/800x400?text=Search+City+Weather">	<img alt="5-Day Forecast" src="https://via.placeholder.com/800x400?text=5-Day+Forecast">
Future Enhancements
Add geolocation support to detect the user's current location and display weather data automatically.

Add hourly weather forecasts.

Improve error handling for invalid city names or API errors.

Add a loading spinner while fetching data.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Acknowledgments
OpenWeatherMap for providing the weather data.

Bootstrap for responsive design.

Icons8 for weather icons.
