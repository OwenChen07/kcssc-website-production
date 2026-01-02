# Production API 404 Fix - Quick Reference

## Problem
API requests to `/api/photos` and `/api/events` return HTML 404 pages instead of JSON in production.

## Root Cause
Nginx is serving the frontend static files but not proxying `/api/*` requests to the backend Express server.

## Solution

Add this location block to your Nginx configuration **before** the `location /` block:

```nginx
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
```

## Steps to Apply

1. **Edit your Nginx config:**
   ```bash
   sudo nano /etc/nginx/sites-available/kcssc
   # (or wherever your site config is)
   ```

2. **Add the `/api/` location block** (see example above)

3. **Ensure it comes BEFORE the `location /` block** - order matters in Nginx!

4. **Test the configuration:**
   ```bash
   sudo nginx -t
   ```

5. **Reload Nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

6. **Verify it works:**
   ```bash
   curl https://staging2.kcssc.org/api/photos
   # Should return JSON, not HTML
   ```

## Full Example Configuration

See `nginx.conf.example` for a complete Nginx configuration file.

## Important Notes

- The backend server must be running on `localhost:3000` (or update `proxy_pass` accordingly)
- The `/api/` location block must come **before** the catch-all `location /` block
- After making changes, always test with `nginx -t` before reloading

## Verification Checklist

- [ ] Backend is running: `curl http://localhost:3000/api/photos` returns JSON
- [ ] Nginx config tested: `sudo nginx -t` shows no errors
- [ ] Nginx reloaded: `sudo systemctl reload nginx`
- [ ] Production API works: `curl https://staging2.kcssc.org/api/photos` returns JSON
- [ ] Browser console shows no 404 errors for `/api/*` requests

