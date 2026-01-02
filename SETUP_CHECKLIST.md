# Setup Checklist

Use this checklist to set up your KCSSC website with Supabase.

## ✅ Prerequisites

- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Git repository cloned

## ✅ Supabase Setup

- [ ] Created Supabase account at [supabase.com](https://supabase.com)
- [ ] Created new project in Supabase
- [ ] Saved database password securely
- [ ] Copied Project URL from Settings → API
- [ ] Copied anon/public key from Settings → API

## ✅ Local Configuration

- [ ] Created `.env` file in project root
- [ ] Added `VITE_SUPABASE_URL` to `.env`
- [ ] Added `VITE_SUPABASE_ANON_KEY` to `.env`
- [ ] Set `VITE_USE_MOCK_DATA=false` in `.env`
- [ ] Verified `.env` file is in `.gitignore`

## ✅ Database Setup

- [ ] Opened Supabase SQL Editor
- [ ] Ran `server/db/schema.sql` to create tables
- [ ] Verified tables exist in Table Editor
- [ ] Ran `server/db/rls-policies.sql` to set up RLS
- [ ] Verified policies are enabled

## ✅ Storage Setup

- [ ] Created `photos` storage bucket in Supabase
- [ ] Made `photos` bucket public
- [ ] Created storage policy for public read
- [ ] Created storage policy for public upload
- [ ] Created storage policy for public delete

## ✅ Testing

- [ ] Ran `npm install`
- [ ] Ran `npm run build` (builds successfully)
- [ ] Ran `npm run dev`
- [ ] Opened http://localhost:8080
- [ ] Verified events/programs load from Supabase
- [ ] Tested admin login
- [ ] Created a test event
- [ ] Edited a test event
- [ ] Deleted a test event
- [ ] Uploaded a test photo
- [ ] Verified photo appears in gallery

## ✅ Deployment Preparation

- [ ] Chose deployment platform (Vercel, Netlify, etc.)
- [ ] Connected GitHub repository
- [ ] Added `VITE_SUPABASE_URL` as environment variable
- [ ] Added `VITE_SUPABASE_ANON_KEY` as environment variable
- [ ] Set `VITE_USE_MOCK_DATA=false` as environment variable
- [ ] Configured build command: `npm run build`
- [ ] Configured publish directory: `dist`
- [ ] Deployed to production
- [ ] Tested production deployment

## ✅ Post-Deployment

- [ ] Verified production site loads correctly
- [ ] Tested all features in production
- [ ] Verified photos upload correctly
- [ ] Checked browser console for errors
- [ ] Reviewed Supabase dashboard logs

## Notes

- The anon key is safe to expose in frontend code
- Never expose the service_role key
- Consider implementing proper authentication for production
- Review security recommendations in `SUPABASE_CLIENT_MIGRATION.md`

