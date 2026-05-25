import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { TreeSpecies } from '../data/species';

interface TreeCardProps {
  tree: TreeSpecies;
  onPress: () => void;
}

export const TreeCard: React.FC<TreeCardProps> = ({ tree, onPress }) => {
  // Define colors for category badges
  const getCategoryBadgeStyles = (category: string) => {
    switch (category) {
      case 'Medicinal':
        return { bg: '#E0F2F1', text: '#00796B' };
      case 'Fruit':
        return { bg: '#FFF3E0', text: '#E65100' };
      case 'Timber':
        return { bg: '#F5EBE6', text: '#8D6E63' };
      case 'Shade':
        return { bg: '#E8F5E9', text: '#2E7D32' };
      case 'Ornamental':
        return { bg: '#FCE4EC', text: '#C2185B' };
      default:
        return { bg: '#ECEFF1', text: '#37474F' };
    }
  };

  const badgeColor = getCategoryBadgeStyles(tree.category);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.card}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={`Tree card: ${tree.name}, Scientific name: ${tree.scientificName}. Category: ${tree.category}. Tap to view details.`}
    >
      <Image source={tree.image} style={styles.image} resizeMode="cover" />
      
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {tree.name}
          </Text>
          <View style={[styles.badge, { backgroundColor: badgeColor.bg }]}>
            <Text style={[styles.badgeText, { color: badgeColor.text }]}>
              {tree.category}
            </Text>
          </View>
        </View>

        <Text style={styles.scientificName} numberOfLines={1}>
          {tree.scientificName}
        </Text>
        
        <Text style={styles.description} numberOfLines={2}>
          {tree.shortDescription}
        </Text>
      </View>

      <ChevronRight size={18} color="#A3C1A3" style={styles.arrowIcon} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F4F0',
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  image: {
    width: 76,
    height: 76,
    borderRadius: 14,
    backgroundColor: '#E8F2E8',
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingRight: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2E3A2E',
    flex: 1,
    marginRight: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scientificName: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#607D60',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: '#6B7A6B',
    lineHeight: 18,
  },
  arrowIcon: {
    marginLeft: 4,
  },
});
