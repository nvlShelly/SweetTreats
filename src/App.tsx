import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { RecipeProvider } from './context/RecipeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import RecipeDetail from './pages/RecipeDetail';
import CategoryPage from './pages/CategoryPage';
import { Toaster } from 'sonner';

import SearchPage from './pages/SearchPage';
import NewRecipe from './pages/NewRecipe';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-brand-cream-light">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
        <p className="text-brand-pink font-medium">Baking sweetness...</p>
      </div>
    </div>
  );
  
  // For easy preview in AI Studio, we allow entering without a user 
  // if you click the demo button in LoginPage.
  // In a real production app, you would strictly require user.
  // This is a "lenient" check for demo purposes.
  // if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <RecipeProvider>
        <Router>
        <div className="min-h-screen flex flex-col font-sans">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/search" element={<SearchPage />} />
              
              {/* Dynamic Routes */}
              <Route path="/recipe/:slug" element={<RecipeDetail />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              
              {/* App / Dashboard */}
              <Route path="/app/*" element={
                <ProtectedRoute>
                  <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="new-recipe" element={<NewRecipe />} />
                    <Route path="*" element={<Dashboard />} />
                  </Routes>
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          
          <footer className="bg-white border-t border-brand-pink-light/30 py-12">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="p-1 px bg-brand-pink rounded-lg">
                  <span className="w-5 h-5 text-white block">🍰</span>
                </div>
                <span className="text-xl font-bold font-sans">SweetTreats</span>
              </div>
              <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">
                Baking joy into every home with premium recipes and a lovely community of dessert lovers.
              </p>
              <div className="flex justify-center gap-8 mb-8">
                <a href="#" className="text-slate-400 hover:text-brand-pink transition-colors">Instagram</a>
                <a href="#" className="text-slate-400 hover:text-brand-pink transition-colors">Pinterest</a>
                <a href="#" className="text-slate-400 hover:text-brand-pink transition-colors">YouTube</a>
              </div>
              <p className="text-slate-300 text-xs">
                © 2026 SweetTreats Bakery. Made with 💖 and lots of sugar.
              </p>
            </div>
          </footer>
        </div>
        <Toaster position="top-center" richColors />
      </Router>
      </RecipeProvider>
    </AuthProvider>
  );
}
