# Production Deployment Guide

This guide explains how to deploy the KCSSC website to production with proper API routing.

## Problem: API Routes Returning 404

If you're seeing HTML 404 pages when accessing `/api/*` endpoints in production, it means the reverse proxy (Nginx) is not configured to forward API requests to the backend server.

## Solution: Configure Nginx to Proxy API Requests

### Step 1: Ensure Backend Server is Running

The backend Express server must be running and listening on port 3000 (or the port specified in your `.env.production` file).

```bash
# Build the backend
npm run server:build

# Start the backend server (using PM2, systemd, or your process manager)
npm run server:start:prod
```

Verify the backend is running:
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}

curl http://localhost:3000/api/photos
# Should return JSON array of photos
```

### Step 2: Configure Nginx

1. **Copy the example Nginx configuration:**
   ```bash
   sudo cp nginx.conf.example /etc/nginx/sites-available/kcssc
   ```

2. **Edit the configuration file:**
   ```bash
   sudo nano /etc/nginx/sites-available/kcssc
   ```

3. **Update the following paths:**
   - `root`: Set to the absolute path of your `dist` directory
     ```nginx
     root /home/username/kcssc-website-production/dist;
     ```
   - `ssl_certificate` and `ssl_certificate_key`: Update to your SSL certificate paths
   - `proxy_pass`: If your backend runs on a different port, update `localhost:3000`

4. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/kcssc /etc/nginx/sites-enabled/
   ```

5. **Test the configuration:**
   ```bash
   sudo nginx -t
   ```

6. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   # or
   sudo service nginx reload
   ```

### Step 3: Verify the Configuration

1. **Test API endpoint directly:**
   ```bash
   curl https://staging2.kcssc.org/api/photos
   # Should return JSON, not HTML
   ```

2. **Check browser console:**
   - Open https://staging2.kcssc.org
   - Open Developer Tools → Network tab
   - Look for requests to `/api/photos` or `/api/events`
   - They should return JSON with status 200, not 404 HTML

### Step 4: Environment Variables

Ensure your production environment has the correct variables:

**Backend (.env.production):**
```env
PORT=3000
NODE_ENV=production
DB_ENABLED=true
DB_HOST=localhost
DB_PORT=5432
DB_NAME=kcssc_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

**Frontend (build-time, set before `npm run build`):**
```bash
export VITE_API_BASE_URL=/api
# or leave empty to use relative URLs
export VITE_USE_MOCK_DATA=false
```

Then build:
```bash
npm run build
```

## Alternative: Using Express to Serve Frontend

If you prefer not to use Nginx, you can configure Express to serve the frontend:

1. Update `server/index.ts` to serve the `dist` directory:
   ```typescript
   // Serve static files from dist directory (frontend build)
   app.use(express.static(resolve(process.cwd(), 'dist')));
   
   // API routes (must come before catch-all)
   app.use('/api/events', eventsRouter);
   app.use('/api/programs', programsRouter);
   app.use('/api/photos', photosRouter);
   app.use('/api/upload', uploadRouter);
   
   // Catch-all handler: serve index.html for client-side routing
   app.get('*', (req: Request, res: Response) => {
     res.sendFile(resolve(process.cwd(), 'dist', 'index.html'));
   });
   ```

2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start npm --name "kcssc-backend" -- run server:start:prod
   pm2 save
   pm2 startup
   ```

3. Configure SSL with a reverse proxy (still recommended) or use a tool like `certbot` with standalone mode.

## Troubleshooting

### API requests still return 404

1. **Check if backend is running:**
   ```bash
   curl http://localhost:3000/api/photos
   ```

2. **Check Nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Verify Nginx configuration:**
   ```bash
   sudo nginx -t
   ```

4. **Check if the location block matches:**
   - The `location /api/` block must come **before** the `location /` block
   - Ensure `proxy_pass` points to the correct backend URL

### Backend not receiving requests

1. **Check backend logs** to see if requests are arriving
2. **Verify the backend port** matches the Nginx `proxy_pass` configuration
3. **Check firewall rules** - ensure port 3000 is accessible from localhost

### CORS errors

If you see CORS errors, ensure:
1. The backend has CORS enabled (already configured in `server/index.ts`)
2. The `proxy_set_header Host $host;` is set in Nginx config
3. The frontend uses relative URLs or the correct API base URL

## Production Checklist

- [ ] Backend server is running and accessible on localhost:3000
- [ ] Frontend is built (`npm run build`) and `dist` directory exists
- [ ] Nginx configuration includes `/api/` proxy location block
- [ ] Nginx configuration tested (`nginx -t`)
- [ ] Nginx reloaded after configuration changes
- [ ] SSL certificates are valid and configured
- [ ] Environment variables are set correctly
- [ ] Database is accessible and initialized
- [ ] API endpoints return JSON when accessed directly
- [ ] Frontend can successfully fetch from `/api/*` endpoints

