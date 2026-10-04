import { createContext, useContext, useState, ReactNode } from 'react';
import { Recipe } from '@/types';
import { getRecipes } from '@/utils/load-recipes';

interface RecipeContextType {
  recipes: Recipe[];
  savedRecipes: string[];
  toggleSavedRecipe: (recipeId: string) => void;
  addRecipe: (recipe: Recipe) => void;
  removeSavedRecipe: (recipeId: string) => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [recipes, setRecipes] = useState<Recipe[]>(getRecipes());
  const [savedRecipes, setSavedRecipes] = useState<string[]>([]);

  const toggleSavedRecipe = (recipeId: string) => {
    setSavedRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const removeSavedRecipe = (recipeId: string) => {
    setSavedRecipes(prev => prev.filter(id => id !== recipeId));
  };

  const addRecipe = (recipe: Recipe) => {
    setRecipes(prev => [...prev, recipe]);
  };

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        savedRecipes,
        toggleSavedRecipe,
        addRecipe,
        removeSavedRecipe,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
}

export function useRecipes() {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipes must be used within RecipeProvider');
  }
  return context;
}
