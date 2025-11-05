// src/screens/search/SearchDestinationScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useRouter } from 'expo-router';
import { searchStyles } from '@/styles/features';

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
  const colors = useThemedColors();

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
    let iconColor = colors.primary;

    if (item.type === 'recent') {
      iconName = 'time-outline';
      iconColor = colors.textMuted;
    } else if (item.type === 'saved') {
      iconName = item.name === 'Home' ? 'home' : 'briefcase';
      iconColor = colors.primary;
    }

    return (
      <TouchableOpacity
        style={[searchStyles.suggestionItem, { backgroundColor: colors.white }]}
        onPress={() => handleSelectLocation(item)}
        activeOpacity={0.7}
      >
        <View style={[searchStyles.iconContainer, { backgroundColor: colors.backgroundLight }]}>
          <Icon name={iconName} size={24} color={iconColor} />
        </View>
        <View style={searchStyles.suggestionText}>
          <Text style={[searchStyles.suggestionName, { color: colors.text }]}>{item.name}</Text>
          <Text style={[searchStyles.suggestionAddress, { color: colors.textMuted }]} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (isSearching) {
      return (
        <View style={searchStyles.emptyState}>
          <Text style={[searchStyles.emptyText, { color: colors.text }]}>Searching...</Text>
        </View>
      );
    }

    if (searchQuery && !isSearching && suggestions.length === 0) {
      return (
        <View style={searchStyles.emptyState}>
          <Icon name="search" size={48} color={colors.textMuted} />
          <Text style={[searchStyles.emptyText, { color: colors.text }]}>No results found</Text>
          <Text style={[searchStyles.emptySubtext, { color: colors.textMuted }]}>
            Try searching for a different location
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={[searchStyles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[searchStyles.header, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack} style={searchStyles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[searchStyles.headerTitle, { color: colors.text }]}>Where to?</Text>
      </View>

      {/* Search Input */}
      <View style={[searchStyles.searchContainer, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={[searchStyles.searchInput, { color: colors.text }]}
          placeholder="Search for a destination"
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleClearSearch} activeOpacity={0.7}>
            <Icon name="close-circle" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      {!searchQuery ? (
        // Show saved places and recent searches when not searching
        <View style={searchStyles.content}>
          {/* Saved Places */}
          <View style={searchStyles.section}>
            <Text style={[searchStyles.sectionTitle, { color: colors.text }]}>Saved Places</Text>
            <FlatList
              data={SAVED_PLACES}
              keyExtractor={(item) => item.id}
              renderItem={renderLocationItem}
              scrollEnabled={false}
            />
          </View>

          {/* Recent Searches */}
          <View style={searchStyles.section}>
            <Text style={[searchStyles.sectionTitle, { color: colors.text }]}>Recent</Text>
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