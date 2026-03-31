// Main server file
// IMPORTANT: Load .env file FIRST, before any other imports that use process.env
import dotenv from 'dotenv';
import { resolve } from 'path';
// Determine which .env file to load based on NODE_ENV
const isDevelopment = process.env.NODE_ENV !== 'production';
const envFileName = isDevelopment ? '.env.development' : '.env.production';
const envPath = resolve(process.cwd(), envFileName);
// Try to load the environment-specific file first
let result = dotenv.config({ path: envPath });
// If environment-specific file doesn't exist, fall back to .env
if (result.error) {
    const fallbackPath = resolve(process.cwd(), '.env');
    result = dotenv.config({ path: fallbackPath });
    if (result.error) {
        console.warn('⚠️  .env file not found or error loading it:', result.error.message);
        console.warn(`   Looking for ${envFileName} at:`, envPath);
        console.warn('   Also tried fallback .env at:', fallbackPath);
        console.warn('   Current working directory:', process.cwd());
    }
    else {
        console.log('✅ .env file loaded successfully from:', fallbackPath);
    }
}
else {
    console.log(`✅ ${envFileName} loaded successfully from:`, envPath);
}
// NOW import other modules (they will have access to loaded env vars)
import express from 'express';
import cors from 'cors';
import { initializeDatabase } from './db/connection.js';
import eventsRouter from './routes/events.js';
import programsRouter from './routes/programs.js';
import photosRouter from './routes/photos.js';
import uploadRouter from './routes/upload.js';
const app = express();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from public directory
app.use(express.static(resolve(process.cwd(), 'public')));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// API routes
app.use('/api/events', eventsRouter);
app.use('/api/programs', programsRouter);
app.use('/api/photos', photosRouter);
app.use('/api/upload', uploadRouter);
// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
// Start server
async function startServer() {
    try {
        // Initialize database (non-blocking - server will start even if DB fails)
        try {
            await initializeDatabase();
        }
        catch (error) {
            console.warn('⚠️  Warning: Database initialization failed, but server will continue');
            console.warn('   API endpoints will not work until database is configured');
            console.warn('   Create a .env file with database credentials or set DB_ENABLED=false');
        }
        // Start listening
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 API available at http://localhost:${PORT}/api`);
            console.log(`🏥 Health check: http://localhost:${PORT}/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    const { closeDatabase } = await import('./db/connection.js');
    await closeDatabase();
    process.exit(0);
});
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    const { closeDatabase } = await import('./db/connection.js');
    await closeDatabase();
    process.exit(0);
});
