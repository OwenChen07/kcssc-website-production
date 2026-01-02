# Production Setup - Step-by-Step Guide

This guide walks you through fixing the API routing issue in production at `staging2.kcssc.org`.

## Overview

**Problem**: API requests to `/api/photos` and `/api/events` return HTML 404 pages instead of JSON.

**Solution**: Configure Nginx to proxy `/api/*` requests to the backend Express server running on port 3000.

---

## Prerequisites

Before starting, ensure you have:
- SSH access to the production server (`staging2.kcssc.org`)
- Root/sudo access to modify Nginx configuration
- The backend server code deployed and built

---

## Step 1: Verify Backend Server is Running

First, check if your backend server is running and accessible.

### On the Production Server:

```bash
# Check if the backend is running on port 3000
curl http://localhost:3000/health

# Should return: {"status":"ok","timestamp":"..."}

# Test an API endpoint directly
curl http://localhost:3000/api/photos

# Should return JSON array of photos
```

**If the backend is NOT running:**

1. Navigate to your project directory:
   ```bash
   cd /path/to/kcssc-website-production
   ```

2. Build the backend:
   ```bash
   npm run server:build
   ```

3. Start the backend server (using a process manager like PM2):
   ```bash
   # Install PM2 if not already installed
   npm install -g pm2
   
   # Start the server
   pm2 start npm --name "kcssc-backend" -- run server:start:prod
   
   # Save PM2 configuration
   pm2 save
   
   # Set PM2 to start on boot
   pm2 startup
   ```

4. Verify it's running:
   ```bash
   pm2 list
   curl http://localhost:3000/health
   ```

---

## Step 2: Locate Your Nginx Configuration

Find where your Nginx site configuration is located.

```bash
# Common locations:
ls /etc/nginx/sites-available/
ls /etc/nginx/sites-enabled/
ls /etc/nginx/conf.d/

# Or check the main nginx.conf
cat /etc/nginx/nginx.conf | grep include
```

**Note**: The configuration might be in:
- `/etc/nginx/sites-available/kcssc` or similar
- `/etc/nginx/sites-available/staging2.kcssc.org`
- `/etc/nginx/conf.d/kcssc.conf`
- Or directly in `/etc/nginx/nginx.conf`

---

## Step 3: Edit Nginx Configuration

### Option A: If you have a site-specific config file

1. Open the configuration file:
   ```bash
   sudo nano /etc/nginx/sites-available/kcssc
   # (or whatever your config file is named)
   ```

2. Look for the `server` block that handles `staging2.kcssc.org`

3. **Add the API proxy location block BEFORE the `location /` block:**

   ```nginx
   server {
       listen 443 ssl http2;
       server_name staging2.kcssc.org;
       
       # ... your SSL configuration ...
       
       # Root directory for static files
       root /path/to/kcssc-website-production/dist;
       index index.html;
       
       # ⭐ ADD THIS BLOCK - API Proxy (MUST come before location /)
       location /api/ {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Health check (optional)
       location /health {
           proxy_pass http://localhost:3000;
           proxy_set_header Host $host;
           access_log off;
       }
       
       # Serve static files (this comes AFTER /api/)
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

### Option B: If you need to create a new config file

1. Copy the example configuration:
   ```bash
   sudo cp /path/to/kcssc-website-production/nginx.conf.example /etc/nginx/sites-available/kcssc
   ```

2. Edit the file and update:
   - `root` path to your actual `dist` directory
   - SSL certificate paths
   - Server name if different

3. Enable the site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/kcssc /etc/nginx/sites-enabled/
   ```

---

## Step 4: Test Nginx Configuration

**CRITICAL**: Always test before reloading!

```bash
sudo nginx -t
```

You should see:
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If there are errors**, fix them before proceeding.

---

## Step 5: Reload Nginx

Once the configuration test passes:

```bash
sudo systemctl reload nginx
# or
sudo service nginx reload
```

---

## Step 6: Verify It Works

### Test 1: Direct API endpoint

```bash
curl https://staging2.kcssc.org/api/photos
```

**Expected**: JSON array of photos (not HTML)

**If you still get HTML 404**:
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify backend is running: `curl http://localhost:3000/api/photos`
- Check the location block order (API must come before `/`)

### Test 2: Health endpoint

```bash
curl https://staging2.kcssc.org/health
```

**Expected**: `{"status":"ok","timestamp":"..."}`

### Test 3: Browser test

1. Open https://staging2.kcssc.org in your browser
2. Open Developer Tools (F12) → Network tab
3. Look for requests to `/api/photos` or `/api/events`
4. They should return:
   - Status: 200
   - Content-Type: application/json
   - Response: JSON data (not HTML)

---

## Step 7: Check Logs (If Issues Persist)

### Nginx Error Logs

```bash
sudo tail -f /var/log/nginx/error.log
```

### Backend Server Logs

If using PM2:
```bash
pm2 logs kcssc-backend
```

Or check the server console output.

---

## Common Issues & Solutions

### Issue: "502 Bad Gateway

**Cause**: Backend server not running or not accessible

**Solution**:
```bash
# Check if backend is running
curl http://localhost:3000/health

# If not running, start it
pm2 start kcssc-backend
# or
npm run server:start:prod
```

### Issue: Still getting 404 HTML

**Cause**: Location block order or proxy_pass URL incorrect

**Solution**:
- Ensure `location /api/` comes **before** `location /`
- Verify `proxy_pass http://localhost:3000;` (no trailing slash)
- Check backend is actually on port 3000

### Issue: CORS errors in browser

**Cause**: Backend CORS configuration

**Solution**: The backend already has CORS enabled. If issues persist, check:
- `proxy_set_header Host $host;` is set in Nginx
- Backend `cors()` middleware is configured

### Issue: Port 3000 already in use

**Solution**:
```bash
# Find what's using port 3000
lsof -ti:3000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Or use a different port by setting PORT in .env
```

---

## Quick Reference: Complete Nginx Location Block

```nginx
# API Proxy - MUST come before location /
location /api/ {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    
    # Optional: Increase timeouts
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;
}
```

---

## Summary Checklist

- [ ] Backend server is running on port 3000
- [ ] Backend responds to `curl http://localhost:3000/api/photos`
- [ ] Located Nginx configuration file
- [ ] Added `/api/` location block BEFORE `location /`
- [ ] Tested Nginx config: `sudo nginx -t`
- [ ] Reloaded Nginx: `sudo systemctl reload nginx`
- [ ] Verified API works: `curl https://staging2.kcssc.org/api/photos`
- [ ] Tested in browser - no 404 errors in console

---

## Need Help?

If you're still having issues:

1. Check Nginx error logs: `sudo tail -50 /var/log/nginx/error.log`
2. Check backend logs: `pm2 logs` or server console
3. Verify backend is accessible: `curl http://localhost:3000/health`
4. Test Nginx config: `sudo nginx -t`

The key is ensuring:
- Backend is running and accessible on localhost:3000
- Nginx proxies `/api/*` to the backend
- The `/api/` location block comes before the catch-all `/` block

