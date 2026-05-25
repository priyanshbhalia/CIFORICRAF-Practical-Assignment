import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, X } from 'lucide-react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search species by name...',
}) => {
  return (
    <View style={styles.container}>
      <Search size={20} color="#556B2F" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8FBC8F"
        accessibilityLabel="Search tree species"
        accessibilityHint="Type a tree name to filter the list"
        clearButtonMode="never" // We handle it custom for cross-platform styling
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => onChangeText('')}
          style={styles.clearButton}
          accessibilityLabel="Clear search text"
        >
          <X size={18} color="#8FBC8F" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F5F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: '#E2ECE2',
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#2E8B57',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#2E3A2E',
    fontWeight: '500',
    paddingVertical: 10,
  },
  clearButton: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
