// src/screens/home/HomeScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useDialog } from '@/contexts/DialogContext';
import { homeFeatureStyles } from '@/styles/features';
import { useRouter } from 'expo-router';
import { CommunityDrawer } from '@/components/CommunityDrawer';
import { SimpleWhereToDrawer } from '@/components/SimpleWhereToDrawer';
import { useNotifications } from '@/hooks/useNotifications';

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
  const dialog = useDialog();
  const { getUnreadCount } = useNotifications();

  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('Getting your location...');
  const [mapReady, setMapReady] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    requestLocationPermission();
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    const result = await getUnreadCount();
    if (result.success) {
      setUnreadCount(result.count);
    }
  };

  const requestLocationPermission = async () => {
    try {
      // Request foreground location permission
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        dialog.showWarning(
          'Permission Denied',
          'Location permission is required to use this feature. Please enable it in your device settings.'
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

      // Auto-zoom to user location after map is ready
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.animateToRegion(newLocation, 1000);
        }
      }, 500);

      // Get address from coordinates
      getAddressFromCoordinates(latitude, longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      dialog.showError(
        'Location Error',
        'Unable to get your current location. Please check your location settings.'
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

  const handleSearchPress = () => {
    // Navigate to search screen using expo-router
    router.push({
      pathname: '/search',
      params: { currentAddress: address },
    });
  };

  const handleMenuPress = () => {
    setDrawerVisible(true);
  };

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  if (loading) {
    return (
      <View style={[homeFeatureStyles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[homeFeatureStyles.loadingText, { color: colors.text }]}>
          Getting your location...
        </Text>
      </View>
    );
  }

  return (
    <View style={homeFeatureStyles.container}>
      {/* Map */}
      {location && (
        <MapView
          ref={mapRef}
          style={homeFeatureStyles.map}
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
            <View style={homeFeatureStyles.markerContainer}>
              <View style={[homeFeatureStyles.marker, { backgroundColor: colors.primary }]}>
                <Icon name="person" size={20} color={colors.textWhite} />
              </View>
            </View>
          </Marker>
        </MapView>
      )}

      {/* Hamburger Menu Button */}
      <TouchableOpacity
        style={[homeFeatureStyles.menuButton, { backgroundColor: colors.white }]}
        onPress={handleMenuPress}
        activeOpacity={0.7}
      >
        <Icon name="menu" size={28} color={colors.text} />
      </TouchableOpacity>

      {/* Top Right Icon - Notification with Badge */}
      <TouchableOpacity
        style={[homeFeatureStyles.notificationButton, { backgroundColor: colors.white }]}
        onPress={handleNotificationPress}
        activeOpacity={0.7}
      >
        <Icon name="notifications-outline" size={24} color={colors.text} />
        {unreadCount > 0 && (
          <View style={homeFeatureStyles.notificationBadge}>
            <Text style={homeFeatureStyles.notificationBadgeText}>
              {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Action Button - Center on User */}
      <View style={homeFeatureStyles.actionButtons}>
        <TouchableOpacity
          style={[homeFeatureStyles.actionButton, { backgroundColor: colors.primary }]}
          onPress={centerMapOnUser}
          activeOpacity={0.7}
        >
          <Icon name="navigate" size={24} color={colors.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Where To Drawer - Bottom Sheet */}
      <SimpleWhereToDrawer
        currentAddress={address}
        currentLocation={
          location
            ? { latitude: location.latitude, longitude: location.longitude }
            : undefined
        }
      />

      {/* Community Drawer */}
      <CommunityDrawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </View>
  );
};
