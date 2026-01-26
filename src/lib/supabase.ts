import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Keys loaded from Environment Variables for Security
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Public client - respects RLS (for user-facing operations)
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Admin client - bypasses RLS (for server-side admin operations only)
// Only create if service role key is available (server-side only)
export const supabaseAdmin: SupabaseClient = SUPABASE_SERVICE_ROLE_KEY 
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : supabase; // Fallback to anon client if no service role key
