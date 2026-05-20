import { useState, useEffect } from 'react';
import { useRecipes } from '../context/RecipeContext';
import { useAuth } from '../hooks/useAuth';
import { Search as SearchIcon, X, Filter } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

export default function SearchPage() {
  const { recipes } = useRecipes();
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  
  // Tag filter selection
  const [activeTag, setActiveTag] = useState<string | null>(null);

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

  // Compute live search results based on query & active tag
  const results = recipes.filter(r => {
    const queryLower = query.toLowerCase().trim();
    const titleMatch = r.title.toLowerCase().includes(queryLower);
    const descMatch = r.description?.toLowerCase().includes(queryLower) || false;
    const ingredientMatch = r.ingredients?.some(ing => ing.toLowerCase().includes(queryLower)) || false;
    
    const queryMatch = !queryLower || (titleMatch || descMatch || ingredientMatch);

    // Tag match if activeTag is set
    let tagMatch = true;
    if (activeTag) {
      if (activeTag === 'Chocolate') {
        tagMatch = r.title.toLowerCase().includes('choco') || r.ingredients?.some(i => i.toLowerCase().includes('chocolate') || i.toLowerCase().includes('cocoa')) || false;
      } else if (activeTag === 'Strawberry') {
        tagMatch = r.title.toLowerCase().includes('strawberry') || r.ingredients?.some(i => i.toLowerCase().includes('strawberry')) || false;
      } else if (activeTag === 'Low Sugar') {
        tagMatch = r.description?.toLowerCase().includes('low sugar') || r.tips?.toLowerCase().includes('sugar') || false;
      } else if (activeTag === 'Gluten Free') {
        tagMatch = r.description?.toLowerCase().includes('gluten') || r.tips?.toLowerCase().includes('gluten') || false;
      } else if (activeTag === 'Quick') {
        tagMatch = r.cooking_time <= 30;
      }
    }

    return queryMatch && tagMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">What are we baking today?</h1>
        
        <div className="relative group">
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-brand-pink transition-colors" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for cakes, cookies, ingredients..."
            className="w-full pl-16 pr-16 py-6 rounded-[30px] bg-white shadow-xl shadow-brand-pink/5 border-2 border-transparent focus:border-brand-pink focus:outline-none text-xl transition-all"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-widest mr-2 py-2">Quick Picks:</span>
          {['Chocolate', 'Strawberry', 'Low Sugar', 'Gluten Free', 'Quick'].map(tag => (
            <button 
              key={tag} 
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${activeTag === tag ? 'bg-brand-pink text-white border-brand-pink' : 'bg-white text-slate-600 border-slate-100 hover:border-brand-pink hover:text-brand-pink'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <p className="text-slate-400 font-medium font-sans">
            Found {results.length} delicious {results.length === 1 ? 'match' : 'matches'}
          </p>
          {(query || activeTag) && (
            <button 
              onClick={() => { setQuery(''); setActiveTag(null); }}
              className="text-xs font-bold text-brand-pink hover:underline uppercase tracking-wider"
            >
              Clear filters
            </button>
          )}
        </div>

        <AnimatePresence mode="popLayout">
          {results.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {results.map((recipe, i) => (
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
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 bg-white rounded-[50px] border-2 border-dashed border-slate-100 shadow-sm"
            >
              <div className="text-6xl mb-6">👩‍🍳</div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">No recipes found for your selection</h2>
              <p className="text-slate-400">Maybe try searching for something else? Our cakes are waiting!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
