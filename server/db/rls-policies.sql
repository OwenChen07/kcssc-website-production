-- Row Level Security (RLS) Policies for Supabase
-- Run this in your Supabase SQL Editor after creating the tables

-- Enable RLS on all tables
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- ==================== Events Table Policies ====================

-- Allow anyone to read events (public access)
CREATE POLICY "Allow public read access to events"
  ON events
  FOR SELECT
  USING (true);

-- Allow authenticated users (or service role) to insert events
-- For admin operations, you can either:
-- 1. Use service_role key in a serverless function/edge function
-- 2. Implement Supabase Auth and check for admin role
-- 3. Use a simple approach: allow all inserts (NOT recommended for production)
-- 
-- For now, we'll allow all inserts. In production, you should restrict this.
CREATE POLICY "Allow public insert to events"
  ON events
  FOR INSERT
  WITH CHECK (true);

-- Allow authenticated users (or service role) to update events
CREATE POLICY "Allow public update to events"
  ON events
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (or service role) to delete events
CREATE POLICY "Allow public delete to events"
  ON events
  FOR DELETE
  USING (true);

-- ==================== Programs Table Policies ====================

-- Allow anyone to read programs (public access)
CREATE POLICY "Allow public read access to programs"
  ON programs
  FOR SELECT
  USING (true);

-- Allow public insert to programs
CREATE POLICY "Allow public insert to programs"
  ON programs
  FOR INSERT
  WITH CHECK (true);

-- Allow public update to programs
CREATE POLICY "Allow public update to programs"
  ON programs
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public delete to programs
CREATE POLICY "Allow public delete to programs"
  ON programs
  FOR DELETE
  USING (true);

-- ==================== Photos Table Policies ====================

-- Allow anyone to read photos (public access)
CREATE POLICY "Allow public read access to photos"
  ON photos
  FOR SELECT
  USING (true);

-- Allow public insert to photos
CREATE POLICY "Allow public insert to photos"
  ON photos
  FOR INSERT
  WITH CHECK (true);

-- Allow public update to photos
CREATE POLICY "Allow public update to photos"
  ON photos
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow public delete to photos
CREATE POLICY "Allow public delete to photos"
  ON photos
  FOR DELETE
  USING (true);

-- ==================== Storage Policies ====================

-- Note: Storage policies are managed in the Supabase Dashboard under Storage > Policies
-- You'll need to create a storage bucket named "photos" and set up policies there.

-- Example policy for storage (run in Supabase SQL Editor):
-- This allows anyone to read from the photos bucket
CREATE POLICY "Allow public read access to photos bucket"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'photos');

-- This allows anyone to upload to the photos bucket
-- In production, you should restrict this to authenticated users or use signed URLs
CREATE POLICY "Allow public upload to photos bucket"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'photos');

-- This allows anyone to delete from the photos bucket
-- In production, you should restrict this to authenticated users
CREATE POLICY "Allow public delete from photos bucket"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'photos');

-- ==================== Production Security Recommendations ====================

-- IMPORTANT: The policies above allow full public access (read/write/delete).
-- This is fine for development and small sites, but for production you should:

-- 1. Implement proper authentication using Supabase Auth
-- 2. Create a user role system (admin, user, etc.)
-- 3. Restrict write/delete operations to authenticated admin users only
-- 4. Use service_role key only in secure serverless functions, never in the frontend
-- 5. Set up proper storage policies that restrict uploads to authenticated users

-- Example of a more secure policy (requires Supabase Auth):
-- CREATE POLICY "Allow authenticated admins to insert events"
--   ON events
--   FOR INSERT
--   WITH CHECK (
--     auth.jwt() ->> 'role' = 'admin'
--   );

