# Weather Dashboard 🌤️

A simple, responsive weather dashboard that displays current temperatures for three cities: New York, London, and Tokyo.

## Features

- Real-time weather data for 3 major cities
- Responsive design that works on desktop and mobile
- Auto-refresh every 10 minutes
- Clean, modern interface

## Setup

### 1. Get a Weather API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard

### 2. Configure API Key

Edit `js/script.js` and replace `YOUR_API_KEY_HERE` with your actual API key:

```javascript
const API_KEY = 'your_actual_api_key_here';
```

### 3. Deploy

This project is designed to deploy on Render.com as a static site:

1. Push this repository to GitHub
2. Connect your GitHub account to Render.com
3. Create a new Static Site service
4. Point it to this repository
5. Deploy!

## Local Development

To run locally, simply open `index.html` in your web browser. For API calls to work, you'll need:

1. A valid API key configured
2. HTTPS or run from localhost (due to CORS policies)

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: OpenWeatherMap API
- **Hosting**: Render.com (Static Site)
- **Version Control**: Git/GitHub

## Cities Featured

- New York, USA
- London, UK  
- Tokyo, Japan

## License

MIT License - feel free to use and modify!
