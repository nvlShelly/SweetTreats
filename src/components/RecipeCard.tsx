import { motion } from 'motion/react';
import { Heart, Clock, Star, ChevronRight, Bookmark, Share2, Printer } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Recipe } from '../types';
import { toast } from 'sonner';

interface RecipeCardProps {
  recipe: Recipe;
  index?: number;
  isLiked?: boolean;
  isSaved?: boolean;
  onLike?: (id: string) => void;
  onSave?: (id: string) => void;
}

export default function RecipeCard({ recipe, index = 0, isLiked, isSaved, onLike, onSave }: RecipeCardProps) {
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = `${window.location.origin}/recipe/${recipe.slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link copied to clipboard! 📋');
  };

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bakery-card group overflow-hidden bg-white hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <Link to={`/recipe/${recipe.slug}`} className="block h-full w-full">
          <img 
            src={recipe.thumbnail_url || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=60'} 
            alt={recipe.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
            <span className="text-white font-medium flex items-center gap-2">
              View Recipe <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </Link>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={(e) => { e.preventDefault(); onSave?.(recipe.id); }}
            title="Save Recipe"
            className={`p-2.5 rounded-2xl backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 border ${isSaved ? 'bg-indigo-500 text-white border-indigo-400' : 'bg-white/90 text-slate-400 border-slate-100'}`}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); onLike?.(recipe.id); }}
            title="Like Recipe"
            className={`p-2.5 rounded-2xl backdrop-blur-md shadow-lg transition-all hover:scale-110 active:scale-95 border ${isLiked ? 'bg-red-500 text-white border-red-400' : 'bg-white/90 text-slate-400 border-slate-100'}`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>
          <button 
            onClick={handleShare}
            title="Share"
            className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md text-slate-400 border border-slate-100 shadow-lg transition-all hover:scale-110 active:scale-95 hover:text-brand-pink"
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button 
            onClick={handlePrint}
            title="Print"
            className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md text-slate-400 border border-slate-100 shadow-lg transition-all hover:scale-110 active:scale-95 hover:text-brand-pink"
          >
            <Printer className="w-5 h-5" />
          </button>
        </div>
        
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-brand-pink text-white text-xs font-bold rounded-full shadow-sm">
            {recipe.category?.name || 'Cake'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3.5 h-3.5 fill-current ${i < 4 ? '' : 'text-slate-200'}`} />
            ))}
          </div>
          <span className="text-xs text-slate-400 font-medium">(4.8)</span>
        </div>
        
        <Link to={`/recipe/${recipe.slug}`}>
          <h3 className="text-xl font-bold text-slate-800 mb-2 truncate group-hover:text-brand-pink transition-colors">
            {recipe.title}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-3">
            <img 
              src={recipe.author?.avatar_url || `https://ui-avatars.com/api/?name=${recipe.author?.full_name || 'Chef'}&background=FFB7C5&color=fff`} 
              className="w-6 h-6 rounded-full border border-brand-pink-light"
              alt="Author"
            />
            <span className="text-xs font-medium text-slate-500">{recipe.author?.full_name || 'Home Chef'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{recipe.cooking_time}m</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
