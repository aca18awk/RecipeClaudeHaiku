import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Recipe } from '@/types';
import { useRecipes } from '@/context/RecipeContext';
import { getImageSource } from '@/utils/image-loader';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

const difficultyColors: Record<string, string> = {
  easy: '#10b981',
  medium: '#f59e0b',
  hard: '#ef4444',
};

export function RecipeCard({ recipe, onPress }: RecipeCardProps) {
  const { savedRecipes, toggleSavedRecipe } = useRecipes();
  const [scaleAnim] = useState(new Animated.Value(1));

  const isSaved = savedRecipes.includes(recipe.id);

  const handleSavePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    toggleSavedRecipe(recipe.id);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${recipe.title} recipe`}
      accessibilityHint={`${recipe.cookingTimeMinutes} minutes, ${recipe.difficulty} difficulty. Double tap to view details.`}
    >
      <Image
        source={getImageSource(recipe.image)}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={`${recipe.title} dish image`}
      />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {recipe.title}
        </Text>

        <View style={styles.footer}>
          <View
            style={styles.meta}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`${recipe.cookingTimeMinutes} minutes, ${recipe.difficulty} difficulty`}
          >
            <Text style={styles.time}>⏱ {recipe.cookingTimeMinutes} min</Text>
            <View
              style={[
                styles.difficulty,
                { backgroundColor: difficultyColors[recipe.difficulty] },
              ]}
              accessible={true}
              accessibilityLabel={`Difficulty: ${recipe.difficulty}`}
              accessibilityRole="text"
            >
              <Text style={styles.difficultyText}>
                {recipe.difficulty.charAt(0).toUpperCase() +
                  recipe.difficulty.slice(1)}
              </Text>
            </View>
          </View>

          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity
              style={[
                styles.saveButton,
                isSaved && styles.saveButtonActive,
              ]}
              onPress={handleSavePress}
              accessible={true}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isSaved }}
              accessibilityLabel={`Save ${recipe.title} to my kitchen`}
              accessibilityHint={isSaved ? "Saved to your kitchen. Double tap to remove." : "Double tap to save to your kitchen."}
            >
              <Text style={styles.saveIcon}>{isSaved ? '🍳' : '🍳'}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    gap: 8,
  },
  time: {
    fontSize: 13,
    color: '#6b7280',
  },
  difficulty: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  saveButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonActive: {
    backgroundColor: '#fef08a',
  },
  saveIcon: {
    fontSize: 20,
  },
});
