# Supabase Setup Guide

This guide will walk you through setting up Supabase as your production database.

## Step 1: Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub, Google, or email
4. Verify your email if needed

## Step 2: Create a New Project

1. Once logged in, click **"New Project"**
2. Fill in the project details:
   - **Name**: `kcssc-website` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., `US East` for North America)
   - **Pricing Plan**: Free tier is fine to start
3. Click **"Create new project"**
4. Wait 2-3 minutes for the project to be created

## Step 3: Get Your Database Connection Details

1. In your Supabase project dashboard, go to **Settings** (gear icon in sidebar)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. You'll see different connection string formats. We need the **"URI"** format or individual settings

### Option A: Using Connection String (Recommended)

Copy the **"URI"** connection string. It looks like:
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
```

### Option B: Using Individual Settings

Note down these values:
- **Host**: `db.xxxxx.supabase.co`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `postgres`
- **Password**: (the one you created in Step 2)
- **SSL**: Required (set to `true`)

## Step 4: Update Your Environment Variables

### For Local Development (Optional - to test Supabase locally)

Update your `.env` file:

```env
# Database Configuration
DB_ENABLED=true
DB_HOST=db.xxxxx.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_SSL=true

# Or use connection string (alternative method)
# DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

### For Production Deployment

When deploying (Vercel, Netlify, Railway, etc.), add these as environment variables in your hosting platform's dashboard.

## Step 5: Initialize Database Tables

### Method 1: Using Supabase SQL Editor (Easiest)

1. In Supabase dashboard, go to **SQL Editor** (in the sidebar)
2. Click **"New query"**
3. Copy the contents of `server/db/schema.sql`
4. Paste into the SQL editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

### Method 2: Using psql Command Line

```bash
# Install psql if you don't have it
# macOS: brew install postgresql

# Connect to Supabase
psql "postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres?sslmode=require"

# Then run the schema
\i server/db/schema.sql
```

### Method 3: Using the Init Script

Update your `.env` with Supabase credentials, then:

```bash
npm run db:init
```

## Step 6: Seed Sample Data (Optional)

1. In Supabase SQL Editor
2. Copy contents of `server/db/seed.sql`
3. Paste and run

Or use the command:
```bash
npm run db:seed
```

## Step 7: Test the Connection

1. Make sure your backend server is running:
   ```bash
   npm run server:dev
   ```

2. Check the console output - you should see:
   ```
   ✅ Database connection verified
   ```

3. Test the API:
   ```bash
   curl http://localhost:3000/api/events
   ```

## Step 8: Deploy to Production

When deploying your backend:

1. **Set environment variables** in your hosting platform:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_SSL=true`
   - `PORT=3000` (or your platform's port)

2. **Update frontend** environment variables:
   - `VITE_API_BASE_URL=https://your-backend-url.com/api`
   - `VITE_USE_MOCK_DATA=false`

## Troubleshooting

### Connection Refused
- Check that your IP is allowed in Supabase (Settings → Database → Connection Pooling)
- Supabase allows connections from anywhere by default, but check firewall settings

### SSL Required Error
- Make sure `DB_SSL=true` in your `.env`
- Supabase requires SSL connections

### Authentication Failed
- Double-check your password (no quotes needed in .env)
- Verify the username is `postgres`
- Check that you're using the correct project's credentials

### Tables Not Found
- Make sure you ran the schema.sql in the Supabase SQL Editor
- Check the "Table Editor" in Supabase dashboard to verify tables exist

## Supabase Dashboard Features

Once set up, you can:
- **Table Editor**: View/edit data directly in the browser
- **SQL Editor**: Run custom queries
- **API**: Supabase also provides a REST API (optional, you're using your own)
- **Auth**: Built-in authentication (for future use)
- **Storage**: File storage (for images, etc.)

## Security Best Practices

1. **Never commit** your `.env` file to git
2. Use **environment variables** in production
3. **Rotate passwords** periodically
4. Use **connection pooling** for production (Supabase provides this)
5. Enable **Row Level Security** in Supabase for additional protection

## Next Steps

After setup:
1. Test creating events/programs through your admin panel
2. Verify data appears in Supabase Table Editor
3. Test the public-facing pages to ensure they load data correctly
4. Deploy your application!

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check your Supabase project logs in the dashboard

