# Quick Setup: Supabase Client

This is a quick reference for setting up Supabase with your KCSSC website.

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click **"New Project"**
3. Fill in:
   - **Name**: `kcssc-website`
   - **Database Password**: (save this password!)
   - **Region**: Choose closest to you
4. Click **"Create new project"** and wait 2-3 minutes

## Step 2: Get Your Credentials

1. In Supabase Dashboard → **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon public** key → This is your `VITE_SUPABASE_ANON_KEY`

## Step 3: Create Environment File

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_USE_MOCK_DATA=false
VITE_ADMIN_PASSWORD=kcsscadmin
```

Replace `your-project-ref` and `your-anon-key-here` with your actual values.

## Step 4: Set Up Database Tables

1. In Supabase Dashboard → **SQL Editor**
2. Open `server/db/schema.sql` from your project
3. Copy all the SQL code and paste into Supabase SQL Editor
4. Click **Run** (or press Cmd/Ctrl + Enter)
5. You should see "Success. No rows returned"

## Step 5: Set Up Row Level Security (RLS)

1. Still in **SQL Editor**
2. Open `server/db/rls-policies.sql` from your project
3. Copy all the SQL code and paste into Supabase SQL Editor
4. Click **Run**

**Note**: These policies allow public read/write access. For production, consider implementing proper authentication.

## Step 6: Create Storage Bucket

1. In Supabase Dashboard → **Storage**
2. Click **"New bucket"**
3. Name: `photos`
4. Make it **Public** (toggle ON)
5. Click **"Create bucket"**

## Step 7: Set Up Storage Policies

1. In Supabase Dashboard → **Storage** → **Policies**
2. Click on the `photos` bucket
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Copy and paste this SQL:

```sql
-- Allow public read
CREATE POLICY "Allow public read access to photos bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'photos');

-- Allow public upload
CREATE POLICY "Allow public upload to photos bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'photos');

-- Allow public delete
CREATE POLICY "Allow public delete from photos bucket"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'photos');
```

6. Click **"Review"** then **"Save policy"**
7. Repeat for all three policies (read, upload, delete)

## Step 8: Test Locally

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

**Note**: If you haven't set up the `.env` file yet, the app will automatically use mock data. You'll see a warning in the browser console, but the app will still work.

Visit http://localhost:8080 and test:
- ✅ View events/programs (should load from Supabase if configured, or mock data if not)
- ✅ Admin panel login
- ✅ Create/edit/delete events (requires Supabase configuration)
- ✅ Upload photos (requires Supabase configuration)

## Step 9: Deploy

Since you no longer need a server, deploy as a static site:

### Vercel
1. Connect your GitHub repo to Vercel
2. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_USE_MOCK_DATA=false`
3. Deploy!

### Netlify
1. Connect your GitHub repo to Netlify
2. Add environment variables in Site settings
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

## Troubleshooting

### "Failed to fetch events from Supabase"
- Check your `.env` file has correct values
- Verify Supabase URL and anon key in dashboard
- Check browser console for specific errors

### Photos not uploading
- Verify `photos` bucket exists and is public
- Check storage policies are set up
- Check browser console for errors

### RLS Policy errors
- Make sure you ran `rls-policies.sql` in SQL Editor
- Check Supabase logs in dashboard

## What's Next?

- ✅ Your site now runs without a server!
- ✅ Deploy as a static site to Vercel, Netlify, etc.
- ✅ All data is stored in Supabase
- ✅ Photos are stored in Supabase Storage

For more details, see `SUPABASE_CLIENT_MIGRATION.md`

