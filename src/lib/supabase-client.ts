// Supabase client configuration
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

// Only create client if both URL and key are provided and non-empty
const hasConfig = !!supabaseUrl && !!supabaseAnonKey;

if (!hasConfig) {
  console.warn(
    '⚠️  Supabase environment variables not set. The app will use mock data.\n' +
    '   Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to use Supabase.'
  );
}

// Create Supabase client with auth enabled
// If not configured, use a valid placeholder that passes validation (won't be used since SUPABASE_ENABLED will be false)
export const supabase: SupabaseClient = hasConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true, // Enable session persistence for Supabase Auth
        autoRefreshToken: true, // Auto-refresh tokens
        detectSessionInUrl: true, // Detect auth callback in URL
      },
    })
  : createClient(
      'https://xxxxxxxxxxxxxxxxxxxxx.supabase.co', // Valid format placeholder (won't be used)
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0', // Valid JWT format placeholder
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      }
    );

// Database table names
export const TABLES = {
  EVENTS: 'events',
  PROGRAMS: 'programs',
  PHOTOS: 'photos',
} as const;

// Storage bucket name for photos
export const STORAGE_BUCKET = 'photos';

