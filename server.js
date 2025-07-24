const express = require('express');
const path = require('path');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Database will be used for performance data storage
let useDatabase = false;

// Configuration with validation
// Note: Performance dashboard is now publicly accessible

if (!process.env.OPENWEATHER_API_KEY) {
    console.warn('⚠️  WARNING: No OpenWeatherMap API key found. Weather features may not work.');
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Rate limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // limit each IP to 30 API requests per windowMs
    message: 'Too many API requests from this IP, please try again later.'
});

const performanceLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each IP to 20 performance requests per windowMs
    message: 'Too many performance requests, please try again later.'
});

// CORS configuration - restrict origins in production
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? ['https://weather-dashboard-app.onrender.com', /\.onrender\.com$/]
        : true,
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' })); // Limit payload size
app.use(express.static('public'));
app.use(generalLimiter);

// Password generation function removed - performance dashboard is now public

// Input validation function
function validateCityName(city) {
    if (!city || typeof city !== 'string') return false;
    if (city.length > 100) return false; // Prevent excessively long city names
    if (!/^[a-zA-Z\s\-'.]+$/.test(city)) return false; // Only allow letters, spaces, hyphens, apostrophes
    return true;
}

// Performance tracking middleware with database storage
app.use((req, res, next) => {
    const startTime = Date.now();
    
    // Only track meaningful user page visits, not API calls, assets, etc.
    const isUserPageVisit = (
        req.method === 'GET' && 
        (req.path === '/' || req.path === '/performance') &&
        !req.path.startsWith('/api/') &&
        !req.path.startsWith('/css/') &&
        !req.path.startsWith('/js/') &&
        !req.path.includes('.') // Skip files with extensions (css, js, images, etc.)
    );
    
    // Record hit to database if available (only for user page visits)
    if (useDatabase && isUserPageVisit) {
        db.recordHit(req.path, req.method, req.ip || req.connection.remoteAddress);
    }
    
    // Track response time for all requests (for performance monitoring)
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        
        // Record response time to database if available (for all requests)
        if (useDatabase) {
            db.recordResponseTime(req.path, responseTime);
        }
    });
    
    next();
});

// Authentication middleware for performance dashboard - REMOVED
// Performance dashboard is now publicly accessible

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Performance dashboard route (publicly accessible)
app.get('/performance', performanceLimiter, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'performance.html'));
});

// API endpoint to get performance data (publicly accessible)
app.get('/api/performance', performanceLimiter, async (req, res) => {
    try {
        if (useDatabase) {
            // Get data from database
            const performanceData = await db.getPerformanceData();
            res.json(performanceData);
        } else {
            // Fallback response when database is not available
            res.json({
                hits: {
                    last24hours: 0,
                    lastWeek: 0,
                    lastMonth: 0
                },
                averageResponseTime: {
                    lastHour: 0,
                    last24Hours: 0
                },
                totalRequests: 0,
                lastUpdated: new Date(),
                message: 'Database not connected - performance tracking disabled'
            });
        }
    } catch (error) {
        console.error('Error fetching performance data:', error);
        res.status(500).json({
            error: 'Unable to fetch performance data',
            message: error.message
        });
    }
});

// API proxy for weather data (to track weather API calls)
app.get('/api/weather/:city', apiLimiter, async (req, res) => {
    const { city } = req.params;
    
    // Input validation
    if (!validateCityName(city)) {
        return res.status(400).json({ error: 'Invalid city name' });
    }
    
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    
    // Check if API key is available
    if (!API_KEY) {
        console.error('No OpenWeatherMap API key configured');
        return res.status(500).json({ error: 'Weather service unavailable' });
    }
    
    try {
        // Use built-in https module for better compatibility
        const https = require('https');
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;
        
        const weatherData = await new Promise((resolve, reject) => {
            const request = https.get(url, { timeout: 10000 }, (response) => {
                let data = '';
                
                // Limit response size to prevent memory issues
                const maxSize = 1024 * 1024; // 1MB limit
                let size = 0;
                
                response.on('data', (chunk) => {
                    size += chunk.length;
                    if (size > maxSize) {
                        request.destroy();
                        reject(new Error('Response too large'));
                        return;
                    }
                    data += chunk;
                });
                
                response.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        resolve(parsed);
                    } catch (err) {
                        reject(new Error('Invalid JSON response'));
                    }
                });
            });
            
            request.on('error', (err) => {
                reject(err);
            });
            
            request.on('timeout', () => {
                request.destroy();
                reject(new Error('Request timeout'));
            });
        });
        
        res.json(weatherData);
    } catch (error) {
        console.error('Weather API error:', error.message);
        res.status(500).json({ error: 'Weather service temporarily unavailable' });
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

// Initialize database and start server
async function startServer() {
    // Test database connection
    if (process.env.DATABASE_URL) {
        console.log('🔄 Testing database connection...');
        const dbConnected = await db.testConnection();
        
        if (dbConnected) {
            try {
                await db.initializeDatabase();
                useDatabase = true;
                console.log('📊 Database performance tracking enabled');
                
                // Set up periodic cleanup (every 24 hours)
                setInterval(async () => {
                    try {
                        await db.cleanOldData();
                    } catch (error) {
                        console.error('Error during periodic cleanup:', error);
                    }
                }, 24 * 60 * 60 * 1000);
                
            } catch (error) {
                console.error('❌ Database initialization failed:', error);
                console.log('⚠️  Continuing without database - performance tracking disabled');
            }
        } else {
            console.log('⚠️  Database connection failed - performance tracking disabled');
        }
    } else {
        console.log('ℹ️  No DATABASE_URL provided - performance tracking disabled');
    }
    
    // Start server - bind to 0.0.0.0 for Render, localhost for local development
    const host = process.env.PORT ? '0.0.0.0' : '127.0.0.1'; // If PORT env var exists, we're on Render
    const server = app.listen(PORT, host, () => {
        console.log(`Weather Dashboard server running on ${host}:${PORT}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Host binding: ${host} (${process.env.PORT ? 'Render' : 'Local'})`);
        if (host === '127.0.0.1') {
            console.log(`Main dashboard: http://localhost:${PORT}`);
            console.log(`Performance dashboard: http://localhost:${PORT}/performance`);
        } else {
            console.log(`Service will be available at your Render URL`);
        }
        console.log('Performance dashboard is publicly accessible (no login required)');
        console.log(`Performance tracking: ${useDatabase ? 'DATABASE ENABLED' : 'DISABLED'}`);
        console.log('Server started successfully!');
    });
    
    server.on('error', (err) => {
        console.error('Server error:', err);
    });
}

// Start the server
startServer().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});

module.exports = app;
