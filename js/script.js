const cities = ['New York', 'London', 'Tokyo'];

// Using OpenWeatherMap API - you'll need to get a free API key
// Visit: https://openweathermap.org/api
const API_KEY = '47d05f31a987ba26930cfaa7fd83326c'; // OpenWeatherMap API key
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city, elementId) {
    const url = `${API_URL}?q=${city}&appid=${API_KEY}&units=metric`;
    console.log(`Fetching weather for ${city}:`, url.replace(API_KEY, 'API_KEY_HIDDEN'));
    
    try {
        const response = await fetch(url);
        console.log(`Response status for ${city}:`, response.status);
        const data = await response.json();
        console.log(`Response data for ${city}:`, data);
        
        if (data.main) {
            const temp = Math.round(data.main.temp);
            const description = data.weather[0].description;
            document.getElementById(elementId).innerHTML = `
                <h3>${city}</h3>
                <p>${temp}°C</p>
                <p>${description}</p>
            `;
        } else {
            document.getElementById(elementId).innerHTML = `
                <h3>${city}</h3>
                <p>Weather data unavailable</p>
            `;
        }
    } catch (error) {
        console.error(`Error fetching weather for ${city}:`, error);
        document.getElementById(elementId).innerHTML = `
            <h3>${city}</h3>
            <p>Error loading weather</p>
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
