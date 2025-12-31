# Supabase Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click **"New Project"**
3. Fill in:
   - **Name**: `kcssc-website`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** and wait 2-3 minutes

### Step 2: Get Connection String

1. In Supabase dashboard → **Settings** (gear icon) → **Database**
2. Scroll to **"Connection string"** section
3. Find **"URI"** tab
4. Copy the connection string (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual password

### Step 3: Update Your .env File

Add this to your `.env` file:

```env
# Supabase Connection (Option 1 - Recommended)
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
DB_SSL=true

# OR use individual settings (Option 2)
# DB_HOST=db.xxxxx.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=YOUR_PASSWORD
# DB_SSL=true
```

**Important**: Replace:
- `YOUR_PASSWORD` with your Supabase database password
- `xxxxx` with your actual Supabase project ID

### Step 4: Create Database Tables

1. In Supabase dashboard → **SQL Editor** (in sidebar)
2. Click **"New query"**
3. Open `server/db/schema.sql` from your project
4. Copy all the SQL code
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Cmd/Ctrl + Enter)
7. You should see "Success. No rows returned"

### Step 5: (Optional) Add Sample Data

1. Still in SQL Editor
2. Open `server/db/seed.sql` from your project
3. Copy and paste into SQL Editor
4. Click **"Run"**

### Step 6: Test Connection

1. Restart your backend server:
   ```bash
   npm run server:dev
   ```

2. You should see:
   ```
   ✅ Database connection verified
   🚀 Server running on http://localhost:3000
   ```

3. Test the API:
   ```bash
   curl http://localhost:3000/api/events
   ```

## ✅ You're Done!

Your app is now connected to Supabase. You can:
- View/edit data in Supabase **Table Editor**
- Use your admin panel to manage events/programs
- Deploy to production using the same connection string

## 🔒 Security Notes

- **Never commit** your `.env` file to git
- The connection string contains your password - keep it secret!
- For production, set environment variables in your hosting platform

## 🆘 Troubleshooting

**Connection fails?**
- Check password is correct (no quotes in .env)
- Verify `DB_SSL=true` is set
- Make sure you replaced `[YOUR-PASSWORD]` in the connection string

**Tables not found?**
- Make sure you ran `schema.sql` in Supabase SQL Editor
- Check Supabase Table Editor to verify tables exist

**Still having issues?**
- Check Supabase project logs in dashboard
- Verify your IP isn't blocked (unlikely with Supabase)
- See full guide in `SUPABASE_SETUP.md`

