# Supabase Connection Troubleshooting

## Error: "getaddrinfo ENOTFOUND" or "Cannot resolve hostname"

This means your computer can't find the Supabase database server. Here's how to fix it:

### Step 1: Verify Your Supabase Project is Ready

1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Check your project status - it should show "Active" (not "Setting up")
3. If it's still setting up, wait 2-3 more minutes

### Step 2: Get the Correct Connection String

1. In Supabase dashboard → **Settings** (gear icon) → **Database**
2. Scroll to **"Connection string"** section
3. Make sure you're looking at the **"URI"** tab (not "Session mode" or "Transaction")
4. The connection string should look like:
   ```
   postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
   OR
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 3: Check Your Connection String Format

Your connection string should be in this format:
```
postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres
```

**Common issues:**
- ❌ Missing `postgresql://` prefix
- ❌ Wrong hostname format
- ❌ Password not replaced (still has `[YOUR-PASSWORD]`)
- ❌ Extra spaces or quotes

### Step 4: Verify Hostname

The hostname should be one of these formats:
- `db.[project-ref].supabase.co` (direct connection)
- `aws-0-[region].pooler.supabase.com` (connection pooler)

To find your project reference:
1. Supabase dashboard → Settings → General
2. Look for "Reference ID" - this is your project ref

### Step 5: Test Connection from Supabase Dashboard

1. In Supabase dashboard → **SQL Editor**
2. Try running: `SELECT NOW();`
3. If this works, your database is ready - the issue is with the connection string

### Step 6: Alternative - Use Connection Pooler

Supabase offers a connection pooler that might work better:

1. In Settings → Database → Connection string
2. Look for **"Connection pooling"** section
3. Use the **"Session"** or **"Transaction"** mode connection string
4. These use port `6543` instead of `5432`

### Step 7: Update Your .env

Make sure your `.env` has:

```env
# Option 1: Direct connection (port 5432)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres?sslmode=require

# Option 2: Connection pooler (port 6543) - often more reliable
DATABASE_URL=postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres?sslmode=require

DB_SSL=true
```

**Important:**
- Replace `YOUR_PASSWORD` with your actual password
- Replace `PROJECT_REF` with your actual project reference ID
- No quotes around the connection string
- Make sure `?sslmode=require` is at the end

### Step 8: Test Network Connectivity

Try these commands to test:

```bash
# Test DNS resolution
nslookup db.xsxgnoxtmbxxifkwacrv.supabase.co

# Test connection
curl -v telnet://db.xsxgnoxtmbxxifkwacrv.supabase.co:5432
```

### Step 9: Check Firewall/Network

- Make sure you're not behind a corporate firewall blocking Supabase
- Try from a different network (mobile hotspot)
- Check if your ISP is blocking the connection

### Step 10: Verify Project Status

In Supabase dashboard:
1. Check if project shows any errors
2. Look at "Project Settings" → "Infrastructure" for status
3. If project is paused, you may need to resume it

## Still Not Working?

1. **Double-check the connection string** in Supabase dashboard
2. **Copy it fresh** - don't type it manually
3. **Try the connection pooler** instead of direct connection
4. **Check Supabase status page**: https://status.supabase.com
5. **Contact Supabase support** if project seems stuck

## Quick Test

Once you have the correct connection string, test it:

```bash
# Using psql (if installed)
psql "postgresql://postgres:PASSWORD@db.REF.supabase.co:5432/postgres?sslmode=require"

# Or test with Node.js
node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: 'YOUR_CONNECTION_STRING' }); pool.query('SELECT NOW()').then(r => console.log('Success:', r.rows[0])).catch(e => console.error('Error:', e.message));"
```

