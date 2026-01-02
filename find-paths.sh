#!/bin/bash
# Script to find deployment and SSL paths on production server
# Run this on your production server: bash find-paths.sh

echo "=========================================="
echo "Finding Deployment and SSL Paths"
echo "=========================================="
echo ""

echo "=== Current Nginx Root Path ==="
sudo grep -r "root" /etc/nginx/sites-enabled/ 2>/dev/null | grep -v "#" | head -5
echo ""

echo "=== Current SSL Certificate Paths ==="
sudo grep -r "ssl_certificate" /etc/nginx/sites-enabled/ 2>/dev/null | grep -v "#" | head -5
echo ""

echo "=== Let's Encrypt Certificates ==="
if [ -d "/etc/letsencrypt/live" ]; then
    sudo ls -la /etc/letsencrypt/live/ 2>/dev/null
    echo ""
    echo "Checking for staging2.kcssc.org:"
    if [ -d "/etc/letsencrypt/live/staging2.kcssc.org" ]; then
        echo "✓ Found: /etc/letsencrypt/live/staging2.kcssc.org/"
        sudo ls -la /etc/letsencrypt/live/staging2.kcssc.org/ 2>/dev/null
    else
        echo "✗ Not found, checking all domains:"
        sudo ls -la /etc/letsencrypt/live/ 2>/dev/null | grep -E "^d"
    fi
else
    echo "✗ Let's Encrypt directory not found"
fi
echo ""

echo "=== Certbot Certificates ==="
if command -v certbot &> /dev/null; then
    sudo certbot certificates 2>/dev/null || echo "No certificates found or certbot error"
else
    echo "✗ Certbot not installed"
fi
echo ""

echo "=== Common Deployment Locations ==="
echo "Checking /var/www:"
ls -ld /var/www/*/dist 2>/dev/null | head -5 || echo "  No dist directories found in /var/www"
echo ""
echo "Checking /home:"
ls -ld /home/*/kcssc*/dist 2>/dev/null | head -5 || echo "  No kcssc dist directories found in /home"
echo ""
echo "Checking current directory:"
if [ -d "dist" ]; then
    echo "  ✓ Found dist in: $(pwd)/dist"
    ls -ld dist/
else
    echo "  ✗ No dist directory in current location"
fi
echo ""

echo "=== Nginx Configuration Files ==="
echo "Sites available:"
ls -la /etc/nginx/sites-available/ 2>/dev/null | head -10 || echo "  Cannot access sites-available"
echo ""
echo "Sites enabled:"
ls -la /etc/nginx/sites-enabled/ 2>/dev/null | head -10 || echo "  Cannot access sites-enabled"
echo ""

echo "=== Summary ==="
echo ""
echo "To update nginx.conf.example, you need:"
echo "1. Root path (where dist/ directory is located)"
echo "2. SSL certificate path (fullchain.pem)"
echo "3. SSL private key path (privkey.pem)"
echo ""
echo "Look for the paths above and update nginx.conf.example accordingly."


