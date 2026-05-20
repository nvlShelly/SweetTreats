import { useParams, Link } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { useAuth } from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';
import { motion } from 'motion/react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function CategoryPage() {
  const { slug } = useParams();
  const { recipes: allRecipes, categories } = useRecipes();
  const { profile } = useAuth();

  // Refine filter states
  const [quickBakesOnly, setQuickBakesOnly] = useState(false);
  const [beginnerFriendlyOnly, setBeginnerFriendlyOnly] = useState(false);

  // Like and Save states
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    const userId = profile?.id || 'guest';
    const liked = localStorage.getItem(`sweet_treats_liked_${userId}`);
    setLikedIds(liked ? JSON.parse(liked) : []);

    const saved = localStorage.getItem(`sweet_treats_saved_${userId}`);
    setSavedIds(saved ? JSON.parse(saved) : []);
  }, [profile?.id]);

  const handleLike = (id: string) => {
    const userId = profile?.id || 'guest';
    const isLiked = likedIds.includes(id);
    const updated = isLiked ? likedIds.filter(x => x !== id) : [...likedIds, id];
    setLikedIds(updated);
    localStorage.setItem(`sweet_treats_liked_${userId}`, JSON.stringify(updated));
    toast.success(isLiked ? 'Removed from favorites 🍩' : 'Added to favorites! 💖');
  };

  const handleSave = (id: string) => {
    const userId = profile?.id || 'guest';
    const isSaved = savedIds.includes(id);
    const updated = isSaved ? savedIds.filter(x => x !== id) : [...savedIds, id];
    setSavedIds(updated);
    localStorage.setItem(`sweet_treats_saved_${userId}`, JSON.stringify(updated));
    toast.success(isSaved ? 'Removed from bookmark list' : 'Saved to Recipe Box! 🧁');
  };
  
  const category = categories.find(c => c.slug === slug);
  
  // 1. Filter by category slug
  let recipes = allRecipes.filter(r => r.category?.slug === slug || slug === 'all' || r.category_id === category?.id);

  // 2. Filter by Quick Bakes (cooking_time <= 30 mins)
  if (quickBakesOnly) {
    recipes = recipes.filter(r => r.cooking_time <= 30);
  }

  // 3. Filter by Beginner Friendly (difficulty === 'Easy')
  if (beginnerFriendlyOnly) {
    recipes = recipes.filter(r => r.difficulty?.toLowerCase() === 'easy');
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Category Header */}
      <div className="bg-white rounded-[50px] p-12 md:p-20 text-center mb-16 shadow-sm border border-brand-pink-light/20 relative overflow-hidden">
        <div className="absolute top-0 left-0 p-8 text-8xl opacity-10 blur-sm -rotate-12 translate-y-12">
          {category?.icon || '🍰'}
        </div>
        <div className="absolute bottom-0 right-0 p-8 text-8xl opacity-10 blur-sm rotate-12 -translate-y-12">
          {category?.icon || '🧁'}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <div className="inline-block p-4 bg-brand-pink-light/30 rounded-3xl mb-6">
            <span className="text-5xl">{category?.icon || '🍰'}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">
            {category?.name || 'All Recipes'}
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
            {category?.description || 'Browse our complete collection of delightful dessert recipes.'}
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Filter Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="sticky top-32 space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-brand-pink" />
                <h3 className="font-bold text-slate-800 uppercase tracking-widest text-xs">Categories</h3>
              </div>
              <div className="flex flex-col gap-2">
                <Link 
                  to="/category/all" 
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${slug === 'all' ? 'bg-brand-pink text-white' : 'text-slate-500 hover:bg-white'}`}
                >
                  All Recipes
                </Link>
                {categories.map(cat => (
                  <Link 
                    key={cat.id}
                    to={`/category/${cat.slug}`}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${slug === cat.slug ? 'bg-brand-pink text-white' : 'text-slate-500 hover:bg-white'}`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-6 bg-brand-pink/5 rounded-3xl border border-brand-pink-light/30">
               <div className="flex items-center gap-2 mb-4">
                 <SlidersHorizontal className="w-4 h-4 text-brand-pink" />
                 <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Refine</span>
               </div>
               <div className="space-y-4">
                 <label className="flex items-center gap-3 cursor-pointer group">
                   <input 
                     type="checkbox"
                     checked={quickBakesOnly}
                     onChange={(e) => setQuickBakesOnly(e.target.checked)}
                     className="w-4 h-4 text-brand-pink rounded border-brand-pink-light focus:ring-brand-pink text-sm cursor-pointer accent-brand-pink"
                   />
                   <span className="text-sm font-medium text-slate-600 group-hover:text-brand-pink transition-colors">Quick Bakes (≤30m)</span>
                 </label>
                 <label className="flex items-center gap-3 cursor-pointer group">
                   <input
                     type="checkbox"
                     checked={beginnerFriendlyOnly}
                     onChange={(e) => setBeginnerFriendlyOnly(e.target.checked)}
                     className="w-4 h-4 text-brand-pink rounded border-brand-pink-light focus:ring-brand-pink text-sm cursor-pointer accent-brand-pink"
                   />
                   <span className="text-sm font-medium text-slate-600 group-hover:text-brand-pink transition-colors">Beginner Friendly</span>
                 </label>
               </div>
            </div>
          </div>
        </aside>

        {/* Recipe Grid */}
        <div className="flex-grow">
          {recipes.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((recipe, i) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  index={i} 
                  isLiked={likedIds.includes(recipe.id)}
                  isSaved={savedIds.includes(recipe.id)}
                  onLike={handleLike}
                  onSave={handleSave}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[40px] p-20 text-center border-2 border-dashed border-slate-100 shadow-sm">
               <div className="text-6xl mb-6">🍰</div>
               <h3 className="text-2xl font-bold text-slate-800 mb-2">No Recipes Found</h3>
               <p className="text-slate-400">Try loosening your refine filters or look in another sweet category!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
