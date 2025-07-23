const express = require('express');
const path = require('path');
const auth = require('basic-auth');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Performance data storage (in-memory for simplicity)
let performanceData = {
    hits: [],
    responseTimes: []
};

// Configuration
const PERFORMANCE_PASSWORD = process.env.PERFORMANCE_PASSWORD || 'admin123';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // We'll move static files to public folder

// Performance tracking middleware
app.use((req, res, next) => {
    const startTime = Date.now();
    
    // Track hit
    performanceData.hits.push({
        timestamp: new Date(),
        path: req.path,
        method: req.method,
        ip: req.ip || req.connection.remoteAddress
    });
    
    // Clean old data (keep only last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    performanceData.hits = performanceData.hits.filter(hit => hit.timestamp > thirtyDaysAgo);
    
    // Track response time
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        performanceData.responseTimes.push({
            timestamp: new Date(),
            responseTime: responseTime,
            path: req.path
        });
        
        // Clean old response times (keep only last 24 hours for detailed tracking)
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        performanceData.responseTimes = performanceData.responseTimes.filter(
            rt => rt.timestamp > oneDayAgo
        );
    });
    
    next();
});

// Authentication middleware for performance dashboard
const requireAuth = (req, res, next) => {
    const credentials = auth(req);
    
    if (!credentials || credentials.name !== 'admin' || credentials.pass !== PERFORMANCE_PASSWORD) {
        res.set('WWW-Authenticate', 'Basic realm="Performance Dashboard"');
        return res.status(401).send('Authentication required');
    }
    
    next();
};

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Performance dashboard route (password protected)
app.get('/performance', requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'performance.html'));
});

// API endpoint to get performance data
app.get('/api/performance', requireAuth, (req, res) => {
    const now = new Date();
    
    // Calculate hits
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    const hits24h = performanceData.hits.filter(hit => hit.timestamp > oneDayAgo).length;
    const hits7d = performanceData.hits.filter(hit => hit.timestamp > oneWeekAgo).length;
    const hits30d = performanceData.hits.filter(hit => hit.timestamp > oneMonthAgo).length;
    
    // Calculate average response times
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    const responseTimesLastHour = performanceData.responseTimes.filter(
        rt => rt.timestamp > oneHourAgo
    );
    const responseTimesLast24h = performanceData.responseTimes.filter(
        rt => rt.timestamp > oneDayAgo
    );
    
    const avgResponseTime1h = responseTimesLastHour.length > 0 
        ? Math.round(responseTimesLastHour.reduce((sum, rt) => sum + rt.responseTime, 0) / responseTimesLastHour.length)
        : 0;
        
    const avgResponseTime24h = responseTimesLast24h.length > 0
        ? Math.round(responseTimesLast24h.reduce((sum, rt) => sum + rt.responseTime, 0) / responseTimesLast24h.length)
        : 0;
    
    res.json({
        hits: {
            last24hours: hits24h,
            lastWeek: hits7d,
            lastMonth: hits30d
        },
        averageResponseTime: {
            lastHour: avgResponseTime1h,
            last24Hours: avgResponseTime24h
        },
        totalRequests: performanceData.hits.length,
        lastUpdated: now
    });
});

// API proxy for weather data (to track weather API calls)
app.get('/api/weather/:city', async (req, res) => {
    const { city } = req.params;
    const API_KEY = process.env.OPENWEATHER_API_KEY || '47d05f31a987ba26930cfaa7fd83326c';
    
    try {
        // Use built-in https module for better compatibility
        const https = require('https');
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        
        const weatherData = await new Promise((resolve, reject) => {
            https.get(url, (response) => {
                let data = '';
                
                response.on('data', (chunk) => {
                    data += chunk;
                });
                
                response.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (err) {
                        reject(err);
                    }
                });
            }).on('error', (err) => {
                reject(err);
            });
        });
        
        res.json(weatherData);
    } catch (error) {
        console.error('Weather API error:', error);
        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Handle 404s
app.use('*', (req, res) => {
    res.status(404).send('Page not found');
});

// Error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Weather Dashboard server running on port ${PORT}`);
    console.log(`Main dashboard: http://localhost:${PORT}`);
    console.log(`Performance dashboard: http://localhost:${PORT}/performance`);
    console.log(`Performance login: admin / ${PERFORMANCE_PASSWORD}`);
    console.log('Server started successfully!');
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

module.exports = app;
