// src/screens/home/HomeScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { homeStyles } from '@/styles';
import { useRouter } from 'expo-router';

interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const HomeScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const colors = useThemedColors();

  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('Getting your location...');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      // Request foreground location permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to use this feature. Please enable it in your device settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Location.requestForegroundPermissionsAsync();
                }
              },
            },
          ],
        );
        setLoading(false);
        // Set fallback location (Lagos, Nigeria)
        setLocation({
          latitude: 6.5244,
          longitude: 3.3792,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
        setAddress('Lagos, Nigeria (Default Location)');
        return;
      }

      getCurrentLocation();
    } catch (err) {
      console.warn('Error requesting location permission:', err);
      setLoading(false);
    }
  };

  const getCurrentLocation = async () => {
    try {
      // Get current position with high accuracy
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = position.coords;
      const newLocation = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setLocation(newLocation);
      setLoading(false);

      // Get address from coordinates
      getAddressFromCoordinates(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please check your location settings.',
      );
      setLoading(false);

      // Fallback to a default location (Lagos, Nigeria)
      setLocation({
        latitude: 6.5244,
        longitude: 3.3792,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setAddress('Lagos, Nigeria (Default Location)');
    }
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      // Using Expo's reverse geocoding
      const addresses = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addresses && addresses.length > 0) {
        const addr = addresses[0];
        // Format the address
        const addressParts = [
          addr.name,
          addr.street,
          addr.district,
          addr.city,
          addr.region,
          addr.country,
        ].filter(Boolean);

        setAddress(addressParts.join(', ') || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      } else {
        setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
      }
    } catch (error) {
      console.error('Error getting address:', error);
      setAddress(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
    }
  };

  const centerMapOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(location, 1000);
    }
  };

  const refreshLocation = async () => {
    setLoading(true);
    setAddress('Getting your location...');
    await getCurrentLocation();
  };

  const handleSearchPress = () => {
    // Navigate to search modal using Expo Router
    router.push('./search/search');
  };

  const handleMenuPress = () => {
    // TODO: Open drawer or menu
    Alert.alert('Menu', 'Menu functionality coming soon!', [
      { text: 'Profile', onPress: () => router.push('/(tabs)/profile') },
      { text: 'Settings', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  if (loading) {
    return (
      <View style={[homeStyles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[homeStyles.loadingText, { color: colors.text }]}>
          Getting your location...
        </Text>
      </View>
    );
  }

  return (
    <View style={homeStyles.container}>
      {/* Hamburger Menu Button */}
      <TouchableOpacity
        style={[homeStyles.menuButton, { backgroundColor: colors.white }]}
        onPress={handleMenuPress}
        activeOpacity={0.7}
      >
        <Icon name="menu" size={28} color={colors.text} />
      </TouchableOpacity>

      {/* Map */}
      {location && (
        <MapView
          ref={mapRef}
          style={homeStyles.map}
          initialRegion={location}
          showsUserLocation
          showsMyLocationButton={false}
          showsCompass
          showsScale
          onMapReady={() => setMapReady(true)}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={`${user?.firstName}'s Location`}
            description={address}
          >
            <View style={homeStyles.markerContainer}>
              <View style={[homeStyles.marker, { backgroundColor: colors.primary }]}>
                <Icon name="person" size={20} color={colors.textWhite} />
              </View>
            </View>
          </Marker>
        </MapView>
      )}

      {/* Action Buttons - Repositioned */}
      <View style={homeStyles.actionButtons}>
        {/* Center on User Button */}
        <TouchableOpacity
          style={[homeStyles.actionButton, { backgroundColor: colors.primary }]}
          onPress={centerMapOnUser}
          activeOpacity={0.7}
        >
          <Icon name="navigate" size={24} color={colors.textWhite} />
        </TouchableOpacity>

        {/* Refresh Location Button */}
        <TouchableOpacity
          style={[homeStyles.actionButton, { backgroundColor: colors.primary }]}
          onPress={refreshLocation}
          activeOpacity={0.7}
        >
          <Icon name="refresh" size={24} color={colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Bottom Section - "Where to?" Search Field */}
      <View style={homeStyles.bottomSection}>
        <TouchableOpacity
          style={[homeStyles.searchContainer, { backgroundColor: colors.white }]}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Icon name="search" size={24} color={colors.text} />
          <Text style={[homeStyles.searchPlaceholder, { color: colors.textMuted }]}>
            Where to?
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};