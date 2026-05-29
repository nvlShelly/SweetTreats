import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'placeholder';

export const isDemoMode = 
  !supabaseUrl || 
  supabaseUrl === 'https://placeholder.supabase.co' || 
  supabaseUrl.indexOf('your-') !== -1 || 
  supabaseUrl.indexOf('YOUR_') !== -1 || 
  supabaseUrl.indexOf('insert-') !== -1 || 
  supabaseUrl.indexOf('placeholder') !== -1 ||
  supabaseUrl.indexOf('undefined') !== -1 ||
  supabaseUrl.indexOf('null') !== -1 ||
  !supabaseUrl.startsWith('https://') ||
  !supabaseAnonKey || 
  supabaseAnonKey === 'placeholder' || 
  supabaseAnonKey.indexOf('your-') !== -1 || 
  supabaseAnonKey.indexOf('placeholder') !== -1 ||
  supabaseAnonKey.indexOf('undefined') !== -1 ||
  supabaseAnonKey.indexOf('null') !== -1 ||
  supabaseAnonKey.length < 20; // real JWT is always long

if (isDemoMode) {
  console.warn('Supabase credentials missing or placeholders detected. App is running in Demo Mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
