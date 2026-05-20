export type UserRole = 'admin' | 'user';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  created_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  description: string | null;
  author_id: string;
  category_id: string;
  ingredients: string[];
  steps: string[];
  cooking_time: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  video_url?: string | null;
  tips?: string | null;
  is_published: boolean;
  view_count: number;
  created_at: string;
  author?: Profile;
  category?: Category;
  _count?: {
    favorites: number;
    ratings: number;
  };
}

export interface Comment {
  id: string;
  user_id: string;
  recipe_id: string;
  content: string;
  created_at: string;
  author?: Profile;
}

export interface Favorite {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
  recipe?: Recipe;
}
