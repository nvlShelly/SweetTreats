import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updatedFields: Partial<Profile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const demo = localStorage.getItem('sweet_treats_demo_user');
    if (demo) {
      try {
        const data = JSON.parse(demo);
        return { id: data.id, email: data.email } as any;
      } catch { return null; }
    }
    return null;
  });
  const [profile, setProfile] = useState<Profile | null>(() => {
    const demo = localStorage.getItem('sweet_treats_demo_user');
    if (demo) {
      try { return JSON.parse(demo); } catch { return null; }
    }
    return null;
  });
  const [loading, setLoading] = useState(() => !localStorage.getItem('sweet_treats_demo_user'));

  useEffect(() => {
    const checkSession = async () => {
      // 1. Jika sudah ada sesi demo (sync), kita hanya perlu background check untuk Supabase
      if (user && !loading) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(session.user);
            fetchProfile(session.user.id);
          }
        } catch (e) {
          // Silently ignore background session check failure
        }
        return;
      }

      // 2. Normal check jika tidak ada sesi demo
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (!error && session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    let subscription: any;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else if (!localStorage.getItem('sweet_treats_demo_user')) {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      });
      subscription = data.subscription;
    } catch (e) {
      console.warn('Auth listener failed to start');
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  async function fetchProfile(uid: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', uid)
        .single();
      
      if (error) throw error;
      setProfile(data);
    } catch (e) {
      console.error('Error fetching profile:', e);
    } finally {
      setLoading(false);
    }
  }

  const signOut = async () => {
    localStorage.removeItem('sweet_treats_demo_user');
    setUser(null);
    setProfile(null);
    try {
      // Run signOut in try/catch and allow it to be async in the background if necessary
      supabase.auth.signOut().catch(err => {
        console.warn('Background Supabase sign out failed:', err);
      });
    } catch (e) {
      console.warn('Supabase sign out failed:', e);
    }
  };

  const updateProfile = (updatedFields: Partial<Profile>) => {
    if (!profile) return;
    const updated = {
      ...profile,
      ...updatedFields,
      updated_at: new Date().toISOString()
    };
    setProfile(updated);
    
    // Save to current user session
    localStorage.setItem('sweet_treats_demo_user', JSON.stringify(updated));
    
    // Save to permanent profile storage mapping by user ID
    if (profile.id) {
      localStorage.setItem(`sweet_treats_profile_${profile.id}`, JSON.stringify(updated));
    }
  };

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
