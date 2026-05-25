import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { X, Ruler, TrendingUp, MapPin, Leaf } from 'lucide-react-native';
import { TreeSpecies } from '../data/species';

interface DetailModalProps {
  tree: TreeSpecies | null;
  visible: boolean;
  onClose: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DetailModal: React.FC<DetailModalProps> = ({ tree, visible, onClose }) => {
  if (!tree) return null;

  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Medicinal':
        return { color: '#00796B', bg: '#E0F2F1' };
      case 'Fruit':
        return { color: '#E65100', bg: '#FFF3E0' };
      case 'Timber':
        return { color: '#8D6E63', bg: '#F5EBE6' };
      case 'Shade':
        return { color: '#2E7D32', bg: '#E8F5E9' };
      case 'Ornamental':
        return { color: '#C2185B', bg: '#FCE4EC' };
      default:
        return { color: '#37474F', bg: '#ECEFF1' };
    }
  };

  const theme = getCategoryTheme(tree.category);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.backdrop}>
          <TouchableWithoutFeedback>
            <View style={styles.sheetContainer}>
              
              {/* Drag Handle Indicator */}
              <View style={styles.dragHandle} />
              
              {/* Close Button */}
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeButton}
                accessibilityLabel="Close details modal"
              >
                <X size={20} color="#2E3A2E" />
              </TouchableOpacity>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {/* Tree Image */}
                <Image source={tree.image} style={styles.image} resizeMode="cover" />

                {/* Header Section */}
                <View style={styles.headerContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{tree.name}</Text>
                    <View style={[styles.badge, { backgroundColor: theme.bg }]}>
                      <Text style={[styles.badgeText, { color: theme.color }]}>
                        {tree.category}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.scientificName}>{tree.scientificName}</Text>
                </View>

                {/* Specs Grid */}
                <View style={styles.specsGrid}>
                  <View style={styles.specItem}>
                    <Ruler size={18} color="#2E8B57" style={styles.specIcon} />
                    <View>
                      <Text style={styles.specLabel}>Average Height</Text>
                      <Text style={styles.specValue}>{tree.height}</Text>
                    </View>
                  </View>

                  <View style={styles.specItem}>
                    <TrendingUp size={18} color="#2E8B57" style={styles.specIcon} />
                    <View>
                      <Text style={styles.specLabel}>Growth Rate</Text>
                      <Text style={styles.specValue}>{tree.growthRate}</Text>
                    </View>
                  </View>

                  <View style={styles.specItem}>
                    <MapPin size={18} color="#2E8B57" style={styles.specIcon} />
                    <View>
                      <Text style={styles.specLabel}>Native Origin</Text>
                      <Text style={styles.specValue} numberOfLines={1}>{tree.nativeRegion}</Text>
                    </View>
                  </View>
                </View>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Botanical Overview */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Botanical Overview</Text>
                  <Text style={styles.sectionBody}>{tree.longDescription}</Text>
                </View>

                {/* Ecological Benefits */}
                <View style={[styles.section, styles.benefitsSection]}>
                  <View style={styles.benefitsHeader}>
                    <Leaf size={18} color="#2E8B57" style={styles.benefitsIcon} />
                    <Text style={styles.sectionTitle}>Ecological Benefits</Text>
                  </View>
                  <Text style={styles.benefitsBody}>{tree.ecologicalBenefits}</Text>
                </View>
                
                {/* Bottom Padding for iOS safe area */}
                <View style={styles.bottomSpacer} />

              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(24, 32, 24, 0.45)', // Forest green-tinted backdrop
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    height: SCREEN_HEIGHT * 0.85,
    paddingTop: 10,
    shadowColor: '#122412',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    position: 'relative',
  },
  dragHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#D1E0D1',
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F5F0',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  image: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.28,
    borderRadius: 24,
    backgroundColor: '#E8F2E8',
    marginBottom: 20,
  },
  headerContainer: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#2E3A2E',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#607D60',
    marginTop: 4,
  },
  specsGrid: {
    backgroundColor: '#F7FAF7',
    borderRadius: 20,
    padding: 16,
    gap: 12,
    marginBottom: 20,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  specIcon: {
    marginRight: 12,
    backgroundColor: '#E8F2E8',
    padding: 8,
    borderRadius: 10,
    width: 34,
    height: 34,
    textAlign: 'center',
  },
  specLabel: {
    fontSize: 11,
    color: '#8FBC8F',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  specValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E3A2E',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E2ECE2',
    marginVertical: 4,
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E3A2E',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 15,
    color: '#556B55',
    lineHeight: 22,
  },
  benefitsSection: {
    backgroundColor: '#EBF4EB',
    borderRadius: 20,
    padding: 18,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitsIcon: {
    marginRight: 8,
  },
  benefitsBody: {
    fontSize: 14,
    color: '#2E5A2E',
    lineHeight: 20,
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 40,
  },
});
