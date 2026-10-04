import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRecipes } from '@/context/RecipeContext';
import { RecipeCard } from '@/components/recipe-card';

interface SwipeableRecipeCardProps {
  recipe: any;
  onPress: () => void;
  onDelete: () => void;
}

function SwipeableRecipeCard({
  recipe,
  onPress,
  onDelete,
}: SwipeableRecipeCardProps) {
  const [swipeAnim] = useState(new Animated.Value(0));
  const [isDeleted, setIsDeleted] = useState(false);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, { dx }) => Math.abs(dx) > 10,
    onPanResponderMove: (evt, { dx }) => {
      if (dx < 0) {
        swipeAnim.setValue(Math.max(dx, -100));
      }
    },
    onPanResponderRelease: (evt, { dx, vx }) => {
      if (dx < -50 || vx < -0.5) {
        Animated.timing(swipeAnim, {
          toValue: -100,
          duration: 200,
          useNativeDriver: false,
        }).start();
        setTimeout(() => {
          setIsDeleted(true);
          onDelete();
        }, 200);
      } else {
        Animated.timing(swipeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    },
  });

  if (isDeleted) {
    return null;
  }

  const translateX = swipeAnim;

  return (
    <View style={styles.swipeableContainer}>
      <View style={styles.swipeBackground}>
        <Text style={styles.deleteLabel}>Delete</Text>
      </View>
      <Animated.View
        style={[
          styles.swipeableContent,
          { transform: [{ translateX }] },
        ]}
        {...panResponder.panHandlers}
      >
        <RecipeCard recipe={recipe} onPress={onPress} />
      </Animated.View>
    </View>
  );
}

export default function MyKitchenScreen() {
  const router = useRouter();
  const { recipes, savedRecipes, toggleSavedRecipe, removeSavedRecipe } =
    useRecipes();
  const insets = useSafeAreaInsets();

  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [undoVisible, setUndoVisible] = useState(false);

  const savedRecipesList = recipes.filter(r => savedRecipes.includes(r.id));

  const handleDeleteRecipe = (recipeId: string) => {
    removeSavedRecipe(recipeId);
    setUndoStack(prev => [...prev, recipeId]);
    setUndoVisible(true);

    const timer = setTimeout(() => {
      setUndoStack(prev => prev.filter(id => id !== recipeId));
      setUndoVisible(false);
    }, 5000);

    return timer;
  };

  const handleUndo = () => {
    const recipeId = undoStack[undoStack.length - 1];
    if (recipeId) {
      toggleSavedRecipe(recipeId);
      setUndoStack(prev => prev.slice(0, -1));
      if (undoStack.length === 1) {
        setUndoVisible(false);
      }
    }
  };

  const handleRecipePress = (recipeId: string) => {
    router.push({
      // @ts-ignore - nested routes not properly typed by expo-router
      pathname: '/recipe/[id]',
      params: { id: recipeId },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Kitchen</Text>
      </View>

      {savedRecipesList.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🍳</Text>
          <Text style={styles.emptyTitle}>No saved recipes yet</Text>
          <Text style={styles.emptyDescription}>
            Tap the pot icon on recipe cards to save them here
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + 20,
          }}
        >
          <View style={styles.listContainer}>
            {savedRecipesList.map(recipe => (
              <SwipeableRecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => handleRecipePress(recipe.id)}
                onDelete={() => handleDeleteRecipe(recipe.id)}
              />
            ))}
          </View>
        </ScrollView>
      )}

      {undoVisible && undoStack.length > 0 && (
        <View style={styles.undoSnackbar}>
          <Text style={styles.undoText}>Recipe deleted</Text>
          <TouchableOpacity onPress={handleUndo}>
            <Text style={styles.undoButton}>UNDO</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  scroll: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  swipeableContainer: {
    marginBottom: 12,
    overflow: 'hidden',
    borderRadius: 12,
  },
  swipeBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: '#ef4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  swipeableContent: {
    zIndex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  undoSnackbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  undoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  undoButton: {
    color: '#fef08a',
    fontSize: 13,
    fontWeight: '600',
  },
});
