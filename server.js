const express = require('express');
const path = require('path');
const auth = require('basic-auth');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const app = express();
const PORT = process.env.PORT || 3000;

// Performance data storage (in-memory for simplicity)
let performanceData = {
    hits: [],
    responseTimes: []
};

// Configuration with validation
if (!process.env.PERFORMANCE_PASSWORD) {
    console.warn('⚠️  WARNING: Using default password. Set PERFORMANCE_PASSWORD environment variable!');
}
const PERFORMANCE_PASSWORD = process.env.PERFORMANCE_PASSWORD || generateSecurePassword();

if (!process.env.OPENWEATHER_API_KEY) {
    console.warn('⚠️  WARNING: No OpenWeatherMap API key found. Weather features may not work.');
}

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", "https://api.openweathermap.org"]
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

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 failed auth attempts per windowMs
    message: 'Too many authentication attempts, please try again later.',
    skipSuccessfulRequests: true
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

// Generate secure password if none provided
function generateSecurePassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 16; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
}

// Input validation function
function validateCityName(city) {
    if (!city || typeof city !== 'string') return false;
    if (city.length > 100) return false; // Prevent excessively long city names
    if (!/^[a-zA-Z\s\-'.]+$/.test(city)) return false; // Only allow letters, spaces, hyphens, apostrophes
    return true;
}

// Performance tracking middleware with memory limits
app.use((req, res, next) => {
    const startTime = Date.now();
    
    // Memory protection - limit array sizes
    const MAX_HITS = 10000;
    const MAX_RESPONSE_TIMES = 5000;
    
    // Track hit with memory limits
    performanceData.hits.push({
        timestamp: new Date(),
        path: req.path,
        method: req.method,
        ip: req.ip || req.connection.remoteAddress
    });
    
    // Enforce memory limits
    if (performanceData.hits.length > MAX_HITS) {
        performanceData.hits = performanceData.hits.slice(-MAX_HITS);
    }
    
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
        
        // Enforce memory limits
        if (performanceData.responseTimes.length > MAX_RESPONSE_TIMES) {
            performanceData.responseTimes = performanceData.responseTimes.slice(-MAX_RESPONSE_TIMES);
        }
        
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
app.get('/performance', authLimiter, requireAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'performance.html'));
});

// API endpoint to get performance data
app.get('/api/performance', authLimiter, requireAuth, (req, res) => {
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

// Start server - bind to all interfaces in production, localhost in development
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : '127.0.0.1';
const server = app.listen(PORT, host, () => {
    console.log(`Weather Dashboard server running on ${host}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    if (host === '127.0.0.1') {
        console.log(`Main dashboard: http://localhost:${PORT}`);
        console.log(`Performance dashboard: http://localhost:${PORT}/performance`);
    }
    console.log(`Performance login: admin / ${PERFORMANCE_PASSWORD}`);
    console.log('Server started successfully!');
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

module.exports = app;
