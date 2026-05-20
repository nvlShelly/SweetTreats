import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe, Category, Comment, Profile } from '../types';
import { MOCK_RECIPES, MOCK_CATEGORIES } from '../services/mockData';

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: 'c1',
    recipe_id: 'r1',
    user_id: 'u2',
    content: "OMG! I tried this cake for my sibling's birthday and absolutely loved it! Extremely light and fluffy. 🍓🍰",
    created_at: new Date(Date.now() - 24 * 3600 * 1000 * 3).toISOString(), // 3 days ago
    author: {
      id: 'u2',
      username: 'baking_enthusiast',
      full_name: 'Chloe Bennett',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      role: 'user',
      bio: null,
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'c2',
    recipe_id: 'r1',
    user_id: 'u3',
    content: 'The cold cream tip was a total lifesaver. My frosting came out perfect! Thank you chef! 🧁👑',
    created_at: new Date(Date.now() - 24 * 3600 * 1000 * 1).toISOString(), // 1 day ago
    author: {
      id: 'u3',
      username: 'chef_julian',
      full_name: 'Julian Vance',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=60',
      role: 'user',
      bio: null,
      updated_at: new Date().toISOString()
    }
  },
  {
    id: 'c3',
    recipe_id: 'r3',
    user_id: 'u2',
    content: 'These brownies are ridiculously fudgy. Be sure to use premium dark chocolate for the best results!',
    created_at: new Date(Date.now() - 24 * 3600 * 1000 * 2).toISOString(),
    author: {
      id: 'u2',
      username: 'baking_enthusiast',
      full_name: 'Chloe Bennett',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=60',
      role: 'user',
      bio: null,
      updated_at: new Date().toISOString()
    }
  }
];

interface RecipeContextType {
  recipes: Recipe[];
  categories: Category[];
  comments: Comment[];
  addRecipe: (recipe: Omit<Recipe, 'id' | 'created_at' | 'view_count'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  addCategory: (category: Omit<Category, 'id' | 'created_at'>) => void;
  deleteCategory: (id: string) => void;
  addComment: (recipeId: string, content: string, userProfile: Profile) => void;
  deleteComment: (commentId: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage or mocks
  useEffect(() => {
    const savedRecipes = localStorage.getItem('bakery_recipes');
    const savedCategories = localStorage.getItem('bakery_categories');
    const savedComments = localStorage.getItem('bakery_comments');

    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    } else {
      setRecipes(MOCK_RECIPES);
      localStorage.setItem('bakery_recipes', JSON.stringify(MOCK_RECIPES));
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      setCategories(MOCK_CATEGORIES);
      localStorage.setItem('bakery_categories', JSON.stringify(MOCK_CATEGORIES));
    }

    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      setComments(DEFAULT_COMMENTS);
      localStorage.setItem('bakery_comments', JSON.stringify(DEFAULT_COMMENTS));
    }

    setIsInitialized(true);
  }, []);

  // Persistence effects
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('bakery_recipes', JSON.stringify(recipes));
    }
  }, [recipes, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('bakery_categories', JSON.stringify(categories));
    }
  }, [categories, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('bakery_comments', JSON.stringify(comments));
    }
  }, [comments, isInitialized]);

  const addRecipe = (newRecipe: Omit<Recipe, 'id' | 'created_at' | 'view_count'>) => {
    const recipeWithId: Recipe = {
      ...newRecipe,
      id: `r${Date.now()}`,
      created_at: new Date().toISOString(),
      view_count: 0,
      category: categories.find(c => c.id === newRecipe.category_id)
    };
    setRecipes(prev => [recipeWithId, ...prev]);
  };

  const updateRecipe = (id: string, updates: Partial<Recipe>) => {
    setRecipes(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, ...updates };
        if (updates.category_id) {
          updated.category = categories.find(c => c.id === updates.category_id);
        }
        return updated;
      }
      return r;
    }));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id' | 'created_at'>) => {
    const newCat: Category = {
      ...category,
      id: `${Date.now()}`,
      created_at: new Date().toISOString()
    };
    setCategories(prev => [...prev, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };

  const addComment = (recipeId: string, content: string, userProfile: Profile) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      recipe_id: recipeId,
      user_id: userProfile.id,
      content,
      created_at: new Date().toISOString(),
      author: userProfile
    };
    setComments(prev => [newComment, ...prev]);
  };

  const deleteComment = (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
  };

  return (
    <RecipeContext.Provider value={{ 
      recipes, 
      categories, 
      comments,
      addRecipe, 
      updateRecipe, 
      deleteRecipe,
      updateCategory,
      addCategory,
      deleteCategory,
      addComment,
      deleteComment
    }}>
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipes = () => {
  const context = useContext(RecipeContext);
  if (!context) throw new Error('useRecipes must be used within RecipeProvider');
  return context;
};
