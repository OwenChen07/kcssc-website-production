# Supabase Client Migration Guide

This guide explains how to migrate from the server-based API to using Supabase client directly from the frontend.

## Overview

We've migrated from a Node.js/Express server to using Supabase's JavaScript client library directly from the frontend. This eliminates the need for a separate backend server and allows you to deploy your site as a static site.

## What Changed

1. **API Service**: `src/lib/api-service.ts` now uses Supabase client instead of fetch calls to a backend API
2. **File Uploads**: Photos are now uploaded to Supabase Storage instead of local file system
3. **New Configuration**: Added `src/lib/supabase-client.ts` for Supabase client setup
4. **No Server Required**: You can now deploy as a static site (Vercel, Netlify, etc.)

## Setup Steps

### 1. Get Your Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (this is your `VITE_SUPABASE_URL`)
   - **anon/public key** (this is your `VITE_SUPABASE_ANON_KEY`)

### 2. Configure Environment Variables

Create or update your `.env` file (or set these in your deployment platform):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Set to 'false' to disable mock data fallback
VITE_USE_MOCK_DATA=false
```

**Important**: 
- The `anon` key is safe to expose in your frontend code (it's designed for this)
- Never expose the `service_role` key in your frontend code

### 3. Set Up Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **New bucket**
3. Name it: `photos`
4. Make it **Public** (so photos can be accessed via URL)
5. Click **Create bucket**

### 4. Set Up Row Level Security (RLS) Policies

1. In Supabase Dashboard, go to **SQL Editor**
2. Open `server/db/rls-policies.sql`
3. Copy and paste the SQL into the editor
4. Click **Run** to execute

**Important**: The default policies allow full public access (read/write/delete). For production, you should:
- Implement proper authentication using Supabase Auth
- Restrict write/delete operations to authenticated admin users
- Use more restrictive storage policies

### 5. Set Up Storage Policies

1. In Supabase Dashboard, go to **Storage** → **Policies**
2. Select the `photos` bucket
3. Click **New Policy**
4. Run the storage policy SQL from `server/db/rls-policies.sql` in the SQL Editor, or create policies manually:
   - **Read**: Allow public read access
   - **Upload**: Allow public upload (or restrict to authenticated users)
   - **Delete**: Allow public delete (or restrict to authenticated users)

### 6. Verify Your Database Schema

Make sure your Supabase database has the correct tables. If you haven't already:

1. Go to **SQL Editor** in Supabase Dashboard
2. Run `server/db/schema.sql` to create the tables
3. (Optional) Run `server/db/seed.sql` to add sample data

### 7. Test Locally

1. Install dependencies (if you haven't):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Test the application:
   - View events and programs (should load from Supabase)
   - Try creating/editing/deleting events in admin panel
   - Try uploading photos

## Deployment

Since you no longer need a server, you can deploy as a static site:

### Vercel

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_USE_MOCK_DATA=false`
3. Deploy

### Netlify

1. Connect your repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

### Other Static Hosts

Any static hosting service will work (GitHub Pages, Cloudflare Pages, etc.). Just make sure to:
- Set the environment variables
- Build the project with `npm run build`
- Serve the `dist` directory

## Removing the Server (Optional)

If you're completely migrating away from the server:

1. You can delete the `server/` directory (optional - keep it if you want to reference it)
2. Remove server-related scripts from `package.json`:
   - `server:dev`
   - `server:start`
   - `server:build`
   - `server:start:prod`
3. Remove server dependencies (optional):
   - `express`
   - `cors`
   - `pg`
   - `dotenv`
   - `multer`
   - `@types/express`
   - `@types/cors`
   - `@types/pg`
   - `@types/multer`

## Security Considerations

### Current Setup

The current implementation uses:
- **Public RLS policies**: Anyone can read/write/delete data
- **Public storage**: Anyone can upload/delete photos
- **Simple admin auth**: Uses localStorage (not secure, but works for small sites)

### Production Recommendations

For a production site, consider:

1. **Implement Supabase Auth**: Use Supabase's built-in authentication system
2. **Restrict Write Operations**: Only allow authenticated admin users to create/update/delete
3. **Use Service Role for Admin**: Create serverless functions (Vercel Functions, Netlify Functions) that use the service_role key for admin operations
4. **Storage Policies**: Restrict uploads to authenticated users only
5. **Rate Limiting**: Consider adding rate limiting for public operations

### Example: Secure Admin Operations

If you want to secure admin operations while keeping public read access:

1. Keep public read policies for events/programs/photos
2. Remove public write/delete policies
3. Create serverless functions (Vercel Functions, Netlify Functions) that:
   - Use the service_role key (never expose this in frontend)
   - Handle admin authentication
   - Perform write/delete operations

## Troubleshooting

### Photos not uploading

- Check that the `photos` bucket exists in Supabase Storage
- Verify storage policies allow uploads
- Check browser console for errors
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set correctly

### Data not loading

- Check browser console for errors
- Verify your Supabase project URL and anon key are correct
- Check that RLS policies are set up correctly
- Verify tables exist in your Supabase database

### CORS errors

- Supabase handles CORS automatically, so you shouldn't see CORS errors
- If you do, check your Supabase project settings

### RLS Policy errors

- Make sure you've run the RLS policies SQL
- Check the Supabase logs in the dashboard for specific errors
- Verify policies are enabled on your tables

## Benefits of This Approach

1. **Simpler Deployment**: No need to manage a server
2. **Lower Cost**: Static hosting is cheaper (often free)
3. **Better Performance**: CDN distribution for static assets
4. **Easier Scaling**: Static sites scale automatically
5. **Real-time Capabilities**: Supabase supports real-time subscriptions (future enhancement)

## Migration Checklist

- [ ] Get Supabase credentials (URL and anon key)
- [ ] Set environment variables
- [ ] Create storage bucket named `photos`
- [ ] Run RLS policies SQL
- [ ] Set up storage policies
- [ ] Test locally
- [ ] Deploy to production
- [ ] Test in production
- [ ] (Optional) Remove server code

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- Check your Supabase project logs in the dashboard

