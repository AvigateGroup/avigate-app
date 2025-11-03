// src/screens/home/HomeScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';
import { homeStyles, platformStyles } from '@/styles';

interface LocationType {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const HomeScreen = () => {
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);

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

  if (loading) {
    return (
      <View style={homeStyles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={homeStyles.loadingText}>Getting your location...</Text>
      </View>
    );
  }

  return (
    <View style={homeStyles.container}>
      {/* Map - PROVIDER_GOOGLE removed for Expo Go compatibility */}
      {location && (
        <MapView
          ref={mapRef}
          // Note: PROVIDER_GOOGLE is removed for Expo Go compatibility
          // Add it back only if you build a custom development build
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
              <View style={homeStyles.marker}>
                <Icon name="person" size={20} color={COLORS.textWhite} />
              </View>
            </View>
          </Marker>
        </MapView>
      )}

      {/* Location Info Card */}
      <View style={homeStyles.infoCard}>
        <View style={homeStyles.infoHeader}>
          <Icon name="location" size={24} color={COLORS.primary} />
          <Text style={homeStyles.infoTitle}>Your Location</Text>
        </View>
        <Text style={homeStyles.infoAddress}>{address}</Text>
        {location && (
          <Text style={[homeStyles.infoCoordinates, platformStyles.monospaceText]}>
            {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      {/* Action Buttons */}
      <View style={homeStyles.actionButtons}>
        {/* Center on User Button */}
        <TouchableOpacity
          style={homeStyles.actionButton}
          onPress={centerMapOnUser}
          activeOpacity={0.7}
        >
          <Icon name="navigate" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>

        {/* Refresh Location Button */}
        <TouchableOpacity
          style={homeStyles.actionButton}
          onPress={refreshLocation}
          activeOpacity={0.7}
        >
          <Icon name="refresh" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>
      </View>

      {/* Welcome Banner */}
      <View style={homeStyles.welcomeBanner}>
        <Text style={homeStyles.welcomeText}>Welcome back, {user?.firstName}! 👋</Text>
      </View>
    </View>
  );
};
