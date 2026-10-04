import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useRecipes } from '@/context/RecipeContext';
import { FeaturedCarousel } from '@/components/featured-carousel';
import { RecipeCard } from '@/components/recipe-card';
import { FilterSheet } from '@/components/filter-sheet';
import {
  searchAndFilterRecipes,
  Filters,
} from '@/utils/recipe-utils';
import { getImageSource } from '@/utils/image-loader';

export default function HomeScreen() {
  const router = useRouter();
  const { recipes } = useRecipes();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSheetVisible, setFilterSheetVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    vegetarian: false,
    under30Min: false,
    difficulty: null,
  });

  const featuredRecipes = recipes.filter(r => r.featured);
  const filteredRecipes = searchAndFilterRecipes(
    recipes,
    searchQuery,
    filters
  );
  const hasActiveFilters =
    filters.vegetarian || filters.under30Min || filters.difficulty;

  const handleRecipePress = (recipeId: string) => {
    router.push({
      // @ts-ignore - nested routes not properly typed by expo-router
      pathname: '/recipe/[id]',
      params: { id: recipeId },
    });
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
          <Text style={styles.title}>RecipeApp</Text>
        </View>

        <FeaturedCarousel
          recipes={featuredRecipes}
          onPress={recipe => handleRecipePress(recipe.id)}
        />

        <View style={styles.section}>
          <View style={styles.searchHeader}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search recipes..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9ca3af"
              />
              <Text style={styles.searchIcon}>🔍</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.filterButton,
                hasActiveFilters && styles.filterButtonActive,
              ]}
              onPress={() => setFilterSheetVisible(true)}
            >
              <Text style={styles.filterIcon}>⚙</Text>
            </TouchableOpacity>
          </View>

          {hasActiveFilters && (
            <View style={styles.activeFilters}>
              <Text style={styles.filterLabel}>Filters applied:</Text>
              <View style={styles.filterTags}>
                {filters.vegetarian && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>🌱</Text>
                  </View>
                )}
                {filters.under30Min && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>⏱</Text>
                  </View>
                )}
                {filters.difficulty && (
                  <View style={styles.filterTag}>
                    <Text style={styles.filterTagText}>
                      {filters.difficulty}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        {filteredRecipes.length === 0 ? (
          <View style={styles.emptyState}>
            <Image
              source={getImageSource('assets/images/empty-state.jpeg')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your filters or search query
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={() => handleRecipePress(recipe.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <FilterSheet
        visible={filterSheetVisible}
        filters={filters}
        onFiltersChange={setFilters}
        onClose={() => setFilterSheetVisible(false)}
      />
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
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1f2937',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  searchHeader: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1f2937',
  },
  searchIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filterButtonActive: {
    backgroundColor: '#fef08a',
  },
  filterIcon: {
    fontSize: 20,
  },
  activeFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterTags: {
    flexDirection: 'row',
    gap: 6,
  },
  filterTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#fef08a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTagText: {
    fontSize: 12,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 16,
  },
  emptyImage: {
    width: 120,
    height: 120,
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
});
