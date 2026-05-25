import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Layers, Apple, Trees, Sun, Activity, Sparkles } from 'lucide-react-native';

export type CategoryType = 'All' | 'Fruit' | 'Timber' | 'Shade' | 'Medicinal' | 'Ornamental';

interface CategoryFilterProps {
  selectedCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
}

const CATEGORIES: { name: CategoryType; label: string; Icon: any }[] = [
  { name: 'All', label: 'All Trees', Icon: Layers },
  { name: 'Fruit', label: 'Fruit', Icon: Apple },
  { name: 'Timber', label: 'Timber', Icon: Trees },
  { name: 'Shade', label: 'Shade', Icon: Sun },
  { name: 'Medicinal', label: 'Medicinal', Icon: Activity },
  { name: 'Ornamental', label: 'Ornamental', Icon: Sparkles },
];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.outerContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          const IconComponent = cat.Icon;

          return (
            <TouchableOpacity
              key={cat.name}
              onPress={() => onSelectCategory(cat.name)}
              style={[
                styles.pill,
                isActive ? styles.activePill : styles.inactivePill,
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Filter by ${cat.label}`}
            >
              <IconComponent
                size={16}
                color={isActive ? '#FFFFFF' : '#556B2F'}
                style={styles.icon}
              />
              <Text
                style={[
                  styles.pillText,
                  isActive ? styles.activePillText : styles.inactivePillText,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    height: 48,
    marginBottom: 8,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8, // Gap is supported in modern RN (0.71+)
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    height: 38,
  },
  activePill: {
    backgroundColor: '#2E8B57', // Forest green
    borderColor: '#2E8B57',
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  inactivePill: {
    backgroundColor: '#F0F5F0',
    borderColor: '#E2ECE2',
  },
  icon: {
    marginRight: 6,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activePillText: {
    color: '#FFFFFF',
  },
  inactivePillText: {
    color: '#556B2F', // Olive green tint
  },
});
