import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Heart, ArrowRight, Star, Play } from 'lucide-react';
import { useRecipes } from '../context/RecipeContext';
import { useAuth } from '../hooks/useAuth';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function LandingPage() {
  const { recipes, categories } = useRecipes();
  const { profile } = useAuth();
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
  
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-pink/5 rounded-bl-[100px] -z-10 hidden lg:block" />
        
        <div className="max-w-7xl mx-auto px-4 w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-pink-light/50 text-brand-pink-dark rounded-full mb-6 font-semibold text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-pink"></span>
              </span>
              New: Premium Baking Course Out Now!
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold font-sans text-slate-800 leading-[1.1] mb-6">
              Bake Your <span className="text-gradient">Sweetest</span> Dreams into Reality
            </h1>
            
            <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
              Discover over 1,000+ premium dessert recipes from world-class bakers. Beautiful, easy to follow, and absolutely delicious.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="btn-primary flex items-center gap-2 group text-lg !px-10 !py-4 shadow-xl">
                Start Baking <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/app" className="btn-secondary flex items-center gap-2 text-lg !px-10 !py-4">
                <Play className="w-5 h-5 fill-current" /> Watch Tutorials
              </Link>
            </div>

            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map((i) => (
                  <img 
                    key={i}
                    src={`https://ui-avatars.com/api/?name=User${i}&background=random&color=fff`} 
                    className="w-12 h-12 rounded-full border-4 border-white shadow-sm"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-bold text-slate-800">4.9</span>
                </div>
                <p className="text-sm text-slate-400">Trusted by 10k+ bakers</p>
              </div>
            </div>
          </motion.div>

          {/* Hero Image / Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative z-10 w-full aspect-square rounded-[60px] overflow-hidden shadow-2xl border-[12px] border-white">
              <img 
                src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=1200&auto=format&fit=crop&q=80" 
                alt="Premium Cake"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Accents */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 p-6 bg-white rounded-3xl shadow-xl z-20 flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                <Heart className="text-green-500 fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">New Favorite!</p>
                <p className="text-xs text-slate-400">Matcha Mochi Cake</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-6 -left-10 p-6 bg-white rounded-3xl shadow-xl z-20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-pink" />
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Live Now</span>
              </div>
              <p className="text-sm font-bold text-slate-800">Community Baking Session</p>
              <p className="text-xs text-brand-pink">2.4k watching</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white/50 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Popular Categories</h2>
              <p className="text-slate-400">Find exactly what you crave today.</p>
            </div>
            <Link to="/category/all" className="text-brand-pink font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((cat, i) => (
              <Link key={cat.id} to={`/category/${cat.slug}`} className="block">
                <motion.div
                  whileHover={{ y: -10 }}
                  className="bg-white p-8 rounded-3xl text-center shadow-sm border border-brand-pink/10 hover:shadow-xl hover:border-brand-pink transition-all flex flex-col items-center group cursor-pointer h-full"
                >
                  <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="font-bold text-slate-800">{cat.name}</h3>
                  <p className="text-xs text-slate-400 mt-2">{cat.description}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Recipes */}
      <section className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Trending Recipes</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
            These recipes are being baked right now all around the world. Join the sweetness and share your results!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recipes.slice(0, 8).map((recipe, i) => (
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

        <div className="mt-16 text-center">
          <Link to="/app" className="btn-secondary !px-12 !py-4 text-lg">
            Browse All Recipes
          </Link>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto gradient-pink rounded-[50px] p-12 md:p-20 relative overflow-hidden text-center text-white">
          <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-96 h-96 bg-black/10 rounded-full blur-3xl opacity-50" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Want Weekly Baking Tips?</h2>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Join 5,000+ happy bakers and get our secret recipes and tips delivered straight to your inbox.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-grow px-8 py-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:bg-white/30 transition-all"
            />
            <button className="bg-white text-brand-pink font-bold px-8 py-4 rounded-full hover:shadow-2xl hover:scale-105 active:scale-95 transition-all">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
