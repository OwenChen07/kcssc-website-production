# Supabase Setup Wizard

Follow these steps to configure Supabase for your KCSSC website.

## Step 1: Create Supabase Account & Project (5 minutes)

1. **Go to Supabase**: Open [https://supabase.com](https://supabase.com)
2. **Sign up/Login**: Click "Start your project" or sign in
3. **Create New Project**:
   - Click "New Project"
   - **Name**: `kcssc-website` (or your preferred name)
   - **Database Password**: Create a strong password (save this - you'll need it!)
   - **Region**: Choose closest to you (e.g., "US East" for North America)
   - **Pricing Plan**: Free tier is fine to start
4. **Click "Create new project"** and wait 2-3 minutes

## Step 2: Get Your API Credentials (2 minutes)

Once your project is created:

1. In the Supabase dashboard, click **Settings** (gear icon in sidebar)
2. Click **API** in the settings menu
3. Find these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (a long JWT token)
4. **Copy both values** - you'll need them in the next step

## Step 3: Configure Environment Variables

I'll help you create/update your `.env` file with these credentials.

**What you need:**
- Your Project URL from Step 2
- Your anon key from Step 2

## Step 4: Set Up Database Tables (3 minutes)

1. In Supabase dashboard, click **SQL Editor** (in sidebar)
2. Click **"New query"**
3. Copy the contents of `server/db/schema.sql` from your project
4. Paste into the SQL Editor
5. Click **"Run"** (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned"

## Step 5: Set Up Row Level Security (2 minutes)

1. Still in **SQL Editor**, click **"New query"**
2. Copy the contents of `server/db/rls-policies.sql` from your project
3. Paste into the SQL Editor
4. Click **"Run"**

## Step 6: Create Storage Bucket (2 minutes)

1. In Supabase dashboard, click **Storage** (in sidebar)
2. Click **"New bucket"**
3. Name: `photos`
4. Make it **Public** (toggle ON)
5. Click **"Create bucket"**

## Step 7: Set Up Storage Policies (3 minutes)

1. In **Storage** → **Policies**, click on the `photos` bucket
2. Click **"New Policy"**
3. Select **"For full customization"**
4. Copy and paste this SQL for **Read access**:

```sql
CREATE POLICY "Allow public read access to photos bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'photos');
```

5. Click **"Review"** then **"Save policy"**
6. Repeat for **Upload** (INSERT) and **Delete** policies using the SQL from `server/db/rls-policies.sql`

## Step 8: Test It! (1 minute)

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:8080
3. The Supabase warning should be gone!
4. Try creating an event in the admin panel

---

**Ready to start?** Do Steps 1-2 first, then come back and I'll help you configure the `.env` file with your credentials!

