# How to Find Your Deployment and SSL Paths

This guide helps you determine the correct paths for your Nginx configuration.

---

## Finding Your Deployment Path

The deployment path is where your built frontend files (`dist` directory) are located on the production server.

### Method 1: Check Current Nginx Configuration

If Nginx is already serving your site, the path is likely already configured:

```bash
# Find your Nginx config file
sudo grep -r "staging2.kcssc.org" /etc/nginx/

# Or check all site configs
sudo grep -r "root" /etc/nginx/sites-available/
sudo grep -r "root" /etc/nginx/conf.d/
```

Look for a line like:
```nginx
root /var/www/kcssc/dist;
```

### Method 2: Find Where Your Project is Deployed

```bash
# Common deployment locations
ls -la /var/www/
ls -la /home/*/kcssc-website-production/
ls -la ~/kcssc-website-production/

# Or search for the dist directory
find / -name "dist" -type d 2>/dev/null | grep -i kcssc
find /var/www -name "index.html" 2>/dev/null
```

### Method 3: Check Your Deployment Process

If you use a deployment script or CI/CD, check:
- Where the build output goes
- Your deployment documentation
- Your `.gitignore` or deployment config files

### Method 4: Check Nginx Error Logs

The error logs might show where Nginx is looking for files:

```bash
sudo tail -50 /var/log/nginx/error.log
```

Look for "No such file or directory" errors that mention a path.

### Method 5: Check Your Current Working Directory

If you're logged into the server and in your project directory:

```bash
pwd
# This shows your current directory

# Check if dist exists here
ls -la dist/
```

---

## Finding Your SSL Certificate Paths

### Method 1: Check Current Nginx Configuration

If SSL is already working, the paths are in your config:

```bash
# Find SSL certificate paths in existing config
sudo grep -r "ssl_certificate" /etc/nginx/

# This will show lines like:
# ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
# ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
```

### Method 2: Check Let's Encrypt (Most Common)

If you used Certbot/Let's Encrypt:

```bash
# List all Let's Encrypt certificates
sudo ls -la /etc/letsencrypt/live/

# Check for your domain
sudo ls -la /etc/letsencrypt/live/staging2.kcssc.org/
sudo ls -la /etc/letsencrypt/live/kcssc.org/

# Verify the files exist
sudo ls -la /etc/letsencrypt/live/*/fullchain.pem
sudo ls -la /etc/letsencrypt/live/*/privkey.pem
```

**Common Let's Encrypt paths:**
- Certificate: `/etc/letsencrypt/live/staging2.kcssc.org/fullchain.pem`
- Private Key: `/etc/letsencrypt/live/staging2.kcssc.org/privkey.pem`

### Method 3: Check Certbot History

```bash
# Check Certbot certificates
sudo certbot certificates

# This will show:
# Certificate Name: staging2.kcssc.org
# Domains: staging2.kcssc.org
# Certificate Path: /etc/letsencrypt/live/staging2.kcssc.org/fullchain.pem
# Private Key Path: /etc/letsencrypt/live/staging2.kcssc.org/privkey.pem
```

### Method 4: Check Apache (If You Migrated from Apache)

If you previously used Apache:

```bash
# Apache SSL config locations
sudo grep -r "SSLCertificateFile" /etc/apache2/
sudo grep -r "SSLCertificateKeyFile" /etc/apache2/
```

### Method 5: Check Other Common SSL Locations

```bash
# Self-signed or custom certificates
ls -la /etc/ssl/certs/
ls -la /etc/ssl/private/
ls -la /etc/nginx/ssl/

# Or search for .pem files
find /etc -name "*.pem" -type f 2>/dev/null | grep -i kcssc
find /etc -name "*.crt" -type f 2>/dev/null | grep -i kcssc
```

### Method 6: Check Your Domain's SSL Certificate

If you're not sure where certificates are:

```bash
# Test the current SSL connection
openssl s_client -connect staging2.kcssc.org:443 -servername staging2.kcssc.org

# Or use curl to check certificate
curl -vI https://staging2.kcssc.org 2>&1 | grep -i certificate
```

---

## Quick Commands to Run

Run these commands on your production server to find everything at once:

```bash
echo "=== Current Nginx Root Path ==="
sudo grep -r "root" /etc/nginx/sites-enabled/ | grep -v "#"

echo ""
echo "=== Current SSL Certificate Paths ==="
sudo grep -r "ssl_certificate" /etc/nginx/sites-enabled/ | grep -v "#"

echo ""
echo "=== Let's Encrypt Certificates ==="
sudo ls -la /etc/letsencrypt/live/ 2>/dev/null || echo "No Let's Encrypt directory"

echo ""
echo "=== Certbot Certificates ==="
sudo certbot certificates 2>/dev/null || echo "Certbot not installed or no certificates"

echo ""
echo "=== Common Deployment Locations ==="
ls -ld /var/www/*/dist 2>/dev/null
ls -ld /home/*/kcssc*/dist 2>/dev/null
```

---

## Example: What You're Looking For

After running the commands above, you should find something like:

### Deployment Path Example:
```nginx
root /var/www/kcssc-website-production/dist;
# or
root /home/username/kcssc-website-production/dist;
```

### SSL Certificate Paths Example:
```nginx
ssl_certificate /etc/letsencrypt/live/staging2.kcssc.org/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/staging2.kcssc.org/privkey.pem;
```

---

## If You Don't Have SSL Certificates Yet

If SSL isn't set up yet, you'll need to obtain certificates:

### Option 1: Let's Encrypt (Free, Recommended)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificate (Certbot will automatically configure Nginx)
sudo certbot --nginx -d staging2.kcssc.org

# Or for multiple domains
sudo certbot --nginx -d staging2.kcssc.org -d kcssc.org
```

Certbot will automatically:
- Obtain the certificate
- Configure Nginx with the correct paths
- Set up auto-renewal

### Option 2: Manual Certificate Installation

If you have certificates from another source:
1. Place them in a secure location (e.g., `/etc/nginx/ssl/`)
2. Update the paths in your Nginx config
3. Set proper permissions:
   ```bash
   sudo chmod 600 /etc/nginx/ssl/private.key
   sudo chmod 644 /etc/nginx/ssl/certificate.crt
   ```

---

## Verify Paths Are Correct

After updating your Nginx configuration:

```bash
# Test Nginx configuration
sudo nginx -t

# If successful, check that files exist
sudo test -f /path/to/dist/index.html && echo "✓ Frontend files exist"
sudo test -f /path/to/ssl/cert.pem && echo "✓ SSL certificate exists"
sudo test -f /path/to/ssl/key.pem && echo "✓ SSL key exists"
```

---

## Common Path Patterns

### Deployment Paths (Most Common):
- `/var/www/kcssc/dist`
- `/var/www/html/dist`
- `/home/username/kcssc-website-production/dist`
- `/opt/kcssc/dist`
- `/usr/share/nginx/html/dist`

### SSL Certificate Paths (Most Common):
- **Let's Encrypt**: `/etc/letsencrypt/live/domain.com/fullchain.pem`
- **Custom**: `/etc/nginx/ssl/domain.crt`
- **System**: `/etc/ssl/certs/domain.crt`

---

## Still Can't Find It?

If you can't locate the paths:

1. **Check your deployment documentation** or scripts
2. **Ask your hosting provider** if using managed hosting
3. **Check your CI/CD pipeline** configuration (GitHub Actions, GitLab CI, etc.)
4. **Look at your server setup scripts** or deployment automation

Once you find the paths, update them in `nginx.conf.example` and copy it to your Nginx configuration directory.


