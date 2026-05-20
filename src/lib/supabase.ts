import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'placeholder';

if (!supabaseUrl || (supabaseUrl === 'https://placeholder.supabase.co')) {
  console.warn('Supabase credentials missing. App is running in Demo Mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
