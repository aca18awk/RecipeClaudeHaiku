export interface Ingredient {
  name: string;
  quantity: number;
  unit: string | null;
}

export interface CookingStep {
  text: string;
  timerSeconds: number | null;
}

export interface Video {
  file: string;
  title: string;
  captions: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  altText: string | null;
  cookingTimeMinutes: number;
  difficulty: 'easy' | 'medium' | 'hard';
  vegetarian: boolean;
  featured: boolean;
  servings: number;
  video: Video | null;
  ingredients: Ingredient[];
  steps: CookingStep[];
}

export interface RecipesData {
  recipes: Recipe[];
}
