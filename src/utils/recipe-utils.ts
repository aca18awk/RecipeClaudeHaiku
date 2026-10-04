import { Recipe, Ingredient } from '@/types';

export interface Filters {
  vegetarian: boolean;
  under30Min: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | null;
}

export function searchAndFilterRecipes(
  recipes: Recipe[],
  searchQuery: string,
  filters: Filters
): Recipe[] {
  return recipes.filter(recipe => {
    const matchesSearch =
      searchQuery === '' ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesVegetarian = !filters.vegetarian || recipe.vegetarian;
    const matchesTime =
      !filters.under30Min || recipe.cookingTimeMinutes <= 30;
    const matchesDifficulty =
      !filters.difficulty || recipe.difficulty === filters.difficulty;

    return matchesSearch && matchesVegetarian && matchesTime && matchesDifficulty;
  });
}

export function scaleIngredient(
  ingredient: Ingredient,
  originalServings: number,
  newServings: number
): Ingredient {
  return {
    ...ingredient,
    quantity: (ingredient.quantity * newServings) / originalServings,
  };
}

export function formatQuantity(quantity: number): string {
  if (quantity % 1 === 0) {
    return quantity.toString();
  }
  const fractions: Record<number, string> = {
    0.25: '¼',
    0.33: '⅓',
    0.5: '½',
    0.67: '⅔',
    0.75: '¾',
  };
  const rounded = Math.round(quantity * 4) / 4;
  const fraction = fractions[rounded];
  if (fraction) {
    return fraction;
  }
  return quantity.toFixed(1);
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (minutes === 0) {
    return `${secs}s`;
  }
  if (secs === 0) {
    return `${minutes}m`;
  }
  return `${minutes}m ${secs}s`;
}
