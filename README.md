# Weather Dashboard with Performance Monitoring 🌤️📊

A weather dashboard with server-side performance tracking, built with Node.js and Express.

## Features

### Weather Dashboard
- Real-time weather data for New York, London, and Tokyo
- Displays temperature, weather description, and humidity
- Clean, responsive design
- Auto-refreshes every 10 minutes

### Performance Dashboard
- **Password Protected** - Secure access to performance metrics
- **Hit Tracking** - Number of hits in the last 24 hours, week, and month
- **Response Time Monitoring** - Average response times for last hour and 24 hours
- **Real-time Updates** - Auto-refreshes every 30 seconds
- **Memory-based Storage** - Suitable for Render's free tier

## Deployment URLs

- **Main Dashboard**: `https://your-app.onrender.com/`
- **Performance Dashboard**: `https://your-app.onrender.com/performance`

## Setup

### Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your values
   ```

3. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

4. Access the dashboard:
   - Weather Dashboard: http://localhost:3000
   - Performance Dashboard: http://localhost:3000/performance

### Render Deployment

1. Connect your GitHub repository to Render
2. Create a new **Web Service** (not Static Site)
3. Set environment variables in Render dashboard:
   - `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
   - `PERFORMANCE_PASSWORD`: Password for performance dashboard access
4. Deploy!

## Environment Variables

- `OPENWEATHER_API_KEY`: API key from OpenWeatherMap
- `PERFORMANCE_PASSWORD`: Password for performance dashboard (default: admin123)
- `PORT`: Server port (automatically set by Render)

## Performance Dashboard Access

- **URL**: `/performance`
- **Username**: `admin`
- **Password**: Set via `PERFORMANCE_PASSWORD` environment variable

## Architecture

- **Frontend**: Static HTML/CSS/JS served by Express
- **Backend**: Node.js with Express server
- **Performance Tracking**: In-memory storage (resets on restart)
- **Authentication**: Basic HTTP authentication for performance dashboard

## API Endpoints

- `GET /` - Main weather dashboard
- `GET /performance` - Performance dashboard (protected)
- `GET /api/performance` - Performance data JSON (protected)
- `GET /api/weather/:city` - Weather data for specific city

## Files

- `server.js` - Express server with performance tracking
- `package.json` - Node.js dependencies and scripts
- `public/` - Static files (HTML, CSS, JS)
  - `index.html` - Main weather dashboard
  - `performance.html` - Performance dashboard
  - `css/style.css` - Shared styling
  - `js/script.js` - Weather dashboard logic
- `APItester/` - Python API testing utilities

## Testing

Use the Python API tester to verify your OpenWeatherMap API key:

```bash
python APItester/test_api.py
```

## Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Basic HTTP Auth
- **API**: OpenWeatherMap API
- **Hosting**: Render.com (Web Service)
- **Version Control**: Git/GitHub

## Performance Metrics Tracked

- **Page Hits**: Counts all requests to the application
- **Response Times**: Measures server response time for all requests
- **Time Periods**: Data retention for up to 30 days (hits) and 24 hours (response times)
- **Real-time**: Updates every 30 seconds on the performance dashboard

## Security

- Performance dashboard is password-protected using Basic HTTP Authentication
- Environment variables keep sensitive data secure
- API key is server-side only, not exposed to client

## License

MIT License - feel free to use and modify!
