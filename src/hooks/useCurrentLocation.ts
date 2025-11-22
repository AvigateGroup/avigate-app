// src/hooks/useCurrentLocation.ts

import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
}

export const useCurrentLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationCoords | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
      
      if (status === 'granted') {
        getCurrentLocation();
      }
    } catch (error) {
      console.error('Permission error:', error);
      setError('Failed to request location permission');
    }
  };

  const getCurrentLocation = async (): Promise<LocationCoords | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
      };

      setCurrentLocation(coords);
      return coords;
    } catch (error) {
      console.error('Location error:', error);
      setError('Failed to get current location');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const watchLocation = async (
    callback: (location: LocationCoords) => void,
  ): Promise<Location.LocationSubscription | null> => {
    try {
      if (!locationPermission) {
        await requestLocationPermission();
      }

      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Or when moved 10 meters
        },
        location => {
          const coords: LocationCoords = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          };
          
          setCurrentLocation(coords);
          callback(coords);
        },
      );

      return subscription;
    } catch (error) {
      console.error('Watch location error:', error);
      return null;
    }
  };

  return {
    currentLocation,
    locationPermission,
    isLoading,
    error,
    getCurrentLocation,
    watchLocation,
    requestLocationPermission,
  };
};