// src/screens/home/HomeScreen.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';
import { homeStyles, platformStyles } from '@/styles';

interface Location {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export const HomeScreen = () => {
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);
  
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('Getting your location...');
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Avigate needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          Alert.alert(
            'Permission Denied',
            'Location permission is required to use this feature'
          );
          setLoading(false);
        }
      } else {
        // iOS
        getCurrentLocation();
      }
    } catch (err) {
      console.warn('Error requesting location permission:', err);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
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
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert(
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
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      // Using Google Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setAddress(data.results[0].formatted_address);
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

  const refreshLocation = () => {
    setLoading(true);
    getCurrentLocation();
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
      {/* Map */}
      {location && (
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
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
        <Text style={homeStyles.welcomeText}>
          Welcome back, {user?.firstName}! 👋
        </Text>
      </View>
    </View>
  );
};
