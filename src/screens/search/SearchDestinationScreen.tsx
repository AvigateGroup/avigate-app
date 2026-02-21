// src/screens/search/SearchDestinationScreen.tsx (FIXED)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { searchStyles } from '@/styles/features';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useCurrentLocation } from '@/hooks/useCurrentLocation';

interface LocationSuggestion {
  id: string;
  name: string;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  type: 'recent' | 'saved' | 'search' | 'intermediate_stop';
  segmentName?: string; // For intermediate stops
  requiresWalking?: boolean; // NEW - indicates walking needed
  walkingDistance?: number; // NEW - distance in meters
}

type HomeStackParamList = {
  HomeMain: undefined;
  SearchDestination: undefined;
};

type SearchDestinationScreenNavigationProp = NativeStackNavigationProp<HomeStackParamList>;

export const SearchDestinationScreen = () => {
  const navigation = useNavigation<SearchDestinationScreenNavigationProp>();
  const colors = useThemedColors();
  const { currentLocation, getCurrentLocation } = useCurrentLocation();
  const {
    searchLocations,
    getRecentSearches,
    getSavedPlaces,
    searchNearbyIntermediateStops, // NEW - Search intermediate stops
    isLoading,
  } = useLocationSearch();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<LocationSuggestion[]>([]);
  const [savedPlaces, setSavedPlaces] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    const [recent, saved] = await Promise.all([getRecentSearches(), getSavedPlaces()]);

    // FIX: Map the results to match LocationSuggestion type
    const mappedRecent: LocationSuggestion[] = recent.map(item => ({
      id: item.id,
      name: item.name,
      address: item.address,
      coordinates: item.coordinates,
      type: 'recent' as const, // Convert to 'recent' type
      segmentName: item.segmentName,
      requiresWalking: item.requiresWalking,
      walkingDistance: item.walkingDistance,
    }));

    const mappedSaved: LocationSuggestion[] = saved.map(item => ({
      id: item.id,
      name: item.name,
      address: item.address,
      coordinates: item.coordinates,
      type: 'saved' as const, // Convert to 'saved' type
      segmentName: item.segmentName,
      requiresWalking: item.requiresWalking,
      walkingDistance: item.walkingDistance,
    }));

    setRecentSearches(mappedRecent);
    setSavedPlaces(mappedSaved);
  };

  const handleSearch = async (text: string) => {
    setSearchQuery(text);

    if (text.length > 2) {
      setIsSearching(true);

      try {
        // FIX 1: Convert currentLocation to the expected format
        const locationForSearch = currentLocation
          ? {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }
          : undefined;

        // Search both regular locations and intermediate stops
        const [regularResults, intermediateStops] = await Promise.all([
          searchLocations(text),
          searchNearbyIntermediateStops(text, locationForSearch),
        ]);

        // FIX 2: Properly map the type from 'location' to 'search'
        const combined: LocationSuggestion[] = [
          ...regularResults.map(loc => ({
            id: loc.id,
            name: loc.name,
            address: loc.address,
            coordinates: loc.coordinates,
            type: 'search' as const, // Explicitly set to 'search' type
          })),
          ...intermediateStops.map(stop => ({
            id: stop.id,
            name: stop.stopName,
            address: stop.segmentName,
            coordinates: stop.coordinates,
            type: 'intermediate_stop' as const,
            segmentName: stop.segmentName,
            requiresWalking: stop.requiresWalking,
            walkingDistance: stop.walkingDistance,
          })),
        ];

        setSuggestions(combined);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectLocation = (location: LocationSuggestion) => {
    Keyboard.dismiss();

    // TODO: Navigate to route planning screen when it's added to the navigator
    // For now, just show a placeholder toast
    Toast.show({
      type: 'info',
      text1: 'Route Planning',
      text2: 'Route planning feature coming soon',
    });
  };

  const handleUseCurrentLocation = async () => {
    const location = await getCurrentLocation();
    if (location) {
      // TODO: Navigate to route planning screen when it's added to the navigator
      Toast.show({
        type: 'info',
        text1: 'Coming Soon',
        text2: 'Use current location feature will be available soon',
      });
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
    Keyboard.dismiss();
  };

  const renderLocationItem = ({ item }: { item: LocationSuggestion }) => {
    let iconName = 'location';
    let iconColor = colors.primary;
    let badge = null;

    if (item.type === 'recent') {
      iconName = 'time-outline';
      iconColor = colors.textMuted;
    } else if (item.type === 'saved') {
      iconName = item.name === 'Home' ? 'home' : 'briefcase';
      iconColor = colors.primary;
    } else if (item.type === 'intermediate_stop') {
      iconName = 'bus-outline';
      iconColor = colors.info;
      badge = (
        <View style={[searchStyles.badge, { backgroundColor: colors.infoLight }]}>
          <Text style={[searchStyles.badgeText, { color: colors.info }]}>On Route</Text>
        </View>
      );
    }

    // NEW - Show walking indicator if needed
    if (item.requiresWalking && item.walkingDistance) {
      badge = (
        <View style={[searchStyles.badge, { backgroundColor: colors.warningLight }]}>
          <Icon name="walk-outline" size={12} color={colors.warning} />
          <Text style={[searchStyles.badgeText, { color: colors.warning }]}>
            {Math.round(item.walkingDistance)}m walk
          </Text>
        </View>
      );
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={[searchStyles.suggestionName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            {badge}
          </View>
          <Text
            style={[searchStyles.suggestionAddress, { color: colors.textMuted }]}
            numberOfLines={1}
          >
            {item.address}
          </Text>
          {item.type === 'intermediate_stop' && (
            <Text style={[searchStyles.suggestionMeta, { color: colors.info }]}>
              Stop on: {item.segmentName}
            </Text>
          )}
        </View>
        <Icon name="chevron-forward" size={20} color={colors.textMuted} />
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (isSearching) {
      return (
        <View style={searchStyles.emptyState}>
          <ActivityIndicator size="large" color={colors.primary} />
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
            Try searching for landmarks, streets, or businesses
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView style={[searchStyles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          searchStyles.header,
          { backgroundColor: colors.white, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={searchStyles.backButton}>
          <Icon name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[searchStyles.headerTitle, { color: colors.text }]}>Where to?</Text>
      </View>

      {/* Search Input */}
      <View
        style={[
          searchStyles.searchContainer,
          { backgroundColor: colors.white, borderBottomColor: colors.border },
        ]}
      >
        <Icon name="search" size={20} color={colors.textMuted} />
        <TextInput
          style={[searchStyles.searchInput, { color: colors.text }]}
          placeholder="Hotels, markets, streets, landmarks..."
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

      {/* Current Location Button */}
      <TouchableOpacity
        style={[searchStyles.currentLocationButton, { backgroundColor: colors.white }]}
        onPress={handleUseCurrentLocation}
        activeOpacity={0.7}
      >
        <View style={[searchStyles.iconContainer, { backgroundColor: colors.primaryLight }]}>
          <Icon name="navigate" size={24} color={colors.primary} />
        </View>
        <Text style={[searchStyles.suggestionName, { color: colors.primary }]}>
          Use Current Location
        </Text>
      </TouchableOpacity>

      {/* Content */}
      {!searchQuery ? (
        <View style={searchStyles.content}>
          {/* Saved Places */}
          {savedPlaces.length > 0 && (
            <View style={searchStyles.section}>
              <Text style={[searchStyles.sectionTitle, { color: colors.text }]}>Saved Places</Text>
              <FlatList
                data={savedPlaces}
                keyExtractor={item => item.id}
                renderItem={renderLocationItem}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <View style={searchStyles.section}>
              <Text style={[searchStyles.sectionTitle, { color: colors.text }]}>Recent</Text>
              <FlatList
                data={recentSearches}
                keyExtractor={item => item.id}
                renderItem={renderLocationItem}
                scrollEnabled={false}
              />
            </View>
          )}

          {/* Quick Tips */}
          <View style={[searchStyles.tipsCard, { backgroundColor: colors.infoLight }]}>
            <Icon name="bulb-outline" size={24} color={colors.info} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[searchStyles.tipsTitle, { color: colors.text }]}>💡 Search Tips</Text>
              <Text style={[searchStyles.tipsText, { color: colors.textMuted }]}>
                {
                  '• Search for hotels, schools, or markets\n• Use landmarks like "near Access Bank"\n• Search intermediate stops like "Wimpy Junction"'
                }
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={suggestions}
          keyExtractor={item => item.id}
          renderItem={renderLocationItem}
          ListEmptyComponent={renderEmptyState}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
};
