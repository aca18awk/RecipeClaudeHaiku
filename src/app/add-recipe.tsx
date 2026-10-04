import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRecipes } from '@/context/RecipeContext';
import { Recipe } from '@/types';

export default function AddRecipeScreen() {
  const router = useRouter();
  const { addRecipe } = useRecipes();
  const insets = useSafeAreaInsets();

  const [title, setTitle] = useState('');
  const [servings, setServings] = useState('2');
  const [cookingTime, setCookingTime] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Recipe title is required';
    }
    if (!cookingTime.trim()) {
      newErrors.cookingTime = 'Cooking time is required';
    } else if (isNaN(parseInt(cookingTime))) {
      newErrors.cookingTime = 'Cooking time must be a number';
    }
    if (!servings.trim()) {
      newErrors.servings = 'Servings is required';
    } else if (isNaN(parseInt(servings))) {
      newErrors.servings = 'Servings must be a number';
    }
    if (!ingredients.trim()) {
      newErrors.ingredients = 'At least one ingredient is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddRecipe = () => {
    if (!validateForm()) {
      return;
    }

    const newRecipe: Recipe = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: 'A custom recipe',
      image: 'assets/images/empty-state.jpeg',
      altText: null,
      cookingTimeMinutes: parseInt(cookingTime),
      difficulty: 'medium',
      vegetarian: false,
      featured: false,
      servings: parseInt(servings),
      video: null,
      ingredients: ingredients
        .split('\n')
        .filter(line => line.trim())
        .map(line => {
          const parts = line.trim().split(' ');
          const quantity = parseFloat(parts[0]);
          const unit = isNaN(quantity) ? null : parts[1] || null;
          const name = isNaN(quantity)
            ? line.trim()
            : parts.slice(isNaN(quantity) ? 0 : 2).join(' ');

          return {
            name,
            quantity: isNaN(quantity) ? 1 : quantity,
            unit,
          };
        }),
      steps: [
        {
          text: 'Follow the recipe instructions',
          timerSeconds: null,
        },
      ],
    };

    addRecipe(newRecipe);
    setToastMessage('Recipe added successfully!');
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
      router.back();
    }, 2000);
  };

  const renderError = (field: string) => {
    if (errors[field]) {
      return <Text style={styles.errorText}>{errors[field]}</Text>;
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add New Recipe</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.label}>Recipe Title *</Text>
            <TextInput
              style={[
                styles.input,
                errors.title && styles.inputError,
              ]}
              placeholder="e.g., Chocolate Chip Cookies"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9ca3af"
            />
            {renderError('title')}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Cooking Time (minutes) *</Text>
            <TextInput
              style={[
                styles.input,
                errors.cookingTime && styles.inputError,
              ]}
              placeholder="e.g., 30"
              value={cookingTime}
              onChangeText={setCookingTime}
              keyboardType="number-pad"
              placeholderTextColor="#9ca3af"
            />
            {renderError('cookingTime')}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Servings *</Text>
            <TextInput
              style={[
                styles.input,
                errors.servings && styles.inputError,
              ]}
              placeholder="e.g., 4"
              value={servings}
              onChangeText={setServings}
              keyboardType="number-pad"
              placeholderTextColor="#9ca3af"
            />
            {renderError('servings')}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Source URL (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/recipe"
              value={sourceUrl}
              onChangeText={setSourceUrl}
              keyboardType="url"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Ingredients *</Text>
            <Text style={styles.helperText}>
              Enter one ingredient per line. Format: "2 tbsp olive oil" or just "salt"
            </Text>
            <TextInput
              style={[
                styles.textArea,
                errors.ingredients && styles.inputError,
              ]}
              placeholder="2 tbsp olive oil&#10;200g flour&#10;1 tsp salt"
              value={ingredients}
              onChangeText={setIngredients}
              multiline
              numberOfLines={6}
              placeholderTextColor="#9ca3af"
            />
            {renderError('ingredients')}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleAddRecipe}
            >
              <Text style={styles.primaryButtonText}>Add Recipe</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.requiredNote}>* = Required field</Text>
        </View>
      </ScrollView>

      <Modal
        visible={toastVisible}
        transparent
        pointerEvents="none"
      >
        <View style={styles.toastContainer}>
          <View style={styles.toast}>
            <Text style={styles.toastText}>{toastMessage}</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scroll: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#6b7280',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  textArea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    color: '#ef4444',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fef08a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c2d12',
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  requiredNote: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 20,
  },
  toastContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 32,
    pointerEvents: 'none',
  },
  toast: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
