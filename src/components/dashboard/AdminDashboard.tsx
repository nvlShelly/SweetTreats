import { useState, useMemo, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, PlusCircle, ListTodo, Edit3, Grid, FileText, 
  Image as ImageIcon, Users, UserCheck, BarChart3, LineChart, 
  Heart, Bookmark, Bell, Settings, LogOut, Search, MoreHorizontal,
  Plus, Edit2, Trash2, ArrowUpRight, TrendingUp, Filter,
  CheckCircle2, AlertCircle, Clock, X, Upload
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useRecipes } from '../../context/RecipeContext';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, Legend
} from 'recharts';

// Mock data for charts
const ANALYTICS_DATA = [
  { name: 'Mon', views: 4000, bakes: 2400 },
  { name: 'Tue', views: 3000, bakes: 1398 },
  { name: 'Wed', views: 2000, bakes: 9800 },
  { name: 'Thu', views: 2780, bakes: 3908 },
  { name: 'Fri', views: 1890, bakes: 4800 },
  { name: 'Sat', views: 2390, bakes: 3800 },
  { name: 'Sun', views: 3490, bakes: 4300 },
];

const CATEGORY_STATS = [
  { name: 'Cakes', value: 45, color: '#FFB7C5' },
  { name: 'Cookies', value: 25, color: '#FFD1DC' },
  { name: 'Pastries', value: 15, color: '#F8C8DC' },
  { name: 'Breads', value: 15, color: '#FFC0CB' },
];

type SectionId = 
  | 'dashboard' | 'add-recipe' | 'manage-recipes' | 'edit-details' 
  | 'categories' | 'content-edit' | 'photos' | 'users' 
  | 'active-users' | 'recipe-analytics' | 'user-analytics' 
  | 'favorites' | 'saved' | 'notifications' | 'settings' | 'logout';

interface SidebarItem {
  id: SectionId;
  label: string;
  icon: any;
  category: string;
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'General' },
  { id: 'add-recipe', label: 'Add New Recipe', icon: PlusCircle, category: 'Recipes' },
  { id: 'manage-recipes', label: 'Manage Recipes', icon: ListTodo, category: 'Recipes' },
  { id: 'edit-details', label: 'Edit Recipe Details', icon: Edit3, category: 'Recipes' },
  { id: 'categories', label: 'Change Categories', icon: Grid, category: 'Recipes' },
  { id: 'content-edit', label: 'Edit Content', icon: FileText, category: 'Recipes' },
  { id: 'photos', label: 'Gallery Management', icon: ImageIcon, category: 'Recipes' },
  { id: 'users', label: 'User Management', icon: Users, category: 'Users' },
  { id: 'active-users', label: 'Logged-in Users', icon: UserCheck, category: 'Users' },
  { id: 'recipe-analytics', label: 'Recipe Analytics', icon: BarChart3, category: 'Analytics' },
  { id: 'user-analytics', label: 'User Analytics', icon: LineChart, category: 'Analytics' },
  { id: 'favorites', label: 'Favorites', icon: Heart, category: 'Activity' },
  { id: 'saved', label: 'Saved Recipes', icon: Bookmark, category: 'Activity' },
  { id: 'notifications', label: 'Notifications', icon: Bell, category: 'System' },
  { id: 'settings', label: 'Settings', icon: Settings, category: 'System' },
  { id: 'logout', label: 'Logout', icon: LogOut, category: 'System' },
];

export default function AdminDashboard() {
  const { recipes, categories, addRecipe, updateRecipe, deleteRecipe, addCategory, updateCategory, deleteCategory } = useRecipes();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionId>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for recipe form
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [recipeForm, setRecipeForm] = useState({
    title: '',
    category_id: '',
    description: '',
    ingredients: [''],
    steps: [''],
    thumbnail_url: '',
    cooking_time: 30,
    difficulty: 'Medium' as 'Easy' | 'Medium' | 'Hard',
    video_url: '',
    tips: ''
  });

  // State for category form
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '🍰',
    description: ''
  });

  // Interactive Live Admin States
  const [activeUsersList, setActiveUsersList] = useState([
    { id: 'u-1', name: 'Chloe Whisker', status: 'Active Now', role: 'Premium', location: 'Jakarta, ID', device: 'Chrome on macOS', ip: '182.253.44.12', loginTime: '3 hours ago', color: 'bg-green-400' },
    { id: 'u-2', name: 'Oliver Crumb', status: '2h ago', role: 'Member', location: 'Surabaya, ID', device: 'Safari on iPhone', ip: '112.54.129.80', loginTime: '5 hours ago', color: 'bg-slate-300' },
    { id: 'u-3', name: 'Sarah Sugar', status: 'Active Now', role: 'Instructor', location: 'Bandung, ID', device: 'Edge on Windows', ip: '125.160.8.23', loginTime: '1 hour ago', color: 'bg-brand-pink' },
    { id: 'u-4', name: 'Ben Batter', status: 'Active Now', role: 'Member', location: 'Medan, ID', device: 'Chrome on Android', ip: '36.85.12.231', loginTime: '45 mins ago', color: 'bg-green-400' },
    { id: 'u-5', name: 'Lily Lemon', status: '1d ago', role: 'Member', location: 'Yogyakarta, ID', device: 'Firefox on Linux', ip: '103.111.44.3', loginTime: '1 day ago', color: 'bg-slate-300' },
    { id: 'u-6', name: 'Tom Tart', status: 'Active Now', role: 'Premium', location: 'Bali, ID', device: 'Safari on iPad', ip: '178.62.203.41', loginTime: '10 mins ago', color: 'bg-green-400' },
  ]);

  const [notificationList, setNotificationList] = useState([
    { id: 'n-1', title: 'New Recipe Review 🍰', message: 'Chloe Whisker marked Chocolate Lava Cake as 5-stars and wrote "absolutely melted my heart!".', time: '5 mins ago', type: 'info', read: false },
    { id: 'n-2', title: 'Heavy Whipping Warning ⚠️', message: 'High request traffic detected on recipe assets. Consider caching optimization.', time: '12 mins ago', type: 'warning', read: false },
    { id: 'n-3', title: 'New Baker Registration 🧁', message: 'User Lily Lemon successfully registered and activated her oven.', time: '1 hour ago', type: 'success', read: true },
    { id: 'n-4', title: 'Abusive Comment Blocked 🚫', message: 'Filtered user review on Lemon Tart containing blacklisted phrases.', time: '4 hours ago', type: 'error', read: true },
  ]);

  const [bakerySettings, setBakerySettings] = useState({
    holidayMode: false,
    allowRegistration: true,
    requireReviewApproval: true,
    measurementUnit: 'Metric ⚖️',
    dailyDigestHour: '08:00',
    marketingBudget: 50,
  });

  const [simulatedViewsMultiplier, setSimulatedViewsMultiplier] = useState(1);
  const [favoriteSparks, setFavoriteSparks] = useState<Record<string, number>>({});
  const [promoCodesIssued, setPromoCodesIssued] = useState<{code: string; value: string; created: string}[]>([]);
  const [liveTrafficCounter, setLiveTrafficCounter] = useState(145);
  const [isBackupSpinnerRunning, setIsBackupSpinnerRunning] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [customBroadcastTitle, setCustomBroadcastTitle] = useState('');
  const [customBroadcastMsg, setCustomBroadcastMsg] = useState('');
  const [premiumSpotlightIds, setPremiumSpotlightIds] = useState<string[]>([]);

  const filteredRecipes = useMemo(() => {
    return recipes.filter(r => 
      r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recipes, searchQuery]);

  const handleEditClick = (recipe: any, tab?: SectionId) => {
    setEditingRecipeId(recipe.id);
    setRecipeForm({
      title: recipe.title,
      category_id: recipe.category_id,
      description: recipe.description,
      ingredients: recipe.ingredients,
      steps: recipe.steps,
      thumbnail_url: recipe.thumbnail_url || '',
      cooking_time: recipe.cooking_time,
      difficulty: recipe.difficulty,
      video_url: recipe.video_url || '',
      tips: recipe.tips || ''
    });
    setActiveSection(tab || 'edit-details');
  };

  const handleSaveRecipe = () => {
    if (!recipeForm.title || !recipeForm.category_id) {
      toast.error('Name & Category are required! 🍬');
      return;
    }

    if (editingRecipeId) {
      updateRecipe(editingRecipeId, recipeForm);
      toast.success('Batch updated successfully! 🍥');
    } else {
      addRecipe({
        ...recipeForm,
        slug: recipeForm.title.toLowerCase().replace(/ /g, '-'),
        author_id: 'u1',
        is_published: true
      });
      toast.success('New masterpiece added! 🧁');
    }
    setEditingRecipeId(null);
    setActiveSection('manage-recipes');
    resetRecipeForm();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (e.g., 2MB limit for localStorage safety)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Image is too large! Please keep it under 2MB for storage. 🍪');
        return;
      }

      const reader = new FileReader();
      const toastId = toast.loading('Uploading photo...');
      
      reader.onloadend = () => {
        setRecipeForm(prev => ({ ...prev, thumbnail_url: reader.result as string }));
        toast.dismiss(toastId);
        toast.success('Photo added! 📸');
      };
      
      reader.onerror = () => {
        toast.dismiss(toastId);
        toast.error('Failed to read image file.');
      };

      reader.readAsDataURL(file);
    }
  };

  const resetRecipeForm = () => {
    setRecipeForm({
      title: '',
      category_id: categories[0]?.id || '1',
      description: '',
      ingredients: [''],
      steps: [''],
      thumbnail_url: '',
      cooking_time: 30,
      difficulty: 'Medium',
      video_url: '',
      tips: ''
    });
  };

  const handleDeleteRecipe = (id: string) => {
    if (confirm('Delete this recipe forever? 🍰')) {
      deleteRecipe(id);
      toast.success('Recipe removed.');
    }
  };

  // Sync category_id if initial empty
  useEffect(() => {
    if (!recipeForm.category_id && categories.length > 0) {
      setRecipeForm(prev => ({ ...prev, category_id: categories[0].id }));
    }
  }, [categories]);

  const stats = [
    { label: 'Total Views', value: '45.2K', change: '+12.5%', icon: BarChart3, color: 'brand-pink' },
    { label: 'Avg. Rating', value: '4.8', change: '+0.2%', icon: Heart, color: 'brand-pink' },
    { label: 'Active Users', value: '1,240', change: '+8.4%', icon: Users, color: 'brand-pink' },
    { label: 'Total Bakes', value: '8.9K', change: '+15.2%', icon: Plus, color: 'brand-pink' },
  ];

  const groupedItems = SIDEBAR_ITEMS.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, SidebarItem[]>);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-[#FCF9F7] p-4 md:p-8 gap-8 overflow-hidden">
      {/* Sidebar - Modern Floating */}
      <aside 
        className="w-[280px] bg-white rounded-[40px] border border-brand-pink-light/20 flex flex-col sticky top-0 h-[calc(100vh-144px)] z-30 shadow-[0_20px_50px_rgba(0,0,0,0.03)] flex-shrink-0"
      >
        <div className="p-10 pb-6 flex items-center">
          <span className="font-black text-brand-pink text-2xl tracking-tighter uppercase italic">ChefAdmin</span>
        </div>

        <nav className="flex-grow px-6 space-y-8 overflow-y-auto py-4 custom-scrollbar">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="space-y-3">
              <p className="px-4 text-[10px] font-black uppercase tracking-widest text-slate-300">{category}</p>
              <div className="space-y-1">
                {items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-[20px] transition-all group ${
                      activeSection === item.id 
                        ? 'bg-brand-pink text-white shadow-xl shadow-brand-pink/30 scale-[1.02]' 
                        : 'text-slate-400 hover:bg-brand-pink/5 hover:text-brand-pink'
                    }`}
                  >
                    <item.icon className="w-4.5 h-4.5 flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[14px] whitespace-nowrap">{item.label}</span>
                    {activeSection === item.id && (
                      <motion.div layoutId="activePill" className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <div className="bg-slate-50 p-4 rounded-[32px] flex items-center gap-3 border border-slate-100">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Profile" 
                className="w-10 h-10 rounded-2xl border-2 border-brand-pink-light object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-2xl bg-brand-pink text-white flex items-center justify-center font-black text-sm shadow-lg shadow-brand-pink/20 uppercase">
                {profile?.full_name ? profile.full_name.charAt(0) : 'A'}
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-black text-slate-800 truncate leading-none mb-1">
                {profile?.full_name || 'Admin User'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium truncate italic capitalize">
                {profile?.role === 'admin' ? 'Root Access' : (profile?.role || 'Member')}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow overflow-y-auto max-w-full custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight">Bonjour, {profile?.full_name || 'Chef'}! 👋</h1>
                  <p className="text-slate-400 font-medium mt-1">Here's what's baking in your kitchen today.</p>
                </div>
                <div className="flex gap-4">
                  <button className="p-4 bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <Bell className="w-5 h-5 text-slate-400" />
                  </button>
                  <button onClick={() => setActiveSection('add-recipe')} className="bg-brand-pink text-white px-8 py-4 rounded-[24px] font-black shadow-xl shadow-brand-pink/30 hover:scale-105 transition-all flex items-center gap-3">
                    <Plus className="w-5 h-5" /> New Recipe
                  </button>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bakery-card p-8 bg-white border-none relative overflow-hidden group shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)]"
                  >
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <div className="p-4 bg-[#FFF0F3] rounded-[24px] group-hover:scale-110 transition-transform duration-500">
                          <stat.icon className="w-6 h-6 text-brand-pink" />
                        </div>
                        <span className="text-[10px] font-black text-green-500 bg-green-50 px-2.5 py-1 rounded-full">{stat.change}</span>
                      </div>
                      <p className="text-3xl font-black text-slate-900 mb-1">{stat.value}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Analytics & Activity */}
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bakery-card p-10 bg-white border-none shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)]">
                  <div className="flex justify-between items-end mb-10">
                    <div>
                      <h3 className="text-2xl font-black text-slate-900">Sweet Trends</h3>
                      <p className="text-sm font-medium text-slate-400">Visitor activity and bakes per day</p>
                    </div>
                    <div className="flex gap-2">
                       <span className="flex items-center gap-2 text-xs font-bold text-brand-pink bg-brand-pink/5 px-3 py-1.5 rounded-full">
                         <div className="w-2 h-2 rounded-full bg-brand-pink" /> Views
                       </span>
                    </div>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ANALYTICS_DATA}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFB7C5" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#FFB7C5" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 700 }}
                        />
                        <Tooltip 
                          contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '15px' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="views" 
                          stroke="#FFB7C5" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorViews)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bakery-card p-10 bg-white border-none shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)]">
                  <h3 className="text-2xl font-black text-slate-900 mb-8">Popular Mix</h3>
                  <div className="space-y-8">
                    {CATEGORY_STATS.map((cat, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="font-bold text-slate-700">{cat.name}</span>
                          </div>
                          <span className="text-xs font-black text-slate-400">{cat.value}%</span>
                        </div>
                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${cat.value}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 p-6 bg-brand-pink/5 rounded-[32px] border border-brand-pink/10 text-center">
                     <p className="text-sm font-bold text-brand-pink mb-1">Top Performer</p>
                     <p className="text-xl font-black text-slate-800">Wedding Cakes 🎂</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Manage Recipes Section */}
          {activeSection === 'manage-recipes' && (
            <motion.div
              key="manage"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
               <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
                 <div>
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Manage Recipes</h1>
                   <p className="text-slate-400 font-medium mt-1">Organize and polish your sweet collection.</p>
                 </div>
                 <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative flex-grow md:w-80">
                      <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                      <input 
                        type="text" 
                        placeholder="Search your bakes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-[28px] pl-14 pr-6 py-4 outline-none focus:border-brand-pink transition-all shadow-sm focus:shadow-md"
                      />
                    </div>
                    <button className="p-4 bg-white border border-slate-100 rounded-[24px] shadow-sm">
                      <Filter className="w-6 h-6 text-slate-400" />
                    </button>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                 {filteredRecipes.map((r, i) => (
                   <motion.div 
                    key={r.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bakery-card p-6 bg-white border-none group shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:shadow-xl hover:scale-[1.02] transition-all"
                   >
                     <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden mb-6">
                       <img src={r.thumbnail_url || ''} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                       <div className="absolute top-4 right-4 flex flex-col gap-2">
                         <button onClick={() => handleEditClick(r)} className="p-3 bg-white/90 backdrop-blur-sm text-slate-800 rounded-2xl shadow-lg hover:bg-brand-pink hover:text-white transition-all">
                           <Edit2 className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleDeleteRecipe(r.id)} className="p-3 bg-white/90 backdrop-blur-sm text-red-500 rounded-2xl shadow-lg hover:bg-red-500 hover:text-white transition-all">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                       <div className="absolute bottom-4 left-4">
                         <span className="px-3 py-1.5 bg-brand-pink text-white text-[10px] font-black uppercase rounded-full shadow-lg">
                           {r.category?.name}
                         </span>
                       </div>
                     </div>

                     <h4 className="text-xl font-black text-slate-800 mb-2 truncate">{r.title}</h4>
                     <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-6">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-brand-pink" /> {r.cooking_time}m</span>
                        <span className="flex items-center gap-1"><BarChart3 className="w-3.5 h-3.5 text-brand-pink" /> {r.view_count} views</span>
                     </div>
                     
                     <div className="pt-6 border-t border-slate-50 flex justify-between items-center">
                        <div className="flex -space-x-2">
                           {[1,2].map(u => (
                             <div key={u} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                               <img src={`https://i.pravatar.cc/100?u=${u}${r.id}`} alt="User" />
                             </div>
                           ))}
                        </div>
                        <button onClick={() => handleEditClick(r, 'content-edit')} className="text-brand-pink text-xs font-black uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                          Content Audit <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </motion.div>
          )}

          {/* Add New Recipe & Edit Details Sections */}
          {(activeSection === 'add-recipe' || activeSection === 'edit-details' || activeSection === 'content-edit' || activeSection === 'photos') && (
            <motion.div
              key="recipe-form"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-4xl mx-auto space-y-10"
            >
              {(!editingRecipeId && activeSection !== 'add-recipe') ? (
                <div className="py-20 text-center bakery-card bg-white">
                  <div className="w-20 h-20 bg-brand-pink/10 text-brand-pink rounded-[40px] flex items-center justify-center mx-auto mb-6">
                    <ListTodo className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-2">No Recipe Selected</h2>
                  <p className="text-slate-400 max-w-sm mx-auto font-medium mb-8">Please select a recipe from the Management list to edit its details, content, or photos.</p>
                  <button 
                    onClick={() => setActiveSection('manage-recipes')}
                    className="bg-brand-pink text-white px-10 py-4 rounded-[28px] font-black shadow-xl shadow-brand-pink/20"
                  >
                    Go to Manage Recipes
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                      {editingRecipeId ? 'Perfect Your Creation 🍥' : 'Create a Masterpiece 🧁'}
                    </h1>
                    <p className="text-slate-400 font-medium mt-2">
                      {activeSection === 'content-edit' ? 'Refine the story and instructions of your bake.' : 
                       activeSection === 'photos' ? 'Manage the visual presentation of your recipe.' :
                       editingRecipeId ? 'Make adjustments to your existing recipe.' : 'Fill in the details below to share a new recipe with the world.'}
                    </p>
                  </div>

                  <div className="bakery-card p-10 bg-white border-none shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] space-y-8">
                    {/* Visual Section (Photo) - Show always if Photos or Add/Edit */}
                    {(activeSection === 'photos' || activeSection === 'add-recipe' || activeSection === 'edit-details') && (
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-800 uppercase tracking-widest block">Recipe Photo</label>
                        
                        <input 
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />

                        <div 
                          className="relative aspect-video rounded-[40px] bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer group hover:border-brand-pink transition-all overflow-hidden"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          {recipeForm.thumbnail_url ? (
                            <img src={recipeForm.thumbnail_url} className="w-full h-full object-cover" alt="Baking preview" />
                          ) : (
                            <>
                              <Upload className="w-10 h-10 text-slate-300 group-hover:text-brand-pink transition-colors mb-2" />
                              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Click to upload photo from device</p>
                              <p className="text-[10px] text-slate-300 font-medium mt-1">Or drag and drop here</p>
                            </>
                          )}
                          
                          {recipeForm.thumbnail_url && (
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                               <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    fileInputRef.current?.click();
                                  }}
                                  className="px-6 py-3 bg-white text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
                               >
                                 <Upload className="w-4 h-4" /> Change
                               </button>
                               <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const url = prompt('Or enter Image URL:');
                                    if (url) setRecipeForm(prev => ({ ...prev, thumbnail_url: url }));
                                  }}
                                  className="px-6 py-3 bg-brand-pink text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl"
                               >
                                 <Grid className="w-4 h-4" /> URL
                               </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Basic Info - Show if Add/Edit or Edit Details */}
                    {(activeSection === 'add-recipe' || activeSection === 'edit-details') && (
                      <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-sm font-black text-slate-800 uppercase tracking-widest block">Recipe Name</label>
                          <input 
                            type="text" 
                            value={recipeForm.title}
                            onChange={(e) => setRecipeForm(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g. Magic Matcha Mousse"
                            className="w-full bg-slate-50 rounded-[20px] px-6 py-4 outline-none border border-transparent focus:border-brand-pink transition-all font-medium"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-sm font-black text-slate-800 uppercase tracking-widest block">Category</label>
                          <div className="relative">
                            <select 
                              value={recipeForm.category_id}
                              onChange={(e) => setRecipeForm(prev => ({ ...prev, category_id: e.target.value }))}
                              className="w-full bg-slate-50 rounded-[20px] px-6 py-4 outline-none border border-transparent focus:border-brand-pink transition-all font-medium appearance-none"
                            >
                              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                            <Grid className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Content Section - Show if Add/Edit or Content Edit */}
                    {(activeSection === 'add-recipe' || activeSection === 'content-edit') && (
                      <>
                        <div className="space-y-4">
                          <label className="text-sm font-black text-slate-800 uppercase tracking-widest block">Description</label>
                          <textarea 
                            rows={4}
                            value={recipeForm.description}
                            onChange={(e) => setRecipeForm(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Tell the story behind this cake..."
                            className="w-full bg-slate-50 rounded-[32px] px-6 py-4 outline-none border border-transparent focus:border-brand-pink transition-all font-medium resize-none"
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-black text-slate-800 uppercase tracking-widest block">Ingredients</label>
                          <div className="space-y-3">
                            {recipeForm.ingredients.map((ing, idx) => (
                              <div key={idx} className="flex gap-4">
                                <input 
                                  type="text"
                                  value={ing}
                                  onChange={(e) => {
                                    const newIngs = [...recipeForm.ingredients];
                                    newIngs[idx] = e.target.value;
                                    setRecipeForm(prev => ({ ...prev, ingredients: newIngs }));
                                  }}
                                  className="w-full bg-slate-50 rounded-[20px] px-6 py-4 outline-none"
                                  placeholder="Ingredient name..."
                                />
                                <button 
                                  onClick={() => {
                                    const newIngs = recipeForm.ingredients.filter((_, i) => i !== idx);
                                    setRecipeForm(prev => ({ ...prev, ingredients: newIngs.length ? newIngs : [''] }));
                                  }}
                                  className="p-4 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                            <button 
                              onClick={() => setRecipeForm(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }))}
                              className="text-brand-pink font-black text-xs uppercase tracking-widest flex items-center gap-2 mt-2"
                            >
                              <Plus className="w-4 h-4" /> Add Ingredient
                            </button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-black text-slate-800 uppercase tracking-widest block">Baking Steps</label>
                          <div className="space-y-3">
                            {recipeForm.steps.map((step, idx) => (
                              <div key={idx} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-brand-pink text-white flex items-center justify-center font-black flex-shrink-0 mt-1">{idx + 1}</div>
                                <div className="flex-grow flex gap-4">
                                  <textarea 
                                    value={step}
                                    onChange={(e) => {
                                      const newSteps = [...recipeForm.steps];
                                      newSteps[idx] = e.target.value;
                                      setRecipeForm(prev => ({ ...prev, steps: newSteps }));
                                    }}
                                    className="w-full bg-slate-50 rounded-[20px] px-6 py-4 outline-none resize-none"
                                    placeholder="Describe this step..."
                                  />
                                  <button 
                                    onClick={() => {
                                      const newSteps = recipeForm.steps.filter((_, i) => i !== idx);
                                      setRecipeForm(prev => ({ ...prev, steps: newSteps.length ? newSteps : [''] }));
                                    }}
                                    className="p-4 text-slate-300 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <button 
                              onClick={() => setRecipeForm(prev => ({ ...prev, steps: [...prev.steps, ''] }))}
                              className="text-brand-pink font-black text-xs uppercase tracking-widest flex items-center gap-2 mt-4 ml-14"
                            >
                              <Plus className="w-4 h-4" /> Add Another Step
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="pt-8 border-t border-slate-50 flex justify-end gap-4">
                      <button 
                        onClick={() => { setEditingRecipeId(null); setActiveSection('manage-recipes'); resetRecipeForm(); }} 
                        className="px-8 py-4 rounded-[24px] font-black text-slate-400 hover:text-slate-800 transition-colors"
                      >
                        Discard
                      </button>
                      <button 
                        onClick={handleSaveRecipe}
                        className="px-12 py-4 bg-brand-pink text-white rounded-[24px] font-black shadow-xl shadow-brand-pink/30 hover:scale-105 transition-all"
                      >
                        {editingRecipeId ? 'Update Bake' : 'Save Recipe'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* Categories Section */}
          {activeSection === 'categories' && (
            <motion.div
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Cake Library</h1>
                  <p className="text-slate-400 font-medium mt-1">Manage dessert categories and organization.</p>
                </div>
          <button 
            onClick={() => {
              const name = prompt('Category Name:');
              if (name) addCategory({ name, slug: name.toLowerCase().replace(/ /g, '-'), icon: '🍪', description: '' });
            }}
            className="bg-brand-pink text-white px-8 py-4 rounded-[24px] font-black shadow-xl shadow-brand-pink/30 flex items-center gap-3"
          >
                  <Plus className="w-5 h-5" /> New Category
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, i) => (
                  <motion.div 
                    key={cat.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bakery-card p-8 bg-white border-none text-center shadow-[0_15px_40px_rgba(0,0,0,0.03)] group"
                  >
                    <div className="w-16 h-16 bg-brand-pink/5 text-brand-pink rounded-[24px] flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform text-2xl">
                      {cat.icon || '🍰'}
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-1">{cat.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">
                      {recipes.filter(r => r.category_id === cat.id).length} Recipes
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          const newName = prompt('Enter new category name:', cat.name);
                          if (newName) updateCategory(cat.id, { name: newName });
                        }}
                        className="flex-grow py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Delete category? Bakes in this category will become uncategorized.')) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* User Management Section */}
          {activeSection === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-10"
            >
               <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                 <div>
                   <h1 className="text-4xl font-black text-slate-900 tracking-tight">Community Hub</h1>
                   <p className="text-slate-400 font-medium mt-1">Manage your active bakers and enthusiasts.</p>
                 </div>
                 <button className="bg-slate-900 text-white px-10 py-4 rounded-[28px] font-black shadow-xl shadow-slate-900/10 flex items-center gap-3">
                   <Users className="w-5 h-5" /> Export Data
                 </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {[
                   { name: profile?.full_name || 'Chloe Whisker', status: 'Active Now (You)', role: profile?.role ? (profile.role.charAt(0).toUpperCase() + profile.role.slice(1)) : 'Admin', color: 'bg-green-400', avatar: profile?.avatar_url || undefined },
                   { name: 'Oliver Crumb', status: '2h ago', role: 'Member', color: 'bg-slate-300' },
                   { name: 'Sarah Sugar', status: 'Active Now', role: 'Instructor', color: 'bg-brand-pink' },
                   { name: 'Ben Batter', status: 'Active Now', role: 'Member', color: 'bg-green-400' },
                   { name: 'Lily Lemon', status: '1d ago', role: 'Member', color: 'bg-slate-300' },
                   { name: 'Tom Tart', status: 'Active Now', role: 'Premium', color: 'bg-green-400' },
                 ].map((user, i) => (
                   <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bakery-card p-8 bg-white border-none text-center shadow-[0_15px_40px_rgba(0,0,0,0.03)]"
                   >
                     <div className="relative w-24 h-24 mx-auto mb-6">
                        <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff`} className="w-full h-full rounded-[40px] shadow-lg object-cover" />
                        <div className={`absolute bottom-0 right-0 w-6 h-6 ${user.color} border-4 border-white rounded-full`} />
                     </div>
                     <h3 className="text-xl font-black text-slate-800 mb-1">{user.name}</h3>
                     <p className="text-xs font-black uppercase text-brand-pink tracking-widest mb-6">{user.role}</p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-3xl">
                           <p className="text-xl font-black text-slate-800">24</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Recipes</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-3xl">
                           <p className="text-xl font-black text-slate-800">128</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase">Followers</p>
                        </div>
                     </div>

                     <div className="mt-8 flex gap-3">
                        <button className="flex-grow py-4 bg-slate-900 text-white rounded-[24px] font-black text-xs hover:shadow-lg transition-all">Profile</button>
                        <button className="p-4 bg-slate-50 text-slate-400 rounded-[24px] hover:text-red-500 transition-all"><Trash2 className="w-5 h-5" /></button>
                     </div>
                   </motion.div>
                 ))}
               </div>
            </motion.div>
          )}

          {/* Logged-in Users / Active Sessions Section */}
          {activeSection === 'active-users' && (
            <motion.div
              key="active-users"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Active Bakers Radar</h1>
                  <p className="text-slate-400 font-medium mt-1">Real-time surveillance of enthusiasts inside the kitchen.</p>
                </div>
                <div className="bg-emerald-50 text-emerald-600 px-6 py-3 rounded-full font-black text-xs uppercase tracking-wider border border-emerald-100 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  {activeUsersList.length} Active Sessions
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {activeUsersList.map((user) => (
                    <motion.div
                      key={user.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8, x: -30 }}
                      className="bakery-card p-8 bg-white border-none rounded-[36px] shadow-[0_15px_40px_rgba(0,0,0,0.02)] relative overflow-hidden group"
                    >
                      <div className="absolute top-4 right-4 text-[10px] font-bold px-3 py-1 bg-slate-50 text-slate-400 rounded-full">
                        {user.ip}
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=FFB7C5&color=fff`} 
                            className="w-16 h-16 rounded-2xl object-cover" 
                          />
                          <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 bg-emerald-500 border-4 border-white rounded-full" />
                        </div>
                        <div>
                          <h3 className="font-black text-slate-800 text-lg leading-tight">{user.name}</h3>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-brand-pink/10 text-brand-pink rounded-md">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-slate-500 text-xs mb-8">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-400">Device:</span>
                          <span className="font-medium text-slate-700">{user.device}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-400">Location:</span>
                          <span className="font-medium text-slate-700">{user.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-400">Last Action:</span>
                          <span className="font-medium text-brand-pink font-mono">{user.loginTime}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button 
                          onClick={() => {
                            const warningText = prompt(`Send push notification/alert message to ${user.name}:`, 'Please follow community policies.');
                            if (warningText) {
                              toast.success(`Warning payload transmitted to ${user.name}: "${warningText}" 🧁`);
                            }
                          }}
                          className="py-3.5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-100 active:scale-95 transition-all text-center"
                        >
                          Send Alert 💬
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm(`Revoke token and kick ${user.name}? This will log them out immediately.`)) {
                              setActiveUsersList(prev => prev.filter(x => x.id !== user.id));
                              toast.error(`Session revoked for ${user.name} 🚫`);
                            }
                          }}
                          className="py-3.5 bg-red-50 text-red-500 rounded-2xl font-bold text-xs hover:bg-red-500 hover:text-white active:scale-95 transition-all"
                        >
                          Revoke Session
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Recipe Analytics Section with charts */}
          {activeSection === 'recipe-analytics' && (
            <motion.div
              key="recipe-analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Recipe Analytics</h1>
                  <p className="text-slate-400 font-medium mt-1">Evaluate post metric popularity, pageview conversions, and traffic peaks.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setSimulatedViewsMultiplier(prev => prev + 1);
                      setLiveTrafficCounter(prev => prev + Math.floor(Math.random() * 50) + 20);
                      toast.success('Hike Simulated! Traffic spike injected 🚀📈');
                    }}
                    className="px-6 py-3.5 bg-brand-pink text-white rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-pink/20"
                  >
                    Simulate Traffic Hike 🚀
                  </button>
                  <button 
                    onClick={() => {
                      toast.success('Baking performance report generated and exported to CSV! 📑');
                    }}
                    className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-xs hover:scale-105 active:scale-95 transition-all"
                  >
                    Export Report 📄
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-8 rounded-[36px] flex items-center justify-between shadow-sm border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Simulated Multiplier</p>
                    <p className="text-3xl font-black text-slate-800">{simulatedViewsMultiplier}x</p>
                  </div>
                  <div className="p-4 bg-brand-pink/5 text-brand-pink rounded-2xl">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[36px] flex items-center justify-between shadow-sm border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Scaled Pageviews</p>
                    <p className="text-3xl font-black text-slate-800">{(45200 * simulatedViewsMultiplier).toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                </div>
                <div className="bg-white p-8 rounded-[36px] flex items-center justify-between shadow-sm border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Live Bakers Online</p>
                    <p className="text-3xl font-black text-slate-800 animate-pulse text-emerald-600">{liveTrafficCounter}</p>
                  </div>
                  <div className="p-4 bg-emerald-50 text-emerald-500 rounded-2xl">
                    <UserCheck className="w-6 h-6" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visual Line Chart of Daily Traffic */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 lg:col-span-2 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-lg">Weekly Pageviews Tracking</h3>
                    <span className="text-[10px] font-black uppercase text-brand-pink tracking-widest">Recharts Engine</span>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={ANALYTICS_DATA}>
                        <defs>
                          <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#FFB7C5" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#FFB7C5" stopOpacity={0.0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ background: '#FFF', border: '1px solid #FFEDF0', borderRadius: '16px', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}
                          labelClassName="font-bold text-slate-800"
                        />
                        <Area 
                          type="monotone" 
                          dataKey={(v) => v.views * simulatedViewsMultiplier} 
                          name="Views" 
                          stroke="#FFB7C5" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#viewsGradient)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Cake Category Popularity Share */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 space-y-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-black text-slate-800 text-lg">Category Breakdown</h3>
                    <p className="text-xs text-slate-400">Recipe allocation by category.</p>
                  </div>
                  <div className="space-y-4">
                    {CATEGORY_STATS.map((stat, idx) => {
                      const count = recipes.filter(r => r.category?.name === stat.name || r.category?.slug === stat.name.toLowerCase()).length;
                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-600">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stat.color }} />
                              {stat.name}
                            </span>
                            <span>{stat.value}% ({count} bakes)</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${stat.value}%`, backgroundColor: stat.color }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl text-center text-xs text-slate-500 italic">
                    Chocolate lava recipe is currently driving 40% of traffic.
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* User Analytics Section */}
          {activeSection === 'user-analytics' && (
            <motion.div
              key="user-analytics"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">User Analytics</h1>
                  <p className="text-slate-400 font-medium mt-1">Inspect subscriber lifecycle, registration growth, and retention.</p>
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Timeframe:</span>
                  <div className="flex rounded-xl bg-slate-50 p-1">
                    {['7 Days', '30 Days', 'All Time'].map((tf) => (
                      <button key={tf} className="px-4 py-2 text-xs font-black rounded-lg hover:bg-white text-slate-600 shadow-sm transition-all">{tf}</button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slider marketing input */}
              <div className="bg-brand-pink/5 p-8 rounded-[40px] border border-brand-pink-light/30 space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-lg">Growth Modeler (Simulate Marketing Ad Spend)</h3>
                    <p className="text-slate-500 text-xs">Slide budget selector to project subscriber conversion speed.</p>
                  </div>
                  <div className="bg-brand-pink text-white px-5 py-2 rounded-2xl font-black text-xs">
                    Predicted Growth: +{(bakerySettings.marketingBudget * 1.6).toFixed(1)}% / mo
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-xs text-slate-400 font-bold font-mono">Min Spend</span>
                  <input 
                    type="range"
                    min="10"
                    max="100"
                    value={bakerySettings.marketingBudget}
                    onChange={(e) => setBakerySettings(prev => ({ ...prev, marketingBudget: Number(e.target.value) }))}
                    className="flex-grow accent-brand-pink cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 font-bold font-mono">Max Spend (${(bakerySettings.marketingBudget * 200).toLocaleString()})</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bar chart of subscriber registrations */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="font-black text-slate-800 text-lg">Daily Registrations Trend</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Signups</span>
                  </div>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ANALYTICS_DATA.slice().reverse()}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ background: '#FFF', border: '1px solid #FFEDF0', borderRadius: '16px' }}
                        />
                        <Bar dataKey="bakes" fill="#FFC0CB" radius={[8, 8, 0, 0]}>
                          {ANALYTICS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#FFB7C5' : '#FFD1DC'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Conversions KPI Card */}
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 space-y-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-slate-800 text-lg">Registration KPIs</h3>
                      <p className="text-xs text-slate-400">Calculated on premium conversions.</p>
                    </div>
                    <span className="text-emerald-500 font-black text-xs bg-emerald-50 px-3 py-1 rounded-full">+20.4%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-50 rounded-2xl">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Conversion Rate</p>
                      <p className="text-2xl font-black text-slate-800">4.5%</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Average Session</p>
                      <p className="text-2xl font-black text-slate-800">14.2m</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Retention Index</p>
                      <p className="text-2xl font-black text-slate-800">84.2%</p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl">
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">Bounce Multiplier</p>
                      <p className="text-2xl font-black text-slate-800">0.92x</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      toast.success('Simulation run recalculation finished based on budget adjust! 🍥');
                    }}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-[20px] transition-all"
                  >
                    Recalculate Projections
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Activity: Favorites Section */}
          {activeSection === 'favorites' && (
            <motion.div
              key="favorites"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Fan Favorites Board</h1>
                  <p className="text-slate-400 font-medium mt-1">Highlight and preview premium recipes that got high ratings from bakers.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.slice(0, 6).map((recipe, idx) => {
                  const sparkCount = favoriteSparks[recipe.id] || (14 + idx * 8);
                  const isSpotlight = premiumSpotlightIds.includes(recipe.id);

                  return (
                    <motion.div
                      key={recipe.id}
                      className={`bakery-card p-6 bg-white border rounded-[36px] transition-all relative overflow-hidden flex flex-col justify-between h-[360px] ${
                        isSpotlight ? 'border-brand-pink ring-2 ring-brand-pink/20 shadow-lg shadow-brand-pink/5' : 'border-slate-100 shadow-sm'
                      }`}
                    >
                      {isSpotlight && (
                        <div className="absolute top-4 right-4 bg-brand-pink text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10 flex items-center gap-1">
                          ★ Spotlight
                        </div>
                      )}

                      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                        <img 
                          src={recipe.thumbnail_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=60'} 
                          alt={recipe.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      <div>
                        <h3 className="font-black text-slate-800 text-md truncate leading-snug mb-1">{recipe.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1 mb-4">{recipe.description}</p>
                      </div>

                      <div className="flex justify-between items-center bg-slate-50 p-3.5 rounded-2xl gap-2 mt-auto">
                        <div className="flex items-center gap-1.5 text-brand-pink">
                          <Heart className="w-4 h-4 fill-brand-pink" />
                          <span className="text-xs font-black font-mono">{sparkCount} Likes</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button 
                            onClick={() => {
                              setFavoriteSparks(prev => ({ ...prev, [recipe.id]: sparkCount + 1 }));
                              toast.success(`Incremented hearts score on ${recipe.title}! ❤️🧁`);
                            }}
                            className="p-2 bg-pink-50 text-brand-pink scale-95 hover:scale-110 active:scale-95 hover:bg-brand-pink hover:text-white rounded-xl transition-all"
                            title="Sparks hearts"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              setPremiumSpotlightIds(prev => 
                                isSpotlight ? prev.filter(x => x !== recipe.id) : [...prev, recipe.id]
                              );
                              toast.info(isSpotlight ? `${recipe.title} removed from Spotlight.` : `${recipe.title} added to Spotlight! ⭐`);
                            }}
                            className={`px-3 py-2 text-[10px] font-black rounded-xl transition-all active:scale-95 ${
                              isSpotlight ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-brand-pink/5 hover:text-brand-pink'
                            }`}
                          >
                            Toggle Spotlight
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Activity: Saved Recipes Section */}
          {activeSection === 'saved' && (
            <motion.div
              key="saved"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Saved Recipes Box</h1>
                  <p className="text-slate-400 font-medium mt-1">Review recipes saved by other bakers. Target special promos to reward active savers!</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-slate-800 text-lg">Active Savers Direct Rewards</h3>
                  <p className="text-xs text-brand-pink font-bold uppercase tracking-wider">Promotional Coupons</p>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                  Encourage kitchen productivity! Click the ticket promo button below on any saved recipe to automatically generate a unique 15% discount coupon on bulk baking ingredients for all savers of that recipe.
                </p>

                {promoCodesIssued.length > 0 && (
                  <div className="p-6 bg-slate-50 rounded-[30px] border border-slate-100 space-y-3">
                    <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Active Issued Promo Codes:</p>
                    <div className="flex flex-wrap gap-2.5">
                      {promoCodesIssued.map((item, idx) => (
                        <div key={idx} className="bg-white px-4 py-2 rounded-xl text-xs font-bold border border-brand-pink-light/30 flex items-center gap-2 shadow-sm">
                          <span className="font-mono text-brand-pink font-black">{item.code}</span>
                          <span className="text-[10px] text-slate-400">({item.value} - {item.created})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.slice(0, 6).map((recipe, idx) => {
                  const savesCalculated = 12 + idx * 11;
                  return (
                    <motion.div
                      key={recipe.id}
                      className="bakery-card p-6 bg-white border border-slate-100 rounded-[36px] shadow-sm flex flex-col justify-between h-[360px]"
                    >
                      <div className="relative h-40 w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                        <img 
                          src={recipe.thumbnail_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=60'} 
                          alt={recipe.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl font-black text-[10px] text-slate-800 flex items-center gap-1 shadow-sm">
                          <Bookmark className="w-3.5 h-3.5 fill-brand-pink text-brand-pink" />
                          <span>{savesCalculated} Savers</span>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-black text-slate-800 text-md truncate mb-1">{recipe.title}</h3>
                        <p className="text-xs text-slate-400 line-clamp-1 mb-4">Category: {recipe.category?.name || 'Cakes'}</p>
                      </div>

                      <button 
                        onClick={() => {
                          const code = `BAKE_SAVE_${Math.floor(1000 + Math.random() * 9000)}`;
                          const value = recipe.title.substring(0, 10).toUpperCase();
                          setPromoCodesIssued(prev => [
                            { code, value, created: 'Just Issued 🎟️' },
                            ...prev
                          ]);
                          toast.success(`Promo coupon ${code} fired to savers of "${recipe.title}"! 🎉🎟️`);
                        }}
                        className="w-full py-3.5 bg-brand-pink/5 hover:bg-brand-pink hover:text-white text-brand-pink font-black text-xs rounded-2xl active:scale-95 transition-all text-center flex items-center justify-center gap-2 border border-brand-pink-light/30"
                      >
                        Send Promo Discount Coupon 🎟️
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Alerts / System Notifications Section */}
          {activeSection === 'notifications' && (
            <motion.div
              key="notifications"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">System Notifications</h1>
                  <p className="text-slate-400 font-medium mt-1">Audit server status indicators, moderation alerts, and community posts.</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setNotificationList(prev => prev.map(n => ({ ...n, read: true })));
                      toast.success('All sweet alerts marked as read! 🍩');
                    }}
                    className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-black text-xs transition-all active:scale-95"
                  >
                    Mark All Read
                  </button>
                  <button 
                    onClick={() => {
                      setNotificationList([]);
                      toast.info('Notification feed cleared completely 🗑️');
                    }}
                    className="px-6 py-3.5 bg-red-50 text-red-500 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all active:scale-95"
                  >
                    Clear Feed
                  </button>
                </div>
              </div>

              {/* Custom Broadcaster tool */}
              <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-lg">System-wide Global Broadcaster 📣</h3>
                  <p className="text-xs text-slate-400">Post banners instantly to every active baker logging in.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input 
                    type="text"
                    value={customBroadcastTitle}
                    onChange={(e) => setCustomBroadcastTitle(e.target.value)}
                    placeholder="Broadcast Subject (e.g. Free baking supplies!)"
                    className="p-4 bg-slate-50 focus:bg-white border focus:border-brand-pink focus:outline-none rounded-2xl text-sm transition-all"
                  />
                  <input 
                    type="text"
                    value={customBroadcastMsg}
                    onChange={(e) => setCustomBroadcastMsg(e.target.value)}
                    placeholder="Alert Message Content..."
                    className="p-4 bg-slate-50 focus:bg-white border focus:border-brand-pink focus:outline-none rounded-2xl text-sm transition-all"
                  />
                </div>
                <button 
                  onClick={() => {
                    if (!customBroadcastTitle || !customBroadcastMsg) {
                      toast.error('Broadcasting needs both subject and message body! 🍬');
                      return;
                    }
                    setNotificationList(prev => [
                      {
                        id: `n-${Date.now()}`,
                        title: `📢 ${customBroadcastTitle}`,
                        message: customBroadcastMsg,
                        time: 'Just Now',
                        type: 'info',
                        read: false
                      },
                      ...prev
                    ]);
                    toast.success('Alert transmitted system-wide successfully! 🍪🚀');
                    setCustomBroadcastTitle('');
                    setCustomBroadcastMsg('');
                  }}
                  className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black hover:bg-slate-800 transition-all active:scale-95"
                >
                  Publish Global Announcement
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {notificationList.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50, scale: 0.95 }}
                      className={`p-6 rounded-[30px] border flex items-start gap-4 transition-all relative ${
                        notif.read ? 'bg-white border-slate-100 text-slate-600' : 'bg-brand-pink/5 border-brand-pink-light/30 text-slate-800 font-medium'
                      }`}
                    >
                      <div className="p-3 bg-white rounded-2xl shadow-sm flex-shrink-0">
                        {notif.type === 'error' ? (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        ) : notif.type === 'warning' ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        )}
                      </div>

                      <div className="flex-grow space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="font-extrabold text-sm">{notif.title}</h4>
                          <span className="text-[10px] text-slate-400 font-mono font-bold">{notif.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{notif.message}</p>
                      </div>

                      <div className="flex items-center gap-2 pl-4">
                        {!notif.read && (
                          <button 
                            onClick={() => {
                              setNotificationList(prev => prev.map(x => x.id === notif.id ? { ...x, read: true } : x));
                              toast.success('Marked as read.');
                            }}
                            className="p-1 px-2.5 bg-brand-pink text-white text-[9px] font-black uppercase rounded-lg hover:scale-105 active:scale-95 transition-all"
                            title="Mark read"
                          >
                            Read
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setNotificationList(prev => prev.filter(x => x.id !== notif.id));
                            toast.success('Notification cleared.');
                          }}
                          className="p-2 text-slate-300 hover:text-red-500 rounded-xl hover:bg-red-50/50 transition-all"
                          title="Trash Alert"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  {notificationList.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-slate-100"
                    >
                       <span className="text-5xl mb-4 block">🏝️</span>
                       <h3 className="text-xl font-black text-slate-800">Clear Horizon</h3>
                       <p className="text-slate-400 text-xs mt-1">No alerts or warnings detected at the bakery today.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* System Settings Section */}
          {activeSection === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Oven Settings</h1>
                <p className="text-slate-400 font-medium mt-1">Fine-tune website features, review guidelines, and back up metadata.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Switch inputs */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm space-y-6 lg:col-span-2">
                  <h3 className="font-extrabold text-slate-800 text-lg border-b border-slate-100 pb-4">Operational Controls</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">Holiday Bakery Mode 🎄</h4>
                        <p className="text-xs text-slate-400">Puts snowflakes animations and sweet themes across the catalog frontend.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setBakerySettings(prev => ({ ...prev, holidayMode: !prev.holidayMode }));
                          toast.success('Holiday Mode Theme toggled successfully! 🎄✨');
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                          bakerySettings.holidayMode ? 'bg-brand-pink' : 'bg-slate-200'
                        }`}
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                          bakerySettings.holidayMode ? 'translate-x-6' : ''
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">Allow New Registrations</h4>
                        <p className="text-xs text-slate-400">Open signups for guest accounts. Toggle to lock onboarding.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setBakerySettings(prev => ({ ...prev, allowRegistration: !prev.allowRegistration }));
                          toast.success(`Onboarding settings adjusted: ${!bakerySettings.allowRegistration ? 'OPEN' : 'LOCKED'}`);
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                          bakerySettings.allowRegistration ? 'bg-brand-pink' : 'bg-slate-200'
                        }`}
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                          bakerySettings.allowRegistration ? 'translate-x-6' : ''
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">Require Review Moderation Approval</h4>
                        <p className="text-xs text-slate-400">All comments and ratings remain hidden until audited in this dashboard.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setBakerySettings(prev => ({ ...prev, requireReviewApproval: !prev.requireReviewApproval }));
                          toast.success('Review moderation settings written! 📑');
                        }}
                        className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${
                          bakerySettings.requireReviewApproval ? 'bg-brand-pink' : 'bg-slate-200'
                        }`}
                      >
                        <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                          bakerySettings.requireReviewApproval ? 'translate-x-6' : ''
                        }`} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">Measurement Scale</h4>
                        <p className="text-xs text-slate-400">Converts ingredients recipe displays instantly.</p>
                      </div>
                      <select 
                        value={bakerySettings.measurementUnit}
                        onChange={(e) => {
                          setBakerySettings(prev => ({ ...prev, measurementUnit: e.target.value }));
                          toast.success(`Units scaled to ${e.target.value}`);
                        }}
                        className="p-3 bg-slate-50 font-bold text-xs rounded-xl focus:outline-none border focus:border-brand-pink"
                      >
                        <option>Metric ⚖️</option>
                        <option>Imperial 🇺🇸</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Database backup trigger card */}
                <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm flex flex-col justify-between">
                  <div className="space-y-4">
                     <h3 className="font-extrabold text-slate-800 text-lg mb-2">Backups & Recovery</h3>
                     <p className="text-xs text-slate-400 leading-relaxed">
                       Save a compiled JSON metadata tree containing all your custom recipes and categories directly to local backup logs.
                     </p>

                     {isBackupSpinnerRunning && (
                       <div className="space-y-2 py-4">
                         <div className="flex justify-between text-xs font-bold text-brand-pink font-mono">
                           <span>Writing segment tables...</span>
                           <span>{backupProgress}%</span>
                         </div>
                         <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                           <div className="h-full bg-brand-pink rounded-full transition-all duration-300" style={{ width: `${backupProgress}%` }} />
                         </div>
                       </div>
                     )}
                  </div>

                  <button 
                    disabled={isBackupSpinnerRunning}
                    onClick={() => {
                      setIsBackupSpinnerRunning(true);
                      setBackupProgress(0);
                      
                      let progress = 0;
                      const interval = setInterval(() => {
                        progress += 10;
                        setBackupProgress(progress);
                        if (progress >= 100) {
                          clearInterval(interval);
                          setIsBackupSpinnerRunning(false);
                          toast.success('Database backup stream finalized! Metadata bundle sweet_bakery_log.json downloaded 💾');
                        }
                      }, 150);
                    }}
                    className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-[20px] transition-all flex items-center justify-center gap-2 mt-6"
                  >
                    <Upload className="w-4 h-4" /> Trigger Database Backup
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Secure Log Out Confirmation */}
          {activeSection === 'logout' && (
            <motion.div
              key="logout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex justify-center items-center py-24"
            >
              <div className="bg-white rounded-[50px] p-12 md:p-16 max-w-lg text-center shadow-xl border border-brand-pink-light/20 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-8xl opacity-5 blur-sm translate-y-12">🍩</div>
                <div className="inline-flex p-5 bg-red-50 text-red-500 rounded-[30px] mb-2 animate-bounce">
                  <LogOut className="w-10 h-10" />
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">Leaving the Bakery? 🍰</h2>
                  <p className="text-slate-400 leading-relaxed max-w-sm mx-auto text-sm">
                    Are you sure you want to exit your administrator session? Your ovens are currently set to perfect warmth.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    id="admin-logout-yes"
                    onClick={async () => {
                      localStorage.removeItem('sweet_treats_demo_user');
                      try {
                        await signOut();
                      } catch (err) {
                        console.warn('Signout background issue:', err);
                      }
                      toast.success('Sampai jumpa lagi, Sweetie! Berhasil keluar... 🍰✨');
                      window.location.href = '/';
                    }}
                    className="py-4 bg-red-500 hover:bg-red-600 text-white font-black text-xs rounded-[22px] shadow-lg shadow-red-500/15 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    Yes, Log Out 🍩
                  </button>
                  <button 
                    id="admin-logout-no"
                    onClick={() => {
                      setActiveSection('dashboard');
                      toast.info('Glad you stayed! Keep baking! 🧁✨');
                    }}
                    className="py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs rounded-[22px] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                  >
                    No, Cancel 🧁
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
