# Supabase Auth Setup Guide

This guide will help you set up Supabase Auth to replace the insecure password authentication.

## ✅ What's Changed

- ✅ Created `src/lib/auth-context.tsx` - Authentication context using Supabase Auth
- ✅ Updated `src/pages/admin/Login.tsx` - Now uses email/password authentication
- ✅ Updated `src/components/admin/ProtectedRoute.tsx` - Checks Supabase Auth session
- ✅ Updated `src/App.tsx` - Wrapped app with AuthProvider
- ✅ Updated all admin pages - Logout now uses Supabase Auth

## 🔐 Step 1: Enable Authentication in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/xsxgnoxtmbxxifkwacrv
2. Click **Authentication** in the sidebar
3. Click **Providers** in the Authentication submenu
4. Make sure **Email** provider is enabled (it should be enabled by default)
5. (Optional) Configure email templates if desired

## 👤 Step 2: Create Admin User

### Option A: Create User via Supabase Dashboard (Easiest)

1. In Supabase Dashboard → **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter:
   - **Email**: `admin@kcssc.ca` (or your preferred admin email)
   - **Password**: Create a strong password (save it!)
   - **Auto Confirm User**: ✅ Check this (so user doesn't need to verify email)
4. Click **"Create user"**

### Option B: Create User via SQL

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL (replace email and password):

```sql
-- Create admin user (password will be hashed automatically)
-- Note: You need to set the password manually via the dashboard or use Supabase Auth API
-- This SQL just creates the user, you'll need to set password via dashboard

-- Actually, it's easier to create via dashboard. Use Option A above.
```

**Recommended**: Use Option A (Dashboard) - it's simpler and ensures password is hashed correctly.

## 🔒 Step 3: Update RLS Policies (Important!)

Since we're now using Supabase Auth, you should update your RLS policies to require authentication for write operations.

1. Go to **SQL Editor** in Supabase Dashboard
2. Run this SQL to update policies:

```sql
-- Drop existing public write/delete policies
DROP POLICY IF EXISTS "Allow public insert to events" ON events;
DROP POLICY IF EXISTS "Allow public update to events" ON events;
DROP POLICY IF EXISTS "Allow public delete to events" ON events;

DROP POLICY IF EXISTS "Allow public insert to programs" ON programs;
DROP POLICY IF EXISTS "Allow public update to programs" ON programs;
DROP POLICY IF EXISTS "Allow public delete to programs" ON programs;

DROP POLICY IF EXISTS "Allow public insert to photos" ON photos;
DROP POLICY IF EXISTS "Allow public update to photos" ON photos;
DROP POLICY IF EXISTS "Allow public delete to photos" ON photos;

-- Create authenticated-only policies for writes
CREATE POLICY "Allow authenticated users to insert events"
  ON events
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update events"
  ON events
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete events"
  ON events
  FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert programs"
  ON programs
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update programs"
  ON programs
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete programs"
  ON programs
  FOR DELETE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert photos"
  ON photos
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update photos"
  ON photos
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete photos"
  ON photos
  FOR DELETE
  USING (auth.role() = 'authenticated');
```

**Note**: Public read access remains - anyone can view events/programs/photos, but only authenticated users can create/edit/delete.

## 📝 Step 4: Update Storage Policies (If Using Photo Uploads)

Update storage policies to require authentication:

1. Go to **Storage** → **Policies** → `photos` bucket
2. Update policies to require authentication:

```sql
-- Drop existing public policies
DROP POLICY IF EXISTS "Allow public upload to photos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from photos bucket" ON storage.objects;

-- Create authenticated-only policies
CREATE POLICY "Allow authenticated users to upload to photos bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'photos' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Allow authenticated users to delete from photos bucket"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'photos' AND
    auth.role() = 'authenticated'
  );
```

## 🧪 Step 5: Test It!

1. **Restart your dev server** (if running):
   ```bash
   npm run dev
   ```

2. **Go to admin login**: http://localhost:8080/admin/login

3. **Login with your credentials**:
   - Email: The email you created in Step 2
   - Password: The password you set

4. **Verify**:
   - ✅ Login works
   - ✅ You can access admin pages
   - ✅ Logout works
   - ✅ Creating/editing events works
   - ✅ Photo uploads work

## 🔐 Security Improvements

**Before (Insecure)**:
- ❌ Password visible in JavaScript bundle
- ❌ Client-side password check
- ❌ No password hashing
- ❌ Easy to bypass

**After (Secure)**:
- ✅ Password never in client code
- ✅ Server-side authentication
- ✅ Password hashing (Supabase handles it)
- ✅ JWT token-based sessions
- ✅ Secure session management

## 📋 Summary

1. ✅ Code updated to use Supabase Auth
2. ✅ Create admin user in Supabase Dashboard
3. ✅ Update RLS policies (run SQL in Step 3)
4. ✅ Update storage policies (run SQL in Step 4)
5. ✅ Test login/logout
6. ✅ Remove `VITE_ADMIN_PASSWORD` from `.env` (no longer needed!)

## 🎉 You're Done!

Your authentication is now secure! The password is no longer visible in the code, and all authentication is handled securely by Supabase.

## 🔄 Migration from Old System

If you were using the old password system:
- Old password: `VITE_ADMIN_PASSWORD` from `.env` (can be removed)
- New system: Email/password in Supabase Auth
- Old sessions: Will be invalid (users need to login again)

## 🆘 Troubleshooting

### "Invalid login credentials"
- Check that the user exists in Supabase Dashboard → Authentication → Users
- Verify email and password are correct
- Make sure "Auto Confirm User" was checked when creating the user

### "Policy violation" errors
- Make sure you ran the RLS policy updates from Step 3
- Check that policies are enabled in Supabase Dashboard → Authentication → Policies

### Session not persisting
- Check browser console for errors
- Clear browser cache and try again
- Verify Supabase Auth is enabled in your project

### Still seeing old login screen
- Clear browser cache
- Restart dev server
- Check that `src/pages/admin/Login.tsx` was updated

