const cities = ['New York', 'London', 'Tokyo'];

// Using server API to track performance
const API_URL = '/api/weather';

// Weather condition icons mapping
const weatherIcons = {
    'clear sky': '☀️',
    'few clouds': '🌤️',
    'scattered clouds': '⛅',
    'broken clouds': '☁️',
    'overcast clouds': '☁️',
    'shower rain': '🌦️',
    'rain': '🌧️',
    'light rain': '🌦️',
    'moderate rain': '🌧️',
    'heavy intensity rain': '🌧️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️',
    'fog': '🌫️',
    'haze': '🌫️',
    'default': '🌤️'
};

function getWeatherIcon(description) {
    const lowercaseDesc = description.toLowerCase();
    return weatherIcons[lowercaseDesc] || weatherIcons['default'];
}

function getGradientForWeather(description) {
    const lowercaseDesc = description.toLowerCase();
    
    if (lowercaseDesc.includes('clear') || lowercaseDesc.includes('sun')) {
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
    } else if (lowercaseDesc.includes('rain') || lowercaseDesc.includes('storm')) {
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    } else if (lowercaseDesc.includes('cloud')) {
        return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    } else if (lowercaseDesc.includes('snow')) {
        return 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)';
    } else {
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
}

async function getWeather(city, elementId) {
    try {
        // Fetch weather data through server API
        const response = await fetch(`${API_URL}/${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (data.main) {
            const temp = Math.round(data.main.temp);
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            const icon = getWeatherIcon(description);
            
            // Display the result with enhanced styling
            document.getElementById(elementId).innerHTML = `
                <h3>${city}</h3>
                <div class="weather-icon">${icon}</div>
                <div class="temperature">${temp}°</div>
                <div class="description">${description}</div>
                <div class="humidity">Humidity: ${humidity}%</div>
            `;
            
            // Add subtle weather-based background gradient to the card
            const cityElement = document.getElementById(elementId);
            cityElement.style.background = `linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)`;
        } else {
            document.getElementById(elementId).innerHTML = `
                <h3>${city}</h3>
                <div class="error">
                    <div style="font-size: 2rem; margin-bottom: 10px;">⚠️</div>
                    <div>Weather data unavailable</div>
                </div>
            `;
        }
    } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
        document.getElementById(elementId).innerHTML = `
            <h3>${city}</h3>
            <div class="error">
                <div style="font-size: 2rem; margin-bottom: 10px;">❌</div>
                <div>Error loading weather data</div>
            </div>
        `;
    }
}

// Load weather data when page loads
window.addEventListener('DOMContentLoaded', () => {
    getWeather(cities[0], 'city1');
    getWeather(cities[1], 'city2');
    getWeather(cities[2], 'city3');
    
    // Refresh every 10 minutes
    setInterval(() => {
        getWeather(cities[0], 'city1');
        getWeather(cities[1], 'city2');
        getWeather(cities[2], 'city3');
    }, 600000);
});
