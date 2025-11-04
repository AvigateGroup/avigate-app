// src/screens/search/SearchDestinationScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '@/constants/colors';
import { useRouter } from 'expo-router';

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  type: 'recent' | 'saved' | 'search';
}

// Mock data - Replace with actual API calls
const RECENT_SEARCHES: LocationSuggestion[] = [
  {
    id: '1',
    name: 'University of Port Harcourt',
    address: 'East-West Rd, Choba, Port Harcourt',
    type: 'recent',
  },
  {
    id: '2',
    name: 'Port Harcourt International Airport',
    address: 'Omagwa, Rivers State',
    type: 'recent',
  },
];

const SAVED_PLACES: LocationSuggestion[] = [
  {
    id: 's1',
    name: 'Home',
    address: 'VWQ8+M9G, Port Harcourt, Rivers',
    type: 'saved',
  },
  {
    id: 's2',
    name: 'Work',
    address: 'Plot 23, Trans Amadi Industrial Layout',
    type: 'saved',
  },
];

export const SearchDestinationScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (text: string) => {
    setSearchQuery(text);

    if (text.length > 2) {
      setIsSearching(true);
      // TODO: Implement actual location search API
      // For now, just filter recent searches
      const filtered = RECENT_SEARCHES.filter(
        (item) =>
          item.name.toLowerCase().includes(text.toLowerCase()) ||
          item.address.toLowerCase().includes(text.toLowerCase()),
      );
      setSuggestions(filtered);
      setIsSearching(false);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLocation = (location: LocationSuggestion) => {
    Keyboard.dismiss();
    console.log('Selected location:', location);
    // TODO: Navigate to route planning or show on map
    router.back();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const handleBack = () => {
    router.back();
  };

  const renderLocationItem = ({ item }: { item: LocationSuggestion }) => {
    let iconName = 'location';
    let iconColor = COLORS.primary;

    if (item.type === 'recent') {
      iconName = 'time-outline';
      iconColor = COLORS.textMuted;
    } else if (item.type === 'saved') {
      iconName = item.name === 'Home' ? 'home' : 'briefcase';
      iconColor = COLORS.primary;
    }

    return (
      <TouchableOpacity
        style={styles.suggestionItem}
        onPress={() => handleSelectLocation(item)}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Icon name={iconName} size={24} color={iconColor} />
        </View>
        <View style={styles.suggestionText}>
          <Text style={styles.suggestionName}>{item.name}</Text>
          <Text style={styles.suggestionAddress} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        <Icon name="chevron-forward" size={20} color={COLORS.textMuted} />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (isSearching) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Searching...</Text>
        </View>
      );
    }

    if (searchQuery && !isSearching && suggestions.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Icon name="search" size={48} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>No results found</Text>
          <Text style={styles.emptySubtext}>
            Try searching for a different location
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Where to?</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a destination"
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} activeOpacity={0.7}>
            <Icon name="close-circle" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {!searchQuery ? (
        // Show saved places and recent searches when not searching
        <View style={styles.content}>
          {/* Saved Places */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved Places</Text>
            <FlatList
              data={SAVED_PLACES}
              keyExtractor={(item) => item.id}
              renderItem={renderLocationItem}
              scrollEnabled={false}
            />
          </View>

          {/* Recent Searches */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent</Text>
            <FlatList
              data={RECENT_SEARCHES}
              keyExtractor={(item) => item.id}
              renderItem={renderLocationItem}
              scrollEnabled={false}
            />
          </View>
        </View>
      ) : (
        // Show search results
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          renderItem={renderLocationItem}
          ListEmptyComponent={renderEmptyState}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
    paddingVertical: 0,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: 16,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    marginRight: 8,
  },
  suggestionName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  suggestionAddress: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});