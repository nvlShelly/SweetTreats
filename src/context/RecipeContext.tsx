import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Recipe, Category, Comment, Profile } from '../types';
import { MOCK_RECIPES, MOCK_CATEGORIES } from '../services/mockData';
import { supabase, isDemoMode } from '../lib/supabase';

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

  // Initialize from Supabase or Fallback to localStorage/mocks
  useEffect(() => {
    const loadData = async () => {
      if (isDemoMode) {
        // Load from localStorage/mocks
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
        return;
      }

      // Real Supabase mode
      try {
        // 1. Fetch Categories
        let { data: catData, error: catError } = await supabase
          .from('categories')
          .select('*');
        
        if (catError) throw catError;

        // If categories table is completely empty, seed standard ones
        if (!catData || catData.length === 0) {
          const formattedCategories = MOCK_CATEGORIES.map(c => ({
            name: c.name,
            slug: c.slug,
            icon: c.icon,
            description: c.description
          }));
          const { data: seededCats, error: seedError } = await supabase
            .from('categories')
            .insert(formattedCategories)
            .select();
          if (!seedError && seededCats) {
            catData = seededCats;
          }
        }

        const mappedCats: Category[] = (catData || []).map((c: any) => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          icon: c.icon,
          description: c.description,
          created_at: c.created_at
        }));
        setCategories(mappedCats);

        // 2. Fetch Recipes
        let { data: recData, error: recError } = await supabase
          .from('recipes')
          .select('*');
        
        if (recError) throw recError;

        // If recipes table is completely empty, seed standard mockup recipes
        if (!recData || recData.length === 0) {
          const formattedRecipes = MOCK_RECIPES.map(r => {
            const matchedCat = mappedCats.find(c => c.slug === r.category?.slug);
            return {
              title: r.title,
              slug: r.slug,
              thumbnail_url: r.thumbnail_url,
              description: r.description,
              category_id: matchedCat?.id || null,
              ingredients: r.ingredients,
              steps: r.steps,
              cooking_time: r.cooking_time,
              difficulty: r.difficulty,
              video_url: r.video_url,
              tips: r.tips,
              is_published: r.is_published !== false,
              view_count: r.view_count || 0
            };
          });
          const { data: seededRecs, error: seedRecError } = await supabase
            .from('recipes')
            .insert(formattedRecipes)
            .select();
          if (!seedRecError && seededRecs) {
            recData = seededRecs;
          }
        }

        const mappedRecs: Recipe[] = (recData || []).map((r: any) => {
          const matchedCat = mappedCats.find(c => c.id === r.category_id);
          return {
            id: r.id,
            title: r.title,
            slug: r.slug,
            thumbnail_url: r.thumbnail_url,
            description: r.description,
            author_id: r.author_id,
            category_id: r.category_id,
            ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
            steps: Array.isArray(r.steps) ? r.steps : [],
            cooking_time: r.cooking_time,
            difficulty: r.difficulty || 'Easy',
            video_url: r.video_url,
            tips: r.tips,
            is_published: r.is_published !== false,
            view_count: r.view_count || 0,
            created_at: r.created_at,
            category: matchedCat
          };
        });
        setRecipes(mappedRecs);

        // 3. Fetch Comments
        const { data: commentData, error: commentError } = await supabase
          .from('comments')
          .select('*, profiles(*)');
        
        if (!commentError && commentData) {
          const mappedComments: Comment[] = commentData.map((c: any) => ({
            id: c.id,
            recipe_id: c.recipe_id,
            user_id: c.user_id,
            content: c.content,
            created_at: c.created_at,
            author: c.profiles ? {
              id: c.profiles.id,
              username: c.profiles.username || c.profiles.full_name?.toLowerCase().replace(/\s+/g, '_') || 'user',
              full_name: c.profiles.full_name || 'Anonymous Creator',
              avatar_url: c.profiles.avatar_url || `https://ui-avatars.com/api/?name=${c.profiles.full_name || 'U'}`,
              role: c.profiles.role || 'user',
              bio: c.profiles.bio,
              updated_at: c.profiles.updated_at
            } : {
              id: c.user_id,
              username: 'user',
              full_name: 'Anonymous Creator',
              avatar_url: `https://ui-avatars.com/api/?name=U`,
              role: 'user',
              bio: null,
              updated_at: new Date().toISOString()
            }
          }));
          setComments(mappedComments);
        } else {
          setComments(DEFAULT_COMMENTS);
        }

      } catch (err) {
        console.warn('Real Supabase load failed, falling back safely to offline storage:', err);
        const savedRecipes = localStorage.getItem('bakery_recipes');
        const savedCategories = localStorage.getItem('bakery_categories');
        const savedComments = localStorage.getItem('bakery_comments');

        if (savedRecipes) setRecipes(JSON.parse(savedRecipes));
        else setRecipes(MOCK_RECIPES);

        if (savedCategories) setCategories(JSON.parse(savedCategories));
        else setCategories(MOCK_CATEGORIES);

        if (savedComments) setComments(JSON.parse(savedComments));
        else setComments(DEFAULT_COMMENTS);
      } finally {
        setIsInitialized(true);
      }
    };

    loadData();
  }, []);

  // Save to local persistence as background cache backup
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

  const addRecipe = async (newRecipe: Omit<Recipe, 'id' | 'created_at' | 'view_count'>) => {
    if (isDemoMode) {
      const recipeWithId: Recipe = {
        ...newRecipe,
        id: `r${Date.now()}`,
        created_at: new Date().toISOString(),
        view_count: 0,
        category: categories.find(c => c.id === newRecipe.category_id)
      };
      setRecipes(prev => [recipeWithId, ...prev]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('recipes')
        .insert({
          title: newRecipe.title,
          slug: newRecipe.slug,
          thumbnail_url: newRecipe.thumbnail_url,
          description: newRecipe.description,
          author_id: newRecipe.author_id || null,
          category_id: newRecipe.category_id,
          ingredients: newRecipe.ingredients,
          steps: newRecipe.steps,
          cooking_time: newRecipe.cooking_time,
          difficulty: newRecipe.difficulty,
          video_url: newRecipe.video_url,
          tips: newRecipe.tips,
          is_published: newRecipe.is_published !== false
        })
        .select()
        .single();
      if (error) throw error;

      const recipeWithId: Recipe = {
        id: data.id,
        title: data.title,
        slug: data.slug,
        thumbnail_url: data.thumbnail_url,
        description: data.description,
        author_id: data.author_id,
        category_id: data.category_id,
        ingredients: data.ingredients,
        steps: data.steps,
        cooking_time: data.cooking_time,
        difficulty: data.difficulty || 'Easy',
        video_url: data.video_url,
        tips: data.tips,
        is_published: data.is_published !== false,
        view_count: data.view_count || 0,
        created_at: data.created_at,
        category: categories.find(c => c.id === data.category_id)
      };
      setRecipes(prev => [recipeWithId, ...prev]);
    } catch (e) {
      console.warn('Real Supabase addRecipe failed, appending locally:', e);
      const recipeWithId: Recipe = {
        ...newRecipe,
        id: `r${Date.now()}`,
        created_at: new Date().toISOString(),
        view_count: 0,
        category: categories.find(c => c.id === newRecipe.category_id)
      };
      setRecipes(prev => [recipeWithId, ...prev]);
    }
  };

  const updateRecipe = async (id: string, updates: Partial<Recipe>) => {
    // 1. Instantly update UI for snappy user feedback
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

    if (isDemoMode) return;
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.slug !== undefined) dbUpdates.slug = updates.slug;
      if (updates.thumbnail_url !== undefined) dbUpdates.thumbnail_url = updates.thumbnail_url;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.category_id !== undefined) dbUpdates.category_id = updates.category_id;
      if (updates.ingredients !== undefined) dbUpdates.ingredients = updates.ingredients;
      if (updates.steps !== undefined) dbUpdates.steps = updates.steps;
      if (updates.cooking_time !== undefined) dbUpdates.cooking_time = updates.cooking_time;
      if (updates.difficulty !== undefined) dbUpdates.difficulty = updates.difficulty;
      if (updates.video_url !== undefined) dbUpdates.video_url = updates.video_url;
      if (updates.tips !== undefined) dbUpdates.tips = updates.tips;
      if (updates.is_published !== undefined) dbUpdates.is_published = updates.is_published;
      if (updates.view_count !== undefined) dbUpdates.view_count = updates.view_count;

      await supabase
        .from('recipes')
        .update(dbUpdates)
        .eq('id', id);
    } catch (e) {
      console.warn('Failed to sync recipe update to Supabase:', e);
    }
  };

  const deleteRecipe = async (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
    if (isDemoMode) return;
    try {
      await supabase
        .from('recipes')
        .delete()
        .eq('id', id);
    } catch (e) {
      console.warn('Failed to delete recipe from Supabase:', e);
    }
  };

  const addCategory = async (category: Omit<Category, 'id' | 'created_at'>) => {
    if (isDemoMode) {
      const newCat: Category = {
        ...category,
        id: `${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setCategories(prev => [...prev, newCat]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          slug: category.slug,
          icon: category.icon,
          description: category.description
        })
        .select()
        .single();
      if (error) throw error;

      const newCat: Category = {
        id: data.id,
        name: data.name,
        slug: data.slug,
        icon: data.icon,
        description: data.description,
        created_at: data.created_at
      };
      setCategories(prev => [...prev, newCat]);
    } catch (e) {
      console.warn('Failed to add category to Supabase:', e);
      const newCat: Category = {
        ...category,
        id: `${Date.now()}`,
        created_at: new Date().toISOString()
      };
      setCategories(prev => [...prev, newCat]);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    if (isDemoMode) return;
    try {
      await supabase
        .from('categories')
        .update(updates)
        .eq('id', id);
    } catch (e) {
      console.warn('Failed to update category on Supabase:', e);
    }
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    if (isDemoMode) return;
    try {
      await supabase
        .from('categories')
        .delete()
        .eq('id', id);
    } catch (e) {
      console.warn('Failed to delete category from Supabase:', e);
    }
  };

  const addComment = async (recipeId: string, content: string, userProfile: Profile) => {
    if (isDemoMode) {
      const newComment: Comment = {
        id: `c${Date.now()}`,
        recipe_id: recipeId,
        user_id: userProfile.id,
        content,
        created_at: new Date().toISOString(),
        author: userProfile
      };
      setComments(prev => [newComment, ...prev]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          recipe_id: recipeId,
          user_id: userProfile.id,
          content: content
        })
        .select()
        .single();
      if (error) throw error;

      const newComment: Comment = {
        id: data.id,
        recipe_id: data.recipe_id,
        user_id: data.user_id,
        content: data.content,
        created_at: data.created_at,
        author: userProfile
      };
      setComments(prev => [newComment, ...prev]);
    } catch (e) {
      console.warn('Failed to add comment to Supabase:', e);
      const newComment: Comment = {
        id: `c${Date.now()}`,
        recipe_id: recipeId,
        user_id: userProfile.id,
        content,
        created_at: new Date().toISOString(),
        author: userProfile
      };
      setComments(prev => [newComment, ...prev]);
    }
  };

  const deleteComment = async (commentId: string) => {
    setComments(prev => prev.filter(c => c.id !== commentId));
    if (isDemoMode) return;
    try {
      await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);
    } catch (e) {
      console.warn('Failed to delete comment from Supabase:', e);
    }
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
