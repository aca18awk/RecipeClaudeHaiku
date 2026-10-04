import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Filters } from '@/utils/recipe-utils';

interface FilterSheetProps {
  visible: boolean;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClose: () => void;
}

export function FilterSheet({
  visible,
  filters,
  onFiltersChange,
  onClose,
}: FilterSheetProps) {
  const handleToggleVegetarian = () => {
    onFiltersChange({ ...filters, vegetarian: !filters.vegetarian });
  };

  const handleToggleUnder30 = () => {
    onFiltersChange({ ...filters, under30Min: !filters.under30Min });
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard' | null) => {
    onFiltersChange({
      ...filters,
      difficulty: filters.difficulty === difficulty ? null : difficulty,
    });
  };

  const handleReset = () => {
    onFiltersChange({
      vegetarian: false,
      under30Min: false,
      difficulty: null,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Filter Recipes</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dietary</Text>
            <View style={styles.chipGroup}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filters.vegetarian && styles.chipActive,
                ]}
                onPress={handleToggleVegetarian}
              >
                <Text
                  style={[
                    styles.chipText,
                    filters.vegetarian && styles.chipTextActive,
                  ]}
                >
                  🌱 Vegetarian
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Time</Text>
            <View style={styles.chipGroup}>
              <TouchableOpacity
                style={[
                  styles.chip,
                  filters.under30Min && styles.chipActive,
                ]}
                onPress={handleToggleUnder30}
              >
                <Text
                  style={[
                    styles.chipText,
                    filters.under30Min && styles.chipTextActive,
                  ]}
                >
                  ⏱ Under 30 min
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Difficulty</Text>
            <View style={styles.chipGroup}>
              {(['easy', 'medium', 'hard'] as const).map(level => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.chip,
                    filters.difficulty === level && styles.chipActive,
                  ]}
                  onPress={() => handleDifficultyChange(level)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      filters.difficulty === level && styles.chipTextActive,
                    ]}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.doneButton}
              onPress={onClose}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
    maxHeight: Dimensions.get('window').height * 0.8,
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginBottom: 12,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#f9fafb',
  },
  chipActive: {
    backgroundColor: '#fef08a',
    borderColor: '#fcd34d',
  },
  chipText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#7c2d12',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  doneButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#fef08a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7c2d12',
  },
});
