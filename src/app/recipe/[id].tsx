import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRecipes } from '@/context/RecipeContext';
import { scaleIngredient, formatQuantity } from '@/utils/recipe-utils';
import { getImageSource } from '@/utils/image-loader';

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { recipes } = useRecipes();
  const recipe = recipes.find(r => r.id === id);

  const [servings, setServings] = useState(recipe?.servings || 2);
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const insets = useSafeAreaInsets();

  if (!recipe) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={styles.errorContainer}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel="Recipe not found"
        >
          <Text style={styles.errorText}>Recipe not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleAddToShoppingList = () => {
    setToastMessage('Added to shopping list!');
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 2000);
  };

  const handleStartCooking = () => {
    router.push({
      // @ts-ignore - nested routes not properly typed by expo-router
      pathname: '/recipe/cooking',
      params: { recipeId: recipe?.id },
    });
  };

  const handleIncrementServings = () => {
    setServings(prev => prev + 1);
  };

  const handleDecrementServings = () => {
    if (servings > 1) {
      setServings(prev => prev - 1);
    }
  };

  const toggleStepCheck = (index: number) => {
    setCheckedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const scaledIngredients = recipe.ingredients.map(ing =>
    scaleIngredient(ing, recipe.servings, servings)
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + 20,
        }}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Back"
          accessibilityHint="Double tap to go back to the previous screen"
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <Image
          source={getImageSource(recipe.image)}
          style={styles.image}
          resizeMode="cover"
          accessibilityLabel={`${recipe.title} dish image`}
        />

        <View style={styles.content}>
          <Text
            style={styles.title}
            accessibilityRole="header"
          >
            {recipe.title}
          </Text>
          <Text
            style={styles.description}
            accessibilityRole="text"
          >
            {recipe.description}
          </Text>

          {recipe.video && (
            <View
              style={styles.videoSection}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Play video: ${recipe.video.title}`}
              accessibilityHint="Double tap to play cooking video"
            >
              <View
                style={styles.videoPlaceholder}
                accessible={false}
              >
                <Text
                  style={styles.videoIcon}
                  accessibilityLabel="Play button"
                >
                  ▶
                </Text>
              </View>
              <Text style={styles.videoTitle}>{recipe.video.title}</Text>
            </View>
          )}

          <View
            style={styles.section}
            accessible={true}
            accessibilityRole="list"
          >
            <View style={styles.sectionHeader}>
              <Text
                style={styles.sectionTitle}
                accessibilityRole="header"
              >
                Ingredients
              </Text>
              <View
                style={styles.servingsControl}
                accessible={true}
                accessibilityRole="spinbutton"
                accessibilityValue={{
                  min: 1,
                  max: 10,
                  now: servings,
                  text: `${servings} servings`,
                }}
                accessibilityLabel="Servings"
                accessibilityHint="Use plus and minus buttons to adjust servings"
              >
                <TouchableOpacity
                  style={styles.servingButton}
                  onPress={handleDecrementServings}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease servings"
                  accessibilityHint={`Currently ${servings} servings. Double tap to decrease.`}
                >
                  <Text style={styles.servingButtonText}>−</Text>
                </TouchableOpacity>
                <Text
                  style={styles.servingText}
                  accessible={true}
                  accessibilityRole="text"
                  accessibilityLabel={`${servings} servings`}
                >
                  {servings}
                </Text>
                <TouchableOpacity
                  style={styles.servingButton}
                  onPress={handleIncrementServings}
                  accessible={true}
                  accessibilityRole="button"
                  accessibilityLabel="Increase servings"
                  accessibilityHint={`Currently ${servings} servings. Double tap to increase.`}
                >
                  <Text style={styles.servingButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {scaledIngredients.map((ingredient, index) => (
              <TouchableOpacity
                key={index}
                style={styles.ingredientItem}
                onPress={() => toggleStepCheck(index)}
                accessible={true}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: checkedSteps.has(index) }}
                accessibilityLabel={`${formatQuantity(ingredient.quantity)}${ingredient.unit ? ` ${ingredient.unit}` : ''} ${ingredient.name}`}
                accessibilityHint="Double tap to toggle this ingredient as collected"
              >
                <View
                  style={[
                    styles.checkbox,
                    checkedSteps.has(index) && styles.checkboxChecked,
                  ]}
                  accessible={false}
                >
                  {checkedSteps.has(index) && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.ingredientText,
                    checkedSteps.has(index) && styles.ingredientTextChecked,
                  ]}
                  accessible={false}
                >
                  {formatQuantity(ingredient.quantity)}{ingredient.unit ? ` ${ingredient.unit}` : ''} {ingredient.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleAddToShoppingList}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Add to shopping list"
              accessibilityHint="Double tap to add these ingredients to your shopping list"
            >
              <Text
                style={styles.buttonIcon}
                accessible={false}
              >
                🛒
              </Text>
              <Text
                style={styles.secondaryButtonText}
                accessible={false}
              >
                Shopping List
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleStartCooking}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Start cooking"
              accessibilityHint="Double tap to begin the step-by-step cooking guide"
            >
              <Text
                style={styles.buttonIcon}
                accessible={false}
              >
                👨‍🍳
              </Text>
              <Text
                style={styles.primaryButtonText}
                accessible={false}
              >
                Start Cooking
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={toastVisible}
        transparent
        pointerEvents="none"
        accessibilityViewIsModal={toastVisible}
      >
        <View
          style={styles.toastContainer}
          accessible={true}
          accessibilityRole="alert"
          accessibilityLabel={toastMessage}
        >
          <View style={styles.toast}>
            <Text
              style={styles.toastText}
              accessibilityLiveRegion="assertive"
            >
              {toastMessage}
            </Text>
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
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    elevation: 3,
  },
  backIcon: {
    fontSize: 28,
    color: '#1f2937',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 300,
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  videoSection: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  videoPlaceholder: {
    width: '100%',
    height: 180,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    fontSize: 48,
    color: '#9ca3af',
  },
  videoTitle: {
    fontSize: 13,
    color: '#6b7280',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  servingButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  servingText: {
    minWidth: 20,
    textAlign: 'center',
    fontSize: 13,
    color: '#1f2937',
    fontWeight: '500',
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#fef08a',
    borderColor: '#fcd34d',
  },
  checkmark: {
    fontSize: 14,
    color: '#7c2d12',
    fontWeight: '600',
  },
  ingredientText: {
    flex: 1,
    fontSize: 13,
    color: '#4b5563',
  },
  ingredientTextChecked: {
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fef08a',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c2d12',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
  },
  buttonIcon: {
    fontSize: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
  },
});
