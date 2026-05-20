import { useParams, Link } from 'react-router-dom';
import { useRecipes } from '../context/RecipeContext';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Users, Star, ChefHat, Heart, Share2, Printer, CheckCircle2, PlayCircle, MessageSquare, Send, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function RecipeDetail() {
  const { slug } = useParams();
  const { recipes: allRecipes, comments, addComment, deleteComment } = useRecipes();
  const { profile } = useAuth();
  const [commentContent, setCommentContent] = useState('');
  
  const recipe = allRecipes.find(r => r.slug === slug) || allRecipes[0];

  const [likedIds, setLikedIds] = useState<string[]>([]);

  // Update lists when the logged-in profile changes
  useEffect(() => {
    const userId = profile?.id || 'guest';
    const liked = localStorage.getItem(`sweet_treats_liked_${userId}`);
    setLikedIds(liked ? JSON.parse(liked) : []);
  }, [profile?.id]);

  const isFavorite = likedIds.includes(recipe.id);

  const handleFavorite = () => {
    const userId = profile?.id || 'guest';
    const updated = isFavorite 
      ? likedIds.filter(id => id !== recipe.id) 
      : [...likedIds, recipe.id];
    setLikedIds(updated);
    localStorage.setItem(`sweet_treats_liked_${userId}`, JSON.stringify(updated));
    toast.success(isFavorite ? 'Removed from favorites 🍩' : 'Added to favorites! 💖');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Pop-up blocked! Please allow pop-ups to print the recipe. 🖨️');
      return;
    }

    const escapeHtml = (str: string | null | undefined): string => {
      if (!str) return '';
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const ingredientsHtml = recipe.ingredients && recipe.ingredients.length > 0
      ? recipe.ingredients.map(ing => `<li>${escapeHtml(ing)}</li>`).join('')
      : '<li>No ingredients listed</li>';

    const stepsHtml = recipe.steps && recipe.steps.length > 0
      ? recipe.steps.map((step, idx) => `
          <div class="step">
            <span class="step-num">${idx + 1}</span>
            <p>${escapeHtml(step)}</p>
          </div>
        `).join('')
      : '<p>No steps listed</p>';

    const thumbnailHtml = recipe.thumbnail_url 
      ? `<img src="${recipe.thumbnail_url}" alt="${escapeHtml(recipe.title)}" class="hero-image" />`
      : '';

    const tipsHtml = recipe.tips 
      ? `<div class="section tips-section">
          <h2>Chef's Tips & Tricks</h2>
          <p>${escapeHtml(recipe.tips)}</p>
         </div>`
      : '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bake Recipe - ${escapeHtml(recipe.title)}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            
            body {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              color: #1e293b;
              line-height: 1.6;
              padding: 40px;
              max-width: 800px;
              margin: 0 auto;
              background-color: #ffffff;
            }
            @media print {
              body {
                padding: 0;
                max-width: 100%;
              }
              .no-print {
                display: none !important;
              }
              button.print-btn {
                display: none !important;
              }
            }
            .header-container {
              border-bottom: 2px solid #f1f5f9;
              padding-bottom: 24px;
              margin-bottom: 30px;
            }
            .category {
              display: inline-block;
              background-color: #ffe4e6;
              color: #db2777;
              font-size: 11px;
              font-weight: 800;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              padding: 6px 16px;
              border-radius: 9999px;
              margin-bottom: 12px;
            }
            h1 {
              font-size: 32px;
              font-weight: 800;
              color: #0f172a;
              margin: 0 0 12px 0;
              letter-spacing: -0.025em;
            }
            .description {
              font-size: 16px;
              color: #64748b;
              margin: 0 0 20px 0;
            }
            .meta-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 16px;
              background-color: #f8fafc;
              padding: 16px 24px;
              border-radius: 20px;
              margin-bottom: 30px;
            }
            .meta-item {
              display: flex;
              flex-direction: column;
            }
            .meta-label {
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              color: #94a3b8;
              letter-spacing: 0.05em;
              margin-bottom: 4px;
            }
            .meta-value {
              font-size: 14px;
              font-weight: 600;
              color: #334155;
            }
            .hero-image {
              width: 100%;
              height: auto;
              max-height: 400px;
              object-fit: cover;
              border-radius: 24px;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 35px;
            }
            h2 {
              font-size: 20px;
              font-weight: 800;
              color: #0f172a;
              margin-top: 0;
              margin-bottom: 16px;
              padding-bottom: 8px;
              border-bottom: 1px solid #e2e8f0;
            }
            ul {
              margin: 0;
              padding-left: 20px;
            }
            li {
              margin-bottom: 8px;
              font-size: 15px;
            }
            .step {
              display: flex;
              gap: 16px;
              margin-bottom: 16px;
              align-items: flex-start;
            }
            .step-num {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 28px;
              height: 28px;
              background-color: #db2777;
              color: #ffffff;
              border-radius: 50%;
              font-size: 13px;
              font-weight: 800;
              flex-shrink: 0;
              margin-top: 2px;
            }
            .step p {
              margin: 0;
              font-size: 15px;
              color: #334155;
            }
            .tips-section {
              background-color: #fffbfa;
              border: 1px solid #fecdd3;
              padding: 24px;
              border-radius: 20px;
            }
            .tips-section h2 {
              border-bottom: none;
              color: #be123c;
              margin-bottom: 8px;
            }
            .tips-section p {
              margin: 0;
              font-size: 14px;
              color: #4c0519;
            }
            /* Floating Action Banner to Trigger Browser Print */
            .print-banner {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background-color: #1e293b;
              color: white;
              padding: 16px 24px;
              border-radius: 16px;
              margin-bottom: 40px;
              box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            }
            .print-btn {
              background-color: #db2777;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 10px;
              font-weight: 700;
              font-size: 14px;
              cursor: pointer;
              transition: all 0.2s;
            }
            .print-btn:hover {
              background-color: #be123c;
              transform: translateY(-1px);
            }
            .print-btn:active {
              transform: translateY(1px);
            }
            .footer {
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              margin-top: 60px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="print-banner no-print">
            <span style="font-weight: 600; font-size: 14px;">🍰 Bakery Recipe print preview is ready!</span>
            <button class="print-btn" onclick="window.print()">Print This Recipe</button>
          </div>
          
          <div class="header-container">
            <span class="category">${escapeHtml(recipe.category?.name || 'Cake')}</span>
            <h1>${escapeHtml(recipe.title)}</h1>
            <p class="description">${escapeHtml(recipe.description || '')}</p>
          </div>

          ${thumbnailHtml}

          <div class="meta-grid">
            <div class="meta-item">
              <span class="meta-label">Baking Time</span>
              <span class="meta-value">${recipe.cooking_time} mins</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Difficulty</span>
              <span class="meta-value">${escapeHtml(recipe.difficulty)}</span>
            </div>
            <div class="meta-item">
              <span class="meta-label">Created By</span>
              <span class="meta-value">${escapeHtml(recipe.author?.full_name || 'Bakery Chef')}</span>
            </div>
          </div>

          <div class="section">
            <h2>Required Ingredients</h2>
            <ul>
              ${ingredientsHtml}
            </ul>
          </div>

          <div class="section">
            <h2>Baking Steps & Instructions</h2>
            ${stepsHtml}
          </div>

          ${tipsHtml}

          <div class="footer">
            <p>Printed from AIS Bakery App • Enjoy your baking adventure!</p>
          </div>

          <script>
            // Auto start the print dialog after rendering
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    if (!profile) {
      toast.error('Please log in first to write comments!');
      return;
    }
    addComment(recipe.id, commentContent.trim(), profile);
    setCommentContent('');
    toast.success('Comment posted successfully! 🧁');
  };

  const handleDeleteComment = (commentId: string) => {
    deleteComment(commentId);
    toast.success('Comment deleted.');
  };

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffTime < 60 * 1000) {
      return 'Just now';
    }
    const diffMinutes = Math.floor(diffTime / (60 * 1000));
    if (diffMinutes < 60) {
      return `${diffMinutes} mins ago`;
    }
    const diffHours = Math.floor(diffTime / (60 * 60 * 1000));
    if (diffHours < 24) {
      return `${diffHours} hours ago`;
    }
    if (diffDays === 1) {
      return 'Yesterday';
    }
    if (diffDays < 7) {
      return `${diffDays} days ago`;
    }
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const recipeComments = comments.filter(c => c.recipe_id === recipe.id);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-8">
        <Link to="/" className="hover:text-brand-pink transition-colors">Home</Link>
        <span>/</span>
        <Link to={`/category/${recipe.category?.slug}`} className="hover:text-brand-pink transition-colors">{recipe.category?.name}</Link>
        <span>/</span>
        <span className="text-slate-800">{recipe.title}</span>
      </nav>

      <div className="grid lg:grid-cols-[1fr_400px] gap-12">
        {/* Main Content */}
        <article>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-4">{recipe.title}</h1>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <img 
                      src={recipe.author?.avatar_url || ''} 
                      className="w-10 h-10 rounded-full border-2 border-brand-pink-light"
                      alt={recipe.author?.full_name || ''}
                    />
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Recipe by</p>
                      <p className="text-sm font-bold text-slate-800">{recipe.author?.full_name}</p>
                    </div>
                  </div>
                  <div className="h-10 w-px bg-slate-100"></div>
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                    </div>
                    <span className="text-sm font-bold text-slate-800">(4.9)</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleFavorite}
                  className={`p-4 rounded-2xl border-2 transition-all hover:scale-105 active:scale-95 shadow-sm hover:shadow-md ${isFavorite ? 'bg-red-50 border-red-100 text-red-500' : 'bg-white border-slate-100 text-slate-400 hover:border-brand-pink hover:text-brand-pink'}`}
                >
                  <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleShare}
                  className="p-4 bg-white rounded-2xl border-2 border-slate-100 text-slate-400 hover:border-brand-pink hover:text-brand-pink hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-md"
                >
                  <Share2 className="w-6 h-6" />
                </button>
                <button 
                  onClick={handlePrint}
                  className="p-4 bg-white rounded-2xl border-2 border-slate-100 text-slate-400 hover:border-brand-pink hover:text-brand-pink hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-md"
                >
                  <Printer className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden mb-12 shadow-2xl group">
              <img 
                src={recipe.thumbnail_url || ''} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt={recipe.title}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              {recipe.video_url && (
                <button className="absolute inset-0 flex items-center justify-center group/play">
                  <div className="w-24 h-24 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center group-hover/play:scale-110 transition-transform">
                    <PlayCircle className="w-12 h-12 text-white fill-current" />
                  </div>
                </button>
              )}
            </div>

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bakery-card p-6 text-center">
                <Clock className="w-6 h-6 text-brand-pink mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Prep Time</p>
                <p className="text-lg font-bold text-slate-800">15 mins</p>
              </div>
              <div className="bakery-card p-6 text-center">
                <Clock className="w-6 h-6 text-brand-pink mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Bake Time</p>
                <p className="text-lg font-bold text-slate-800">{recipe.cooking_time} mins</p>
              </div>
              <div className="bakery-card p-6 text-center">
                <Users className="w-6 h-6 text-brand-pink mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Servings</p>
                <p className="text-lg font-bold text-slate-800">8 Slices</p>
              </div>
              <div className="bakery-card p-6 text-center">
                <ChefHat className="w-6 h-6 text-brand-pink mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Difficulty</p>
                <p className="text-lg font-bold text-slate-800">{recipe.difficulty}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">Description</h2>
              <div className="prose prose-pink max-w-none text-slate-500 leading-relaxed">
                <ReactMarkdown>{recipe.description || ''}</ReactMarkdown>
              </div>
            </div>

            {/* Steps */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-slate-800 mb-8 border-b-2 border-brand-pink-light pb-4 inline-block">Baking Instructions</h2>
              <div className="space-y-8">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-6 items-start group">
                    <div className="shrink-0 w-12 h-12 bg-white border-2 border-brand-pink-light text-brand-pink rounded-full flex items-center justify-center font-bold text-xl shadow-sm group-hover:bg-brand-pink group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <div className="flex-grow pt-2">
                      <p className="text-slate-600 leading-relaxed text-lg">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips Section */}
            {recipe.tips && (
              <div className="bg-brand-pink/5 border border-brand-pink-light/30 rounded-[40px] p-10 mb-12">
                <div className="flex items-center gap-3 mb-4">
                  <Star className="w-6 h-6 text-brand-pink fill-current" />
                  <h3 className="text-xl font-bold text-brand-pink-dark uppercase tracking-wide">Expert Tips</h3>
                </div>
                <p className="text-slate-600 leading-relaxed italic">{recipe.tips}</p>
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-16 border-t border-slate-100 pt-12">
              <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-8 h-8 text-brand-pink animate-pulse" />
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight font-sans">
                  Baker Discussions <span className="text-brand-pink">({recipeComments.length})</span>
                </h2>
              </div>

              {/* Leave a Comment Form */}
              {profile ? (
                <form onSubmit={handlePostComment} className="mb-10 p-6 bg-brand-cream/10 rounded-[30px] border border-brand-pink-light/20 shadow-sm">
                  <div className="flex gap-4 items-start">
                    <img 
                      src={profile.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'} 
                      className="w-12 h-12 rounded-full border-2 border-brand-pink-light flex-shrink-0 object-cover"
                      alt={profile.full_name || 'Your Avatar'}
                    />
                    <div className="flex-grow space-y-4">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{profile.full_name || profile.username || 'Anonymous Baker'}</p>
                        <p className="text-xs text-slate-400 font-medium font-mono uppercase tracking-wider">Posting review as {profile.role}</p>
                      </div>
                      <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="Share your baking details, tips or thoughts about this recipe... 🍩"
                        rows={3}
                        className="w-full bg-white rounded-[20px] px-5 py-4 border border-slate-200 focus:border-brand-pink focus:ring-1 focus:ring-brand-pink outline-none transition-all placeholder:text-slate-300 resize-none text-slate-700 text-base font-sans"
                      />
                      <div className="flex justify-end">
                        <button
                          type="submit"
                          disabled={!commentContent.trim()}
                          className="px-6 py-3 bg-brand-pink hover:bg-brand-pink-dark text-white font-bold rounded-2xl flex items-center gap-2 active:scale-95 transition-all shadow-md shadow-brand-pink/20 hover:shadow-lg hover:shadow-brand-pink/30 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>Post Comment 🧁</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="mb-10 p-8 rounded-[30px] bg-brand-cream/50 border border-brand-pink-light/30 text-center shadow-inner">
                  <p className="text-slate-600 font-medium mb-4">Logged-in bakers can leave reviews and comments on recipes! 🥯</p>
                  <Link 
                    to="/login" 
                    className="inline-block px-8 py-3.5 bg-brand-pink hover:bg-brand-pink-dark text-white font-bold rounded-2xl shadow-xl shadow-brand-pink/15 hover:scale-105 active:scale-95 transition-all"
                  >
                    Go to Baker Profile to Login
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                <AnimatePresence initial={false}>
                  {recipeComments.length > 0 ? (
                    recipeComments.map((comment) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="p-6 bg-white rounded-[24px] border border-slate-100 shadow-sm flex gap-4 items-start hover:shadow-md transition-shadow group relative"
                      >
                        <img 
                          src={comment.author?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=60'} 
                          className="w-12 h-12 rounded-full border border-slate-100 object-cover flex-shrink-0"
                          alt={comment.author?.full_name || 'Baker'}
                        />
                        <div className="flex-grow space-y-2 pr-8">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-slate-800 text-sm font-sans">{comment.author?.full_name || 'Anonymous Baker'}</span>
                            {comment.author?.role === 'admin' ? (
                              <span className="px-2 py-0.5 bg-brand-pink/10 text-brand-pink-dark rounded-full text-[10px] font-black uppercase tracking-wider font-mono">Admin</span>
                            ) : comment.user_id === recipe.author_id ? (
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-wider font-mono">Chef</span>
                            ) : null}
                            <span className="text-slate-300">•</span>
                            <span className="text-xs font-mono text-slate-400">{formatDate(comment.created_at)}</span>
                          </div>
                          <p className="text-slate-600 text-base leading-relaxed whitespace-pre-wrap font-sans">{comment.content}</p>
                        </div>

                        {/* Delete Button for Author or Admin */}
                        {(profile && (profile.id === comment.user_id || profile.role === 'admin')) && (
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            title="Delete comment"
                            className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 duration-150 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-[30px] bg-slate-50/50">
                      <p className="text-slate-400 font-medium font-mono">Be the first to share your pastry masterpiece or ask a baking question! 🥖🧁</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* Ingredients Card */}
          <div className="sticky top-32">
            <div className="bakery-card p-10 bg-brand-cream border-2 border-brand-pink-light/30">
              <h2 className="text-2xl font-bold text-slate-800 mb-8">Ingredients</h2>
              <ul className="space-y-4">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                    <div className="p-1 bg-white rounded-full">
                      <CheckCircle2 className="w-4 h-4 text-brand-pink" />
                    </div>
                    {ing}
                  </li>
                ))}
              </ul>
              <button className="btn-primary w-full mt-10">Add to Shopping List</button>
            </div>

            {/* Similar Recipes */}
            <div className="mt-12">
              <h2 className="text-xl font-bold text-slate-800 mb-6">You Might Also Love</h2>
              <div className="space-y-6">
                {allRecipes.slice(0, 4).filter(r => r.id !== recipe.id).map(r => (
                  <Link to={`/recipe/${r.slug}`} key={r.id} className="flex gap-4 items-center group">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <img src={r.thumbnail_url || ''} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-brand-pink transition-colors line-clamp-1">{r.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{r.cooking_time} mins • {r.difficulty}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
