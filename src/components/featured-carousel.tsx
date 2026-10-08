import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { Recipe } from '@/types';
import { getImageSource } from '@/utils/image-loader';

interface FeaturedCarouselProps {
  recipes: Recipe[];
  onPress: (recipe: Recipe) => void;
}

const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth - 32;

export function FeaturedCarousel({ recipes, onPress }: FeaturedCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (cardWidth + 16));
    setActiveIndex(Math.min(index, recipes.length - 1));
  };

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="list"
    >
      <Text
        style={styles.title}
        accessibilityRole="header"
      >
        Featured Recipes
      </Text>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardWidth + 16}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        accessibilityLabel="Featured recipes carousel"
        accessibilityHint={`Showing ${recipes.length} featured recipes. Scroll horizontally to browse.`}
      >
        {recipes.map((recipe, index) => (
          <TouchableOpacity
            key={recipe.id}
            style={styles.card}
            onPress={() => onPress(recipe)}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${recipe.title}. Featured recipe ${index + 1} of ${recipes.length}.`}
            accessibilityHint={recipe.description}
          >
            <Image
              source={getImageSource(recipe.image)}
              style={styles.image}
              resizeMode="cover"
              accessibilityLabel={`${recipe.title} featured dish`}
            />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {recipe.title}
              </Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {recipe.description}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View
        style={styles.dots}
        accessible={true}
        accessibilityRole="text"
        accessibilityLabel={`Showing featured recipe ${activeIndex + 1} of ${recipes.length}`}
      >
        {recipes.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              activeIndex === index && styles.dotActive,
            ]}
            accessible={index === activeIndex}
            accessibilityLabel={index === activeIndex ? `Current slide: recipe ${index + 1}` : undefined}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    paddingHorizontal: 16,
  },
  scroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  scrollContent: {
    gap: 16,
  },
  card: {
    width: cardWidth,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 220,
  },
  cardContent: {
    backgroundColor: '#fff',
    padding: 12,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
  },
  cardDesc: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 16,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#d1d5db',
  },
  dotActive: {
    backgroundColor: '#1f2937',
    width: 24,
  },
});
