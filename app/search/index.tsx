// app/search/index.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Location from 'expo-location';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useRouteService } from '@/hooks/useRouteService';
import {
  useGooglePlacesAutocomplete,
  PlaceAutocompleteResult,
} from '@/hooks/useGooglePlacesAutocomplete';
import { useDialog } from '@/contexts/DialogContext';

interface Destination {
  id: string;
  name: string;
  address: string;
  distance?: string;
  latitude: number;
  longitude: number;
  type: 'recent' | 'saved' | 'restaurant' | 'shopping' | 'landmark';
}

export default function SearchDestination() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const colors = useThemedColors();
  const { getPopularRoutes } = useRouteService();
  const {
    predictions,
    debouncedSearch,
    getPlaceDetails,
    clearPredictions,
    isLoading: autocompleteLoading,
  } = useGooglePlacesAutocomplete();
  const dialog = useDialog();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  useEffect(() => {
    loadDestinations();
  }, []);

  const loadDestinations = async () => {
    try {
      setLoading(true);

      // Get current location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Get popular routes (destinations)
      const result = await getPopularRoutes('Port Harcourt', 20);

      if (result.success && result.data) {
        // Transform routes to destinations
        const popularDestinations: Destination[] = result.data.map((route: any, index: number) => ({
          id: route.id || `dest-${index}`,
          name: route.endLocationName || route.destination || 'Unknown Destination',
          address: route.endAddress || 'Port Harcourt',
          distance: route.distance ? `${(route.distance / 1000).toFixed(1)} km` : undefined,
          latitude: route.endLat,
          longitude: route.endLng,
          type: index < 3 ? 'recent' : 'landmark',
        }));

        setDestinations(popularDestinations);
      } else {
        console.error('Failed to load destinations:', result.error);
        dialog.showError(
          'Error',
          'Unable to load destinations. Please check your internet connection and try again.',
        );
      }
    } catch (error) {
      console.error('Error loading destinations:', error);
      dialog.showError(
        'Error',
        'Unable to load destinations. Please check your internet connection and try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);

    if (text.trim().length > 0) {
      setShowAutocomplete(true);
      // Trigger Google Places Autocomplete
      debouncedSearch(text, currentLocation || undefined);
    } else {
      setShowAutocomplete(false);
      clearPredictions();
    }
  };

  const handleAutocompleteSelect = async (prediction: PlaceAutocompleteResult) => {
    setSearchQuery(prediction.mainText);
    setShowAutocomplete(false);
    clearPredictions();

    // Get place details
    const placeDetails = await getPlaceDetails(prediction.placeId);

    if (placeDetails) {
      // Navigate to route details with selected place
      router.push({
        pathname: '/search/route-details',
        params: {
          destName: placeDetails.name,
          destAddress: placeDetails.address,
          destLat: placeDetails.latitude,
          destLng: placeDetails.longitude,
          startLat: currentLocation?.latitude,
          startLng: currentLocation?.longitude,
        },
      });
    }
  };

  const handleDestinationSelect = (destination: Destination) => {
    // Navigate to route details with selected destination
    router.push({
      pathname: '/search/route-details',
      params: {
        destName: destination.name,
        destAddress: destination.address,
        destLat: destination.latitude,
        destLng: destination.longitude,
        startLat: currentLocation?.latitude,
        startLng: currentLocation?.longitude,
      },
    });
  };

  const getIconName = (type: Destination['type']) => {
    switch (type) {
      case 'recent':
        return 'time-outline';
      case 'saved':
        return 'bookmark';
      case 'restaurant':
        return 'restaurant-outline';
      case 'shopping':
        return 'bag-outline';
      case 'landmark':
        return 'location-outline';
      default:
        return 'location-outline';
    }
  };

  const filteredDestinations = searchQuery
    ? destinations.filter(
        dest =>
          dest.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dest.address?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : destinations;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.white }]}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Icon name="close" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Your route</Text>
      </View>

      {/* Origin */}
      <View style={[styles.routeInputs, { backgroundColor: colors.white }]}>
        <View style={styles.inputRow}>
          <Icon name="radio-button-on" size={20} color={colors.primary} />
          <Text style={[styles.originText, { color: colors.text }]}>
            {params.currentAddress || 'Port Harcourt 500102'}
          </Text>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="add" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.inputRow, { marginTop: 12 }]}>
          <Icon name="search" size={20} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Dropoff location"
            placeholderTextColor={colors.textMuted}
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                setSearchQuery('');
                setShowAutocomplete(false);
                clearPredictions();
              }}
            >
              <Icon name="close-circle" size={24} color={colors.textMuted} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.addButton}>
            <Icon name="locate" size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton}>
            <Icon name="swap-vertical" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Destinations List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {/* Google Places Autocomplete Predictions */}
          {showAutocomplete && searchQuery.length > 0 && (
            <>
              {autocompleteLoading && (
                <View style={styles.autocompleteLoadingContainer}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={[styles.autocompleteLoadingText, { color: colors.textMuted }]}>
                    Searching...
                  </Text>
                </View>
              )}

              {predictions.map(prediction => (
                <TouchableOpacity
                  key={prediction.placeId}
                  style={[styles.destinationItem, { backgroundColor: colors.white }]}
                  onPress={() => handleAutocompleteSelect(prediction)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                    <Icon name="location" size={22} color={colors.primary} />
                  </View>

                  <View style={styles.destinationInfo}>
                    <Text style={[styles.destinationName, { color: colors.text }]}>
                      {prediction.mainText}
                    </Text>
                    <Text style={[styles.destinationAddress, { color: colors.textMuted }]}>
                      {prediction.secondaryText}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {!autocompleteLoading && predictions.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    No places found
                  </Text>
                </View>
              )}

              {/* Divider */}
              {predictions.length > 0 && (
                <View style={styles.divider}>
                  <View style={[styles.dividerLine, { backgroundColor: colors.textMuted }]} />
                  <Text style={[styles.dividerText, { color: colors.textMuted }]}>
                    Popular destinations
                  </Text>
                  <View style={[styles.dividerLine, { backgroundColor: colors.textMuted }]} />
                </View>
              )}
            </>
          )}

          {/* Popular/Recent Destinations */}
          {!showAutocomplete &&
            filteredDestinations.map(destination => (
              <TouchableOpacity
                key={destination.id}
                style={[styles.destinationItem, { backgroundColor: colors.white }]}
                onPress={() => handleDestinationSelect(destination)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <Icon name={getIconName(destination.type)} size={22} color={colors.text} />
                </View>

                <View style={styles.destinationInfo}>
                  <Text style={[styles.destinationName, { color: colors.text }]}>
                    {destination.name}
                  </Text>
                  <Text style={[styles.destinationAddress, { color: colors.textMuted }]}>
                    {destination.address}
                  </Text>
                </View>

                {destination.distance && (
                  <Text style={[styles.distance, { color: colors.textMuted }]}>
                    {destination.distance}
                  </Text>
                )}
              </TouchableOpacity>
            ))}

          {!showAutocomplete && filteredDestinations.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                No destinations found
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  routeInputs: {
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  originText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    paddingVertical: 4,
  },
  addButton: {
    padding: 4,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  destinationAddress: {
    fontSize: 14,
  },
  distance: {
    fontSize: 14,
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
  },
  autocompleteLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  autocompleteLoadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    opacity: 0.3,
  },
  dividerText: {
    fontSize: 12,
    marginHorizontal: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
