const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Initialize database tables
async function initializeDatabase() {
    const client = await pool.connect();
    
    try {
        // Create hits table
        await client.query(`
            CREATE TABLE IF NOT EXISTS hits (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                path VARCHAR(255) NOT NULL,
                method VARCHAR(10) NOT NULL,
                ip INET
            )
        `);

        // Create response_times table
        await client.query(`
            CREATE TABLE IF NOT EXISTS response_times (
                id SERIAL PRIMARY KEY,
                timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                response_time INTEGER NOT NULL,
                path VARCHAR(255) NOT NULL
            )
        `);

        // Create indexes for better performance
        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_hits_timestamp 
            ON hits(timestamp)
        `);

        await client.query(`
            CREATE INDEX IF NOT EXISTS idx_response_times_timestamp 
            ON response_times(timestamp)
        `);

        console.log('✅ Database tables initialized successfully');

    } catch (error) {
        console.error('❌ Error initializing database:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Record a hit
async function recordHit(path, method, ip) {
    const client = await pool.connect();
    
    try {
        await client.query(
            'INSERT INTO hits (path, method, ip) VALUES ($1, $2, $3)',
            [path, method, ip]
        );
    } catch (error) {
        console.error('Error recording hit:', error);
    } finally {
        client.release();
    }
}

// Record response time
async function recordResponseTime(path, responseTime) {
    const client = await pool.connect();
    
    try {
        await client.query(
            'INSERT INTO response_times (path, response_time) VALUES ($1, $2)',
            [path, responseTime]
        );
    } catch (error) {
        console.error('Error recording response time:', error);
    } finally {
        client.release();
    }
}

// Get performance data
async function getPerformanceData() {
    const client = await pool.connect();
    
    try {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

        // Get hit counts
        const hits24h = await client.query(
            'SELECT COUNT(*) as count FROM hits WHERE timestamp > $1',
            [oneDayAgo]
        );
        
        const hits7d = await client.query(
            'SELECT COUNT(*) as count FROM hits WHERE timestamp > $1',
            [oneWeekAgo]
        );
        
        const hits30d = await client.query(
            'SELECT COUNT(*) as count FROM hits WHERE timestamp > $1',
            [oneMonthAgo]
        );

        // Get total hits
        const totalHits = await client.query('SELECT COUNT(*) as count FROM hits');

        // Get average response times
        const avgResponseTime1h = await client.query(
            'SELECT AVG(response_time) as avg FROM response_times WHERE timestamp > $1',
            [oneHourAgo]
        );

        const avgResponseTime24h = await client.query(
            'SELECT AVG(response_time) as avg FROM response_times WHERE timestamp > $1',
            [oneDayAgo]
        );

        return {
            hits: {
                last24hours: parseInt(hits24h.rows[0].count),
                lastWeek: parseInt(hits7d.rows[0].count),
                lastMonth: parseInt(hits30d.rows[0].count)
            },
            averageResponseTime: {
                lastHour: avgResponseTime1h.rows[0].avg ? Math.round(parseFloat(avgResponseTime1h.rows[0].avg)) : 0,
                last24Hours: avgResponseTime24h.rows[0].avg ? Math.round(parseFloat(avgResponseTime24h.rows[0].avg)) : 0
            },
            totalRequests: parseInt(totalHits.rows[0].count),
            lastUpdated: now
        };

    } catch (error) {
        console.error('Error getting performance data:', error);
        throw error;
    } finally {
        client.release();
    }
}

// Clean old data (run periodically)
async function cleanOldData() {
    const client = await pool.connect();
    
    try {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

        // Keep hits for 30 days
        await client.query('DELETE FROM hits WHERE timestamp < $1', [thirtyDaysAgo]);
        
        // Keep response times for 7 days (they're more frequent)
        await client.query('DELETE FROM response_times WHERE timestamp < $1', [sevenDaysAgo]);
        
        console.log('🧹 Old performance data cleaned');
    } catch (error) {
        console.error('Error cleaning old data:', error);
    } finally {
        client.release();
    }
}

// Test database connection
async function testConnection() {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
}

module.exports = {
    initializeDatabase,
    recordHit,
    recordResponseTime,
    getPerformanceData,
    cleanOldData,
    testConnection,
    pool
};
