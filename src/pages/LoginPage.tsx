import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Github, Chrome, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorField, setErrorField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorField(null);
    
    if (!email) {
      toast.error('Email is required! 🍰');
      setErrorField('email');
      return;
    }
    if (!password) {
      toast.error('Password is required! 🍰');
      setErrorField('password');
      return;
    }

    setLoading(true);

    try {
      // 1. Always attempt demo entry first for the best preview experience
      const role: 'admin' | 'user' = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      const userId = 'demo-uuid-' + email.toLowerCase().replace(/[^a-z0-9]/g, '-');
      
      const savedProfileStr = localStorage.getItem(`sweet_treats_profile_${userId}`);
      let mockProfile;
      if (savedProfileStr) {
        mockProfile = JSON.parse(savedProfileStr);
      } else {
        mockProfile = {
          id: userId,
          email: email,
          full_name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
          role: role,
          avatar_url: `https://ui-avatars.com/api/?name=${email}&background=FFB7C5&color=fff`,
          bio: '',
          updated_at: new Date().toISOString()
        };
      }
      
      localStorage.setItem('sweet_treats_demo_user', JSON.stringify(mockProfile));
      toast.success(`Welcome back! 🍰`);
      
      setTimeout(() => {
        window.location.href = '/app';
      }, 300);
    } catch (error: any) {
      toast.error('Something went wrong. Please try again!');
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    const userId = 'demo-admin';
    const savedProfileStr = localStorage.getItem(`sweet_treats_profile_${userId}`);
    let mockProfile;
    if (savedProfileStr) {
      mockProfile = JSON.parse(savedProfileStr);
    } else {
      mockProfile = {
        id: userId,
        email: 'admin@sweet.treats',
        full_name: 'Premium Admin',
        role: 'admin',
        avatar_url: 'https://ui-avatars.com/api/?name=Admin&background=FFB7C5&color=fff',
        bio: '',
        updated_at: new Date().toISOString()
      };
    }
    localStorage.setItem('sweet_treats_demo_user', JSON.stringify(mockProfile));
    toast.success('Welcome to Demo Dashboard! 🍰');
    window.location.href = '/app';
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-brand-cream-light/50">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[40px] shadow-2xl shadow-brand-pink/10 p-10 border border-brand-pink-light/30 border-b-8"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
          <p className="text-slate-400">Bake something wonderful today!</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-600 block px-1">Email Address</label>
            <div className="relative group">
              <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errorField === 'email' || errorField === 'both' ? 'text-red-400' : 'text-slate-300 group-focus-within:text-brand-pink'}`} />
              <input 
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if(errorField === 'email' || errorField === 'both') setErrorField(null); }}
                required
                placeholder="example@email.com"
                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border transition-all ${errorField === 'email' || errorField === 'both' ? 'border-red-200 bg-red-50 focus:border-red-400' : 'border-slate-100 focus:bg-white focus:border-brand-pink'} focus:outline-none`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-sm font-bold text-slate-600 block">Password</label>
              <button 
                type="button" 
                onClick={() => toast.info('Password recovery is disabled in demo mode.')}
                className="text-xs font-bold text-brand-pink hover:text-brand-pink-dark transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div className="relative group">
              <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${errorField === 'password' || errorField === 'both' ? 'text-red-400' : 'text-slate-300 group-focus-within:text-brand-pink'}`} />
              <input 
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); if(errorField === 'password' || errorField === 'both') setErrorField(null); }}
                required
                placeholder="••••••••"
                className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 border transition-all ${errorField === 'password' || errorField === 'both' ? 'border-red-200 bg-red-50 focus:border-red-400' : 'border-slate-100 focus:bg-white focus:border-brand-pink'} focus:outline-none`}
              />
            </div>
          </div>

          <div className="space-y-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
            
            <button 
              type="button" 
              onClick={handleDemoLogin}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-brand-pink-light text-brand-pink font-bold hover:bg-brand-pink/5 transition-all text-sm"
            >
              ✨ Explore Demo Dashboard (No Login Needed)
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <span className="relative px-4 bg-white text-xs font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Chrome className="w-5 h-5 text-red-500" /> Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-100 font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <Github className="w-5 h-5" /> GitHub
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-sm font-medium text-slate-500">
          Don't have an account? <Link to="/register" className="text-brand-pink font-bold hover:underline">Join our bakery</Link>
        </p>

        {/* Demo Warning */}
        <div className="mt-8 p-4 bg-brand-pink/5 rounded-2xl border border-brand-pink-light/30 flex gap-3">
          <AlertCircle className="w-5 h-5 text-brand-pink shrink-0" />
          <p className="text-[10px] leading-relaxed text-brand-pink-dark font-medium">
            Note: This app uses Supabase. Ensure you've followed the SQL Schema setup in supabase_schema.sql and provided your keys in .env.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
