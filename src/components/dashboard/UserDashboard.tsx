import { useState, useMemo, useEffect } from 'react';
import { 
  Heart, Star, Clock, BookOpen, PlusCircle, Search, 
  ChevronRight, Filter, Bookmark, UtensilsCrossed,
  LayoutDashboard, User, Settings, Sparkles, PieChart,
  Grid, Save, History, Menu, X, ArrowRight, Camera
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRecipes } from '../../context/RecipeContext';
import { MOCK_CHART_DATA } from '../../services/mockData';
import RecipeCard from '../RecipeCard';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import ChatBot from './ChatBot';
import { useAuth } from '../../hooks/useAuth';

type Section = 'overview' | 'recipes' | 'categories' | 'saved' | 'liked' | 'profile';

export default function UserDashboard({ profile: initialProfile }: { profile: any }) {
  const { profile: liveProfile, updateProfile } = useAuth();
  const activeProfile = liveProfile || initialProfile;

  const { recipes, categories } = useRecipes();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Profile forms state
  const [fullNameState, setFullNameState] = useState('');
  const [usernameState, setUsernameState] = useState('');
  const [bioState, setBioState] = useState('');
  const [avatarUrlState, setAvatarUrlState] = useState('');

  useEffect(() => {
    if (activeProfile) {
      setFullNameState(activeProfile.full_name || '');
      setUsernameState(activeProfile.username || '');
      setBioState(activeProfile.bio || '');
      setAvatarUrlState(activeProfile.avatar_url || '');
    }
  }, [activeProfile]);

  // Like and Save states
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Update lists when the logged-in profile changes
  useEffect(() => {
    const userId = activeProfile?.id || 'guest';
    const saved = localStorage.getItem(`sweet_treats_saved_${userId}`);
    setSavedIds(saved ? JSON.parse(saved) : []);

    const liked = localStorage.getItem(`sweet_treats_liked_${userId}`);
    setLikedIds(liked ? JSON.parse(liked) : []);
  }, [activeProfile?.id]);

  const toggleSave = (id: string) => {
    const userId = activeProfile?.id || 'guest';
    setSavedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem(`sweet_treats_saved_${userId}`, JSON.stringify(next));
      toast.success(prev.includes(id) ? 'Removed from saved! 🍪' : 'Recipe saved! 🍰');
      return next;
    });
  };

  const toggleLike = (id: string) => {
    const userId = activeProfile?.id || 'guest';
    setLikedIds(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem(`sweet_treats_liked_${userId}`, JSON.stringify(next));
      if (!prev.includes(id)) toast.success('Added to favorites! ❤️');
      return next;
    });
  };

  const sidebarItems = [
    { id: 'overview', label: 'Home', icon: LayoutDashboard },
    { id: 'recipes', label: 'Resep Kue', icon: UtensilsCrossed },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'saved', label: 'Saved', icon: Save },
    { id: 'liked', label: 'Like', icon: Heart },
    { id: 'profile', label: 'Edit Profil', icon: User },
  ];

  const stats = [
    { label: 'Saved', value: savedIds.length.toString(), icon: Save, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Favorite', value: likedIds.length.toString(), icon: Heart, color: 'text-red-500', bg: 'bg-red-50' },
    { label: 'Bakes', value: '156', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { label: 'Views Today', value: '72', icon: PieChart, color: 'text-brand-pink', bg: 'bg-brand-pink-light/30' },
  ];

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recipes, searchQuery]);

  const savedRecipes = useMemo(() => {
    return recipes.filter(r => savedIds.includes(r.id));
  }, [recipes, savedIds]);

  const likedRecipes = useMemo(() => {
    return recipes.filter(r => likedIds.includes(r.id));
  }, [recipes, likedIds]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-brand-cream-light/30 p-4 md:p-8 gap-8">
      {/* Sidebar - Floating Permanent Width */}
      <aside 
        className="w-[280px] bg-white rounded-[40px] border border-brand-pink-light/20 flex flex-col sticky top-0 h-[calc(100vh-144px)] z-30 shadow-[0_20px_50px_rgba(0,0,0,0.04)] flex-shrink-0"
      >
        <div className="p-10 pb-6 flex items-center">
          <span className="font-black text-brand-pink text-2xl tracking-tighter uppercase italic">SweetBakery</span>
        </div>

        <nav className="flex-grow px-6 space-y-3 overflow-y-auto py-4">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as Section)}
              className={`w-full flex items-center gap-4 p-4 rounded-[24px] transition-all group ${
                activeSection === item.id 
                  ? 'bg-brand-pink text-white shadow-xl shadow-brand-pink/30 scale-[1.02]' 
                  : 'text-slate-400 hover:bg-brand-pink/5 hover:text-brand-pink'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="font-bold text-[15px] whitespace-nowrap">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto">
           <div className="bg-slate-50 p-4 rounded-[32px] flex items-center gap-3 border border-slate-100 font-sans">
             <div className="w-12 h-12 rounded-2xl overflow-hidden bg-brand-pink text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-brand-pink/20 shrink-0">
               {activeProfile?.avatar_url ? (
                 <img src={activeProfile.avatar_url} className="w-full h-full object-cover" alt={activeProfile.full_name || 'User'} />
               ) : (
                 activeProfile?.full_name?.charAt(0) || 'U'
               )}
             </div>
             <div className="overflow-hidden">
               <p className="text-sm font-black text-slate-800 truncate leading-none mb-1">{activeProfile?.full_name || 'Sweet User'}</p>
               <p className="text-[11px] text-slate-400 font-medium truncate italic">{activeProfile?.email}</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow overflow-y-auto max-w-full">
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">Hello, {activeProfile?.full_name?.split(' ')[0] || 'Sweetie'}! 👋</h1>
                  <p className="text-slate-500 font-medium italic">What are we baking today?</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="bakery-card px-6 py-3 flex items-center gap-3">
                     <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                     <span className="text-sm font-bold text-slate-600">Bakery Online</span>
                   </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    key={i} 
                    className="bakery-card p-6 group hover:-translate-y-1 transition-transform cursor-pointer"
                  >
                    <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-400 capitalize tracking-wide">{stat.label}</p>
                  </motion.div>
                ))}
              </div>

              {/* Views Chart Section */}
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="bakery-card p-8 bg-white min-h-[400px] flex flex-col">
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Baking Activity</h3>
                      <p className="text-sm text-slate-400 font-medium">Daily recipe views this week</p>
                    </div>
                    <PieChart className="w-6 h-6 text-brand-pink" />
                  </div>
                  <div className="flex-grow">
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={MOCK_CHART_DATA}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFB7C5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#FFB7C5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                          itemStyle={{color: '#FFB7C5', fontWeight: 700}}
                        />
                        <Area type="monotone" dataKey="views" stroke="#FFB7C5" strokeWidth={4} fillOpacity={1} fill="url(#colorViews)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-6 flex items-center justify-between p-4 bg-brand-cream-light/30 rounded-2xl border border-dashed border-brand-pink-light/50">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-brand-pink" />
                      <span className="text-xs font-bold text-slate-600">You are in the top 5% of bakers!</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-brand-pink" />
                  </div>
                </div>

                {/* Daily Tip / Discovery */}
                <div className="bakery-card overflow-hidden flex flex-col relative group">
                  <img 
                    src="https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=600" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    alt="Daily discovery"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="relative mt-auto p-10 text-white">
                    <div className="bg-brand-pink/90 backdrop-blur-sm self-start px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 inline-block">
                      Daily Discovery
                    </div>
                    <h3 className="text-3xl font-bold mb-4">Mastering the Korean Bento Cake</h3>
                    <p className="text-white/80 mb-8 max-w-sm font-medium">The secret to that perfect smooth finish? It is all in the temperature of your buttercream.</p>
                    <Link to="/recipe/korean-bento-mini-cake" className="bg-white text-brand-pink px-8 py-4 rounded-full font-bold hover:shadow-2xl transition-all inline-flex items-center gap-2 group/btn">
                      Start Baking <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Recommended Items */}
              <div className="bakery-card p-8 bg-white border-none relative overflow-hidden group shadow-[0_15px_40px_rgba(0,0,0,0.02)]">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-700">
                  <Star className="w-32 h-32 text-brand-pink" />
                </div>
                
                <div className="flex justify-between items-end mb-8 relative z-10">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                      <Star className="text-yellow-400 w-6 h-6 fill-current" /> Recommended for You
                    </h3>
                    <p className="text-slate-400 font-medium mt-1">Based on your baking preferences ✨</p>
                  </div>
                  <button onClick={() => setActiveSection('recipes')} className="text-sm font-bold text-brand-pink hover:underline flex items-center gap-1">View All</button>
                </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {recipes.slice(0, 3).map((r, i) => (
                        <RecipeCard 
                          key={r.id} 
                          recipe={r} 
                          index={i}
                          isLiked={likedIds.includes(r.id)}
                          isSaved={savedIds.includes(r.id)}
                          onLike={toggleLike}
                          onSave={toggleSave}
                        />
                      ))}
                    </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'recipes' && (
            <motion.div key="recipes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <h1 className="text-3xl font-bold text-slate-900">Explore Recipes 🍰</h1>
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none" />
                  <input 
                    type="text"
                    placeholder="Apa yang ingin kamu panggang hari ini?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-slate-100 focus:border-brand-pink focus:outline-none shadow-sm transition-all"
                  />
                </div>
              </div>

              {filteredRecipes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredRecipes.map((r, i) => (
                    <RecipeCard 
                      key={r.id} 
                      recipe={r} 
                      index={i} 
                      isLiked={likedIds.includes(r.id)}
                      isSaved={savedIds.includes(r.id)}
                      onLike={toggleLike}
                      onSave={toggleSave}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center bakery-card">
                  <div className="text-6xl mb-6">🍪</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">No recipes found</h3>
                  <p className="text-slate-400">Try searching for something else!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'categories' && (
            <motion.div key="categories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h1 className="text-3xl font-bold text-slate-900">Categories 🍩</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat, i) => (
                  <Link 
                    to={`/category/${cat.slug}`} 
                    key={cat.id}
                    className="bakery-card p-8 flex flex-col items-center text-center group hover:border-brand-pink transition-all"
                  >
                    <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-500">{cat.icon}</div>
                    <h3 className="font-bold text-lg text-slate-800">{cat.name}</h3>
                    <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">Explore</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {activeSection === 'saved' && (
            <motion.div key="saved" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h1 className="text-3xl font-bold text-slate-900">Saved Recipes 🔖</h1>
              {savedRecipes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {savedRecipes.map((r, i) => (
                    <RecipeCard 
                      key={r.id} 
                      recipe={r} 
                      index={i} 
                      isLiked={likedIds.includes(r.id)}
                      isSaved={true}
                      onLike={toggleLike}
                      onSave={toggleSave}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bakery-card bg-white">
                  <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Save className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Your Saved Recipes</h2>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium italic">You haven't saved any recipes yet. Heart a recipe to keep it here!</p>
                  <button 
                    onClick={() => setActiveSection('recipes')} 
                    className="mt-8 bg-indigo-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all"
                  >
                    Go Explore
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'liked' && (
            <motion.div key="liked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h1 className="text-3xl font-bold text-slate-900">Loved Recipes ❤️</h1>
              {likedRecipes.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {likedRecipes.map((r, i) => (
                    <RecipeCard 
                      key={r.id} 
                      recipe={r} 
                      index={i} 
                      isLiked={true}
                      isSaved={savedIds.includes(r.id)}
                      onLike={toggleLike}
                      onSave={toggleSave}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bakery-card bg-white">
                  <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 fill-current" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Liked with Love</h2>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium italic">Your favorite inspirations will appear here.</p>
                  <button 
                    onClick={() => setActiveSection('recipes')} 
                    className="mt-8 bg-red-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-xl transition-all"
                  >
                    Find something yummy
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeSection === 'profile' && (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto">
              <div className="bakery-card p-10 bg-white">
                <h1 className="text-3xl font-bold text-slate-900 mb-10 text-center">Edit Profil 🍓</h1>
                
                <form className="space-y-8" onSubmit={(e) => {
                  e.preventDefault();
                  if (!fullNameState.trim()) {
                    toast.error('Nama Lengkap tidak boleh kosong! 🍰');
                    return;
                  }
                  updateProfile({
                    full_name: fullNameState.trim(),
                    username: usernameState.trim() || null,
                    bio: bioState.trim() || null,
                    avatar_url: avatarUrlState || null,
                  });
                  toast.success('Profil berhasil diperbarui secara permanen! ✨');
                }}>
                  
                  {/* Photo Profile Device Upload */}
                  <div className="flex flex-col items-center mb-10">
                    <div className="relative group cursor-pointer" onClick={() => document.getElementById('avatar-input')?.click()}>
                      <div className="w-32 h-32 rounded-[40px] bg-brand-pink text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                        {avatarUrlState ? (
                          <img src={avatarUrlState} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                          fullNameState.charAt(0).toUpperCase() || 'U'
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-[40px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Camera className="w-8 h-8 text-white" />
                      </div>
                      <button 
                        type="button" 
                        className="absolute -bottom-2 -right-2 bg-brand-pink p-3 rounded-2xl shadow-lg border-2 border-white hover:scale-110 transition-transform text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          document.getElementById('avatar-input')?.click();
                        }}
                      >
                        <Camera className="w-5 h-5" />
                      </button>
                    </div>
                    <span className="text-xs text-slate-400 font-medium mt-3 italic">Pilih foto dari perangkat (Klik foto)</span>
                    <input 
                      type="file" 
                      id="avatar-input" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            toast.error('Ukuran foto terlalu besar! Maksimal 2MB. 🍪');
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (typeof event.target?.result === 'string') {
                              setAvatarUrlState(event.target.result);
                              toast.success('Foto terpilih! Klik Simpan Perubahan di bawah. 📸');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nama Lengkap</label>
                       <input 
                         type="text" 
                         value={fullNameState}
                         onChange={(e) => setFullNameState(e.target.value)}
                         placeholder="Nama Lengkap Anda"
                         className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:border-brand-pink transition-all font-bold text-slate-800"
                        />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Nama Pengguna (Username)</label>
                       <input 
                         type="text" 
                         value={usernameState}
                         onChange={(e) => setUsernameState(e.target.value)}
                         placeholder="@username"
                         className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:border-brand-pink transition-all font-bold text-slate-800"
                        />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Email</label>
                       <input 
                         type="email" 
                         disabled 
                         defaultValue={activeProfile?.email} 
                         className="w-full bg-slate-100 p-4 rounded-2xl border border-slate-100 font-bold text-slate-400 cursor-not-allowed"
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Bio</label>
                     <textarea 
                       placeholder="Ceritakan tentang hobi memasak atau perjalanan baking Anda..."
                       value={bioState}
                       onChange={(e) => setBioState(e.target.value)}
                       className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:border-brand-pink min-h-[120px] transition-all font-medium text-slate-700"
                      />
                  </div>

                  <button type="submit" className="w-full bg-brand-pink text-white py-5 rounded-3xl font-bold text-lg shadow-xl shadow-brand-pink/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Simpan Perubahan ✨
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Interactive AI Chatbot */}
      <ChatBot />
    </div>
  );
}

