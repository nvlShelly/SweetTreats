import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRecipes } from '../context/RecipeContext';
import { Cake, Search, User, LogOut, Menu, X, Heart, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { categories } = useRecipes();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-brand-pink-light/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-brand-pink rounded-xl group-hover:rotate-12 transition-transform">
              <Cake className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold font-sans tracking-tight text-slate-800">
              Sweet<span className="text-brand-pink">Treats</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-brand-pink transition-colors">Home</Link>
            <Link to="/app" className="text-sm font-medium text-slate-600 hover:text-brand-pink transition-colors">Recipes</Link>
            
            {/* Interactive Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button 
                onClick={() => navigate('/category/all')}
                className="text-sm font-medium text-slate-600 hover:text-brand-pink flex items-center gap-1 transition-colors py-2"
              >
                Categories
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full w-56 bg-white rounded-2xl shadow-xl border border-brand-pink-light/20 p-2 z-50 grid grid-cols-1 gap-0.5"
                  >
                    <Link
                      to="/category/all"
                      onClick={() => setShowDropdown(false)}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-brand-pink/5 hover:text-brand-pink transition-all flex items-center gap-2"
                    >
                      <span>🍩</span> All Recipes
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setShowDropdown(false)}
                        className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-brand-pink/5 hover:text-brand-pink transition-all flex items-center gap-2"
                      >
                        <span className="text-sm">{cat.icon}</span> {cat.name}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Search & Profile */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/search')}
              className="p-2 text-slate-400 hover:text-brand-pink transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
            
            {user ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <Link to="/app" className="p-2 text-slate-400 hover:text-red-400 transition-colors" onClick={() => localStorage.setItem('sweet_treats_active_tab', 'saved')}>
                  <Heart className="w-5 h-5 text-slate-400 hover:text-red-400" />
                </Link>
                <Link to="/app" className="flex items-center gap-2" onClick={() => localStorage.setItem('sweet_treats_active_tab', 'overview')}>
                  <img 
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${profile?.full_name || 'User'}&background=FFB7C5&color=fff`} 
                    alt="Profile" 
                    className="w-9 h-9 rounded-full border-2 border-brand-pink-light object-cover"
                  />
                </Link>
                <button 
                  onClick={async () => {
                    await signOut();
                    toast.success('Sampai jumpa lagi, Sweetie! Berhasil keluar... 🍰✨');
                    navigate('/');
                  }} 
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95 group"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-brand-pink px-4 py-2">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm !px-6 !py-2.5">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-slate-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-brand-pink-light overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <Link to="/" className="block text-lg font-medium text-slate-700 hover:text-brand-pink transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/app" className="block text-lg font-medium text-slate-700 hover:text-brand-pink transition-colors" onClick={() => setIsMenuOpen(false)}>Recipes</Link>
              
              {/* Expandable Mobile Categories */}
              <div>
                <button 
                  onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                  className="w-full text-left text-lg font-medium text-slate-700 hover:text-brand-pink transition-colors flex items-center justify-between"
                >
                  <span>Categories</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${mobileCategoriesOpen ? 'rotate-180 text-brand-pink' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {mobileCategoriesOpen && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="pl-4 mt-2 border-l-2 border-brand-pink-light/30 space-y-2 overflow-hidden"
                    >
                      <Link 
                        to="/category/all" 
                        className="block text-sm font-bold text-slate-500 hover:text-brand-pink py-1"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        All Recipes 🍰
                      </Link>
                      {categories.map((cat) => (
                        <Link 
                          key={cat.id}
                          to={`/category/${cat.slug}`} 
                          className="block text-sm font-bold text-slate-500 hover:text-brand-pink py-1 flex items-center gap-2"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span>{cat.icon}</span> {cat.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {user ? (
                <>
                  <Link 
                    to="/app" 
                    className="block text-lg font-medium text-slate-700 hover:text-brand-pink transition-colors" 
                    onClick={() => {
                      localStorage.setItem('sweet_treats_active_tab', 'overview');
                      setIsMenuOpen(false);
                    }}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/app" 
                    className="block text-lg font-medium text-slate-700 hover:text-brand-pink transition-colors" 
                    onClick={() => {
                      localStorage.setItem('sweet_treats_active_tab', 'saved');
                      setIsMenuOpen(false);
                    }}
                  >
                    Saved Favorites ❤️
                  </Link>
                  <button 
                    onClick={async () => {
                      await signOut();
                      toast.success('Sampai jumpa lagi, Sweetie! Berhasil keluar... 🍰✨');
                      setIsMenuOpen(false);
                      navigate('/');
                    }} 
                    className="w-full text-left text-lg font-bold text-red-500 hover:text-red-600 transition-colors mt-2 py-2.5 flex items-center gap-2 border-t border-slate-100"
                  >
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-4 flex flex-col gap-3">
                  <Link to="/login" className="btn-secondary text-center" onClick={() => setIsMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
