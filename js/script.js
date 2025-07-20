const cities = ['New York', 'London', 'Tokyo'];

// Using OpenAI for weather data
// NOTE: Replace these placeholders with your actual OpenAI credentials
const OPENAI_ORG = "INSERT_OPENAI_ORG_HERE";
const OPENAI_API_KEY = "INSERT_OPENAI_API_KEY_HERE";
const OPENAI_API_URL = 'https://api.openai.com/v1/completions';

async function getWeather(city, elementId) {
    try {
        // Ask OpenAI about the weather
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'OpenAI-Organization': OPENAI_ORG
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: `What is the weather in ${city}?`,
                max_tokens: 100,
                n: 1,
                stop: null,
                temperature: 0.5
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            const weatherInfo = data.choices[0].text.trim();
            
            // Display the result
            document.getElementById(elementId).innerHTML = `
                <h3>${city}</h3>
                <p>${weatherInfo}</p>
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
