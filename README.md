# Weather Dashboard with Performance Monitoring 🌤️📊

A weather dashboard with server-side performance tracking, built with Node.js and Express.

## Features

### Weather Dashboard
- Real-time weather data for New York, London, and Tokyo
- Displays temperature, weather description, and humidity
- Clean, responsive design
- Auto-refreshes every 10 minutes

### Performance Dashboard
- **Publicly Accessible** - No password required for access
- **Hit Tracking** - Number of hits in the last 24 hours, week, and month
- **Response Time Monitoring** - Average response times for last hour and 24 hours
- **Real-time Updates** - Auto-refreshes every 30 seconds
- **Persistent Storage** - PostgreSQL database preserves data across deployments
- **Automatic Cleanup** - Old data is automatically cleaned to manage storage

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
2. The `render.yaml` file will automatically create:
   - A **Web Service** for the application
   - A **PostgreSQL Database** (free tier) for performance data
3. Set environment variables in Render dashboard:
   - `OPENWEATHER_API_KEY`: Your OpenWeatherMap API key
   - `DATABASE_URL`: Automatically set by Render database service
4. Deploy!

## Environment Variables

- `OPENWEATHER_API_KEY`: API key from OpenWeatherMap
- `DATABASE_URL`: PostgreSQL connection string (automatically set by Render)
- `PORT`: Server port (automatically set by Render)

## Performance Dashboard Access

- **URL**: `/performance`
- **Access**: Publicly accessible (no authentication required)

## Architecture

- **Frontend**: Static HTML/CSS/JS served by Express
- **Backend**: Node.js with Express server
- **Database**: PostgreSQL for persistent performance data storage
- **Performance Tracking**: Database-backed with automatic cleanup
- **Authentication**: None required - publicly accessible

## API Endpoints

- `GET /` - Main weather dashboard
- `GET /performance` - Performance dashboard (public)
- `GET /api/performance` - Performance data JSON (public)
- `GET /api/weather/:city` - Weather data for specific city

## Files

- `server.js` - Express server with performance tracking
- `db.js` - PostgreSQL database operations and schema
- `package.json` - Node.js dependencies and scripts
- `render.yaml` - Render deployment configuration (includes database)
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
- **Database**: PostgreSQL (Render free tier)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: OpenWeatherMap API
- **Hosting**: Render.com (Web Service + Database)
- **Version Control**: Git/GitHub
- **CLI**: Render CLI for deployment management

## 🚀 Render CLI Setup

### Quick Setup for Development Sessions

```powershell
# One-line setup (copy and paste this at start of any session)
cd "C:\Users\BookR\OneDrive\Documents\weather-dashboard"; $env:HOME = $env:USERPROFILE; if (!(Test-Path ".\render.exe")) { Invoke-WebRequest -Uri "https://github.com/render-oss/render-cli-deprecated/releases/download/v0.1.11/render-windows-x86_64.exe" -OutFile "render.exe" -UseBasicParsing }; .\render.exe services list
```

### Alternative: Use Setup Script

```powershell
# Run the automated setup script
powershell -ExecutionPolicy Bypass -File ".\quick-render-setup.ps1"
```

### Manual Setup Steps

1. **Set Environment Variable**:
   ```powershell
   $env:HOME = $env:USERPROFILE
   ```

2. **Download Render CLI** (if not present):
   ```powershell
   Invoke-WebRequest -Uri "https://github.com/render-oss/render-cli-deprecated/releases/download/v0.1.11/render-windows-x86_64.exe" -OutFile "render.exe" -UseBasicParsing
   ```

3. **Verify Installation**:
   ```powershell
   .\render.exe version
   ```

4. **Configure CLI** (first time only):
   ```powershell
   .\render.exe config init
   ```

### Common Render CLI Commands

```powershell
# Always set HOME first
$env:HOME = $env:USERPROFILE

# List services
.\render.exe services list

# Show service details
.\render.exe services show --id srv-d20i38fdiees739ij7eg

# List recent deployments
.\render.exe deploys list --service-id srv-d20i38fdiees739ij7eg

# View service logs
.\render.exe services tail --service-id srv-d20i38fdiees739ij7eg
```

### Service Information

- **Main Service ID**: `srv-d20i38fdiees739ij7eg`
- **Service Name**: `weather-dashboard-app`
- **Live URL**: https://weather-dashboard-app-p0vz.onrender.com
- **Dashboard URL**: https://dashboard.render.com/web/srv-d20i38fdiees739ij7eg

## Performance Metrics Tracked

- **User Page Visits**: Counts only actual user visits to main pages (/ and /performance)
  - Excludes API calls, CSS/JS files, and other assets
  - Focuses on meaningful user interactions
- **Response Times**: Measures server response time for all requests (for performance monitoring)
- **Data Retention**: 
  - User visits: 30 days (automatically cleaned)
  - Response times: 7 days (automatically cleaned)
- **Real-time**: Updates every 30 seconds on the performance dashboard
- **Persistence**: Data survives server restarts and deployments

## Security

- Performance dashboard is publicly accessible for easy monitoring
- Environment variables keep sensitive data secure
- API key is server-side only, not exposed to client
- Rate limiting protects against abuse

## License

MIT License - feel free to use and modify!
