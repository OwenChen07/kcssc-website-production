// Database connection configuration
// Supports PostgreSQL, MySQL, and SQLite
// Load .env file if not already loaded (safety measure)
import dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config({ path: resolve(process.cwd(), '.env') });
import pg from 'pg';
const { Pool: PostgresPool } = pg;
// Check if database is enabled
export const DB_ENABLED = process.env.DB_ENABLED !== 'false'; // Default to true
// Database configuration from environment variables
// Helper to clean environment variable (remove quotes and trim whitespace)
const cleanEnvVar = (value) => {
    if (!value)
        return undefined;
    // Remove surrounding quotes if present
    const cleaned = value.trim().replace(/^["']|["']$/g, '');
    return cleaned || undefined;
};
// Support both connection string (Supabase style) and individual settings
let dbConfig;
if (process.env.DATABASE_URL) {
    // Use connection string if provided (Supabase, Railway, etc.)
    let connectionString = cleanEnvVar(process.env.DATABASE_URL);
    // Remove sslmode from connection string if present - we'll handle SSL via config
    // This prevents conflicts between connection string SSL and config SSL
    connectionString = connectionString?.replace(/[?&]sslmode=[^&]*/g, '') || '';
    // For Supabase, we need SSL but must accept their certificate
    // The connection string approach can conflict, so we handle SSL via config
    const sslConfig = process.env.DB_SSL === 'false'
        ? false
        : {
            rejectUnauthorized: false, // Accept Supabase's certificate (required for their setup)
        };
    dbConfig = {
        connectionString: connectionString,
        ssl: sslConfig,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 20000, // Longer timeout for cloud databases
    };
}
else {
    // Use individual settings
    dbConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME || 'kcssc_db',
        user: process.env.DB_USER || 'postgres',
        password: cleanEnvVar(process.env.DB_PASSWORD), // Clean the password value
        ssl: process.env.DB_SSL === 'true'
            ? { rejectUnauthorized: false, require: true }
            : false,
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000, // Longer timeout for cloud databases
    };
}
// Create PostgreSQL connection pool only if DB is enabled
export const pool = DB_ENABLED ? new PostgresPool(dbConfig) : null;
// Test database connection
if (pool) {
    pool.on('connect', () => {
        console.log('✅ Database connected successfully');
    });
    pool.on('error', (err) => {
        console.error('❌ Unexpected error on idle client', err);
        // Don't exit process, just log the error
    });
}
// Helper function to execute queries
export async function query(text, params) {
    if (!pool) {
        throw new Error('Database is not enabled. Set DB_ENABLED=true and configure database credentials.');
    }
    const start = Date.now();
    try {
        const res = await pool.query(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: res.rowCount });
        return res;
    }
    catch (error) {
        console.error('Database query error:', error);
        throw error;
    }
}
// Initialize database (create tables if they don't exist)
export async function initializeDatabase() {
    if (!DB_ENABLED) {
        console.log('ℹ️  Database is disabled. Server will run without database connection.');
        console.log('   Set DB_ENABLED=true in .env to enable database.');
        return;
    }
    if (!pool) {
        console.log('ℹ️  Database pool not initialized. Check your database configuration.');
        return;
    }
    // Check if connection details are provided
    if (!process.env.DATABASE_URL && !process.env.DB_PASSWORD && !process.env.DB_HOST) {
        console.warn('⚠️  Database connection details not found');
        console.warn('   Set DATABASE_URL (connection string) or individual DB_* variables');
        console.warn('   Or set DB_ENABLED=false to run without database');
    }
    try {
        // Test connection first
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection verified');
        // Show connection info (without sensitive data)
        if (process.env.DATABASE_URL) {
            const url = process.env.DATABASE_URL;
            const hostMatch = url.match(/@([^:]+):/);
            if (hostMatch) {
                console.log(`   Connected to: ${hostMatch[1]}`);
            }
        }
        else {
            console.log(`   Connected to: ${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
        }
        // Note: Schema should be run manually via psql or migration tool
        // This function just verifies the connection is working
    }
    catch (error) {
        console.error('❌ Database connection failed:', error.message);
        if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
            console.error('   DNS/Network issue: Cannot resolve database hostname');
            console.error('   - Check your internet connection');
            console.error('   - Verify the hostname in DATABASE_URL is correct');
            console.error('   - Make sure your Supabase project is fully provisioned (wait 2-3 minutes)');
            console.error('   - In Supabase dashboard, go to Settings → Database to verify connection string');
            console.error('   - The hostname should be: db.[project-ref].supabase.co');
        }
        else if (error.message.includes('password') || error.message.includes('authentication')) {
            console.error('   Password/authentication issue detected');
            console.error('   - Check DB_PASSWORD in .env file');
            console.error('   - Verify password doesn\'t have quotes around it');
            console.error('   - For DATABASE_URL, ensure password is URL-encoded if it has special chars');
        }
        else if (error.message.includes('SSL') || error.message.includes('ssl')) {
            console.error('   SSL connection issue');
            console.error('   - Set DB_SSL=true in .env');
            console.error('   - Supabase requires SSL connections');
        }
        else {
            console.error('   Please check your database configuration in .env file');
            console.error('   Or set DB_ENABLED=false to run without database');
        }
        throw error;
    }
}
// Close database connection
export async function closeDatabase() {
    if (pool) {
        await pool.end();
        console.log('✅ Database connection closed');
    }
}
