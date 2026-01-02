# Next Steps: Complete Supabase Setup

Your `.env` file has been configured with your Supabase credentials! ✅

Now you need to complete the database and storage setup in your Supabase dashboard.

## ✅ What's Done

- [x] Supabase credentials added to `.env` file
- [x] `VITE_USE_MOCK_DATA=false` configured

## 📋 What You Need to Do Next

### Step 1: Set Up Database Tables (3 minutes)

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/xsxgnoxtmbxxifkwacrv
2. Click **SQL Editor** in the sidebar
3. Click **"New query"**
4. Open `server/db/schema.sql` from this project
5. Copy ALL the SQL code
6. Paste into the Supabase SQL Editor
7. Click **"Run"** (or press Cmd/Ctrl + Enter)
8. You should see "Success. No rows returned"

### Step 2: Set Up Row Level Security (2 minutes)

1. Still in **SQL Editor**, click **"New query"**
2. Open `server/db/rls-policies.sql` from this project
3. Copy ALL the SQL code
4. Paste into the Supabase SQL Editor
5. Click **"Run"**

### Step 3: Create Storage Bucket (2 minutes)

1. In Supabase dashboard, click **Storage** (in sidebar)
2. Click **"New bucket"**
3. Name: `photos` (must be exactly "photos")
4. Make it **Public** (toggle ON - very important!)
5. Click **"Create bucket"**

### Step 4: Set Up Storage Policies (5 minutes)

1. In **Storage** → **Policies**, click on the `photos` bucket
2. Click **"New Policy"**
3. Select **"For full customization"**
4. For **READ** access, paste this SQL:

```sql
CREATE POLICY "Allow public read access to photos bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'photos');
```

5. Click **"Review"** then **"Save policy"**

6. Repeat for **UPLOAD** (INSERT):
   - Click **"New Policy"** again
   - Select **"For full customization"**
   - Paste this SQL:

```sql
CREATE POLICY "Allow public upload to photos bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'photos');
```

7. Repeat for **DELETE**:
   - Click **"New Policy"** again
   - Select **"For full customization"**
   - Paste this SQL:

```sql
CREATE POLICY "Allow public delete from photos bucket"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'photos');
```

## 🧪 Test It!

1. Restart your dev server (if it's running):
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

2. Open http://localhost:8080
3. The Supabase warning should be **gone**!
4. Try these tests:
   - ✅ View events/programs (should load from Supabase)
   - ✅ Login to admin panel
   - ✅ Create a test event
   - ✅ Upload a test photo

## 🎉 You're Done!

Once you complete the steps above, your website will be fully connected to Supabase!

**Quick Links:**
- Your Supabase Dashboard: https://supabase.com/dashboard/project/xsxgnoxtmbxxifkwacrv
- SQL Editor: https://supabase.com/dashboard/project/xsxgnoxtmbxxifkwacrv/sql
- Storage: https://supabase.com/dashboard/project/xsxgnoxtmbxxifkwacrv/storage

Need help? Check `SETUP_SUPABASE.md` for detailed instructions.

