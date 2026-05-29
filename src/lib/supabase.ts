import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const isDemoMode = 
  !supabaseUrl || 
  supabaseUrl === 'https://placeholder.supabase.co' || 
  supabaseUrl.includes('your-') || 
  supabaseUrl.includes('YOUR_') || 
  supabaseUrl.includes('insert-') || 
  supabaseUrl.includes('placeholder') ||
  !supabaseUrl.startsWith('https://') ||
  !supabaseAnonKey || 
  supabaseAnonKey === 'placeholder' || 
  supabaseAnonKey.includes('your-') || 
  supabaseAnonKey.includes('placeholder') ||
  supabaseAnonKey.length < 20; // real JWT is always long

if (isDemoMode) {
  console.warn('Supabase credentials missing or placeholders detected. App is running in Demo Mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
