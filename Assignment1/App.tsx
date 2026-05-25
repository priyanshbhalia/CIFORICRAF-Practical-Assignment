import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  KeyboardAvoidingView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Sprout, SearchX } from 'lucide-react-native';
import { treeSpeciesList, TreeSpecies } from './data/species';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter, CategoryType } from './components/CategoryFilter';
import { TreeCard } from './components/TreeCard';
import { DetailModal } from './components/DetailModal';

export default function App() {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [selectedTree, setSelectedTree] = useState<TreeSpecies | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Filter logic (Memoized for optimization)
  const filteredTrees = useMemo(() => {
    return treeSpeciesList.filter((tree) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'All' || tree.category === selectedCategory;
      
      // Search query filter
      const matchesSearch =
        tree.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tree.scientificName.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  // Modal handlers
  const handleOpenDetails = (tree: TreeSpecies) => {
    setSelectedTree(tree);
    setModalVisible(true);
  };

  const handleCloseDetails = () => {
    setModalVisible(false);
    // Keep selected tree reference until modal slide animation completes
    setTimeout(() => {
      if (!modalVisible) setSelectedTree(null);
    }, 300);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Elegant Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Sprout size={28} color="#2E8B57" />
          </View>
          <View>
            <Text style={styles.headerTitle}>Species Selector</Text>
            <Text style={styles.headerSubtitle}>Explore & identify botanical species</Text>
          </View>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Category Pills (Horizontal Scroll) */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Trees FlatList */}
        <FlatList
          data={filteredTrees}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TreeCard
              tree={item}
              onPress={() => handleOpenDetails(item)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconContainer}>
                <SearchX size={36} color="#8FBC8F" />
              </View>
              <Text style={styles.emptyTitle}>No Species Found</Text>
              <Text style={styles.emptyText}>
                We couldn't find any trees matching "{searchQuery}" under {selectedCategory} category. Try a different search term or category.
              </Text>
            </View>
          }
        />

        {/* Bottom Sheet Details Modal */}
        <DetailModal
          tree={selectedTree}
          visible={modalVisible}
          onClose={handleCloseDetails}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F8F4', // Premium ultra-light green base background
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  logoContainer: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: '#E8F2E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#2E3A2E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6B7A6B',
    fontWeight: '500',
    marginTop: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#E8F2E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E3A2E',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7A6B',
    textAlign: 'center',
    lineHeight: 20,
  },
});
