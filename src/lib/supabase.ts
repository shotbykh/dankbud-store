import { createClient } from '@supabase/supabase-js';

// REAL PROD KEYS (Replace these with ENV variables later if you want to be "Proper")
const SUPABASE_URL = 'https://zubysbsgvfxwtjlfrscw.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Z_f54-dFbZYHB0S2EecK7g_iuFwRbz8'; // This is public, so it is safe-ish

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
