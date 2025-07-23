const cities = ['New York', 'London', 'Tokyo'];

// Using server API to track performance
const API_URL = '/api/weather';

async function getWeather(city, elementId) {
    try {
        // Fetch weather data through server API
        const response = await fetch(`${API_URL}/${encodeURIComponent(city)}`);
        const data = await response.json();
        
        if (data.main) {
            const temp = Math.round(data.main.temp);
            const description = data.weather[0].description;
            const humidity = data.main.humidity;
            
            // Display the result
            document.getElementById(elementId).innerHTML = `
                <h3>${city}</h3>
                <p>${temp}°C</p>
                <p>${description}</p>
                <small>Humidity: ${humidity}%</small>
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
            <p>Error loading weather data</p>
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
