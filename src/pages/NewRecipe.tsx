import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Plus, X, Upload, Info, Image as ImageIcon, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function NewRecipe() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [steps, setSteps] = useState<string[]>(['']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success('Recipe submitted for review! 🧁');
      setLoading(false);
      navigate('/app');
    }, 1500);
  };

  const addIngredient = () => setIngredients([...ingredients, '']);
  const removeIngredient = (index: number) => setIngredients(ingredients.filter((_, i) => i !== index));
  
  const addStep = () => setSteps([...steps, '']);
  const removeStep = (index: number) => setSteps(steps.filter((_, i) => i !== index));

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-800 mb-4">Share Your Secret Recipe</h1>
        <p className="text-slate-400">Fill in the details below to share your creation with our community.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12 pb-24">
        {/* Basic Info */}
        <section className="bakery-card p-10 bg-white">
          <h2 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-50 pb-4">Basic Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 block">Recipe Title</label>
              <input required placeholder="Strawberry Dream Cake" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-pink outline-none transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-600 block">Category</label>
              <select className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-pink outline-none transition-all">
                <option>Cake</option>
                <option>Cupcake</option>
                <option>Brownies</option>
                <option>Others</option>
              </select>
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold text-slate-600 block">Short Description</label>
              <textarea rows={3} placeholder="Tell us a bit about this delightful treat..." className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-pink outline-none transition-all resize-none" />
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="bakery-card p-10 bg-white">
          <h2 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-50 pb-4">Recipe Media</h2>
          <div className="grid md:grid-cols-2 gap-8">
             <div className="border-4 border-dashed border-brand-pink-light/30 rounded-[40px] p-12 text-center flex flex-col items-center group cursor-pointer hover:bg-brand-pink/5 hover:border-brand-pink transition-all">
                <div className="w-20 h-20 bg-brand-pink-light/30 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Upload className="w-10 h-10 text-brand-pink" />
                </div>
                <h4 className="font-bold text-slate-800 mb-2">Upload Thumbnail</h4>
                <p className="text-xs text-slate-400">Drag and drop or click to upload (PNG, JPG max 5MB)</p>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-600 block">Video Tutorial URL (Optional)</label>
                  <input placeholder="YouTube link" className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-pink outline-none transition-all" />
                </div>
                <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex gap-4">
                  <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                  <p className="text-[10px] text-indigo-600 leading-relaxed font-medium">
                    Pro Tip: Recipes with high-quality photos and video tutorials get 5x more views from our community members!
                  </p>
                </div>
             </div>
          </div>
        </section>

        {/* Ingredients & Steps */}
        <div className="grid md:grid-cols-2 gap-12">
          {/* Ingredients */}
          <section className="space-y-6">
             <div className="flex justify-between items-center px-2">
               <h2 className="text-2xl font-bold text-slate-800">Ingredients</h2>
               <button type="button" onClick={addIngredient} className="p-2 bg-brand-pink text-white rounded-lg hover:scale-110 transition-transform shadow-md">
                 <Plus className="w-4 h-4" />
               </button>
             </div>
             <div className="space-y-4">
               {ingredients.map((_, i) => (
                 <div key={i} className="flex gap-3 group">
                   <input 
                      placeholder={`Ingredient ${i + 1}`} 
                      className="flex-grow px-5 py-3 rounded-xl bg-white shadow-sm border border-slate-100 focus:border-brand-pink outline-none transition-all" 
                   />
                   <button 
                    type="button" 
                    onClick={() => removeIngredient(i)}
                    className="p-3 text-slate-300 hover:text-red-500 transition-colors"
                  >
                     <X className="w-5 h-5" />
                   </button>
                 </div>
               ))}
             </div>
          </section>

          {/* Steps */}
          <section className="space-y-6">
             <div className="flex justify-between items-center px-2">
               <h2 className="text-2xl font-bold text-slate-800">Baking Steps</h2>
               <button type="button" onClick={addStep} className="p-2 bg-brand-pink text-white rounded-lg hover:scale-110 transition-transform shadow-md">
                 <Plus className="w-4 h-4" />
               </button>
             </div>
             <div className="space-y-6">
               {steps.map((_, i) => (
                 <div key={i} className="flex gap-4 group">
                   <div className="shrink-0 w-10 h-10 rounded-full bg-brand-pink/10 border border-brand-pink-light/30 flex items-center justify-center text-brand-pink font-bold text-sm">
                     {i + 1}
                   </div>
                   <div className="flex-grow space-y-2">
                     <textarea 
                        rows={2}
                        placeholder={`Explain step ${i + 1}...`} 
                        className="w-full px-5 py-3 rounded-xl bg-white shadow-sm border border-slate-100 focus:border-brand-pink outline-none transition-all resize-none" 
                     />
                     <button 
                      type="button" 
                      onClick={() => removeStep(i)}
                      className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
                    >
                       Remove step
                     </button>
                   </div>
                 </div>
               ))}
             </div>
          </section>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-center pt-12">
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary !px-20 !py-6 text-xl shadow-2xl shadow-brand-pink/20"
          >
            {loading ? 'Submitting...' : 'Whisk & Upload Recipe'}
          </button>
        </div>
      </form>
    </div>
  );
}
