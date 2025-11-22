// src/hooks/useLocationSearch.ts

import { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationSearchResult {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'location' | 'intermediate_stop';
  segmentName?: string;
  requiresWalking?: boolean;
  walkingDistance?: number;
}

export const useLocationSearch = () => {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Search for locations (including intermediate stops)
   */
  const searchLocations = async (query: string): Promise<LocationSearchResult[]> => {
    try {
      setIsLoading(true);
      
      const response = await axios.get(`${API_BASE_URL}/locations/search`, {
        params: { q: query },
      });

      if (response.data.success) {
        return response.data.data.locations.map((loc: any) => ({
          id: loc.id,
          name: loc.name,
          address: `${loc.city}, ${loc.state}`,
          coordinates: {
            lat: loc.latitude,
            lng: loc.longitude,
          },
          type: 'location' as const,
        }));
      }

      return [];
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Search for nearby intermediate stops
   * These are stops along routes that might be close to user's destination
   */
  const searchNearbyIntermediateStops = async (
    query: string,
    currentLocation?: { latitude: number; longitude: number },
  ): Promise<Array<{
    id: string;
    stopName: string;
    segmentName: string;
    coordinates: { lat: number; lng: number };
    requiresWalking: boolean;
    walkingDistance?: number;
  }>> => {
    try {
      // This would call a new backend endpoint
      // For now, return empty array
      // TODO: Implement backend endpoint
      return [];
    } catch (error) {
      console.error('Intermediate stop search error:', error);
      return [];
    }
  };

  /**
   * Get recent searches from local storage
   */
  const getRecentSearches = async (): Promise<LocationSearchResult[]> => {
    try {
      const recent = await AsyncStorage.getItem('recent_searches');
      return recent ? JSON.parse(recent) : [];
    } catch (error) {
      console.error('Error loading recent searches:', error);
      return [];
    }
  };

  /**
   * Save a search to recent searches
   */
  const saveToRecentSearches = async (location: LocationSearchResult) => {
    try {
      const recent = await getRecentSearches();
      
      // Remove duplicates and add to front
      const filtered = recent.filter(item => item.id !== location.id);
      const updated = [location, ...filtered].slice(0, 10); // Keep last 10

      await AsyncStorage.setItem('recent_searches', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving recent search:', error);
    }
  };

  /**
   * Get saved places (home, work, favorites)
   */
  const getSavedPlaces = async (): Promise<LocationSearchResult[]> => {
    try {
      const saved = await AsyncStorage.getItem('saved_places');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved places:', error);
      return [];
    }
  };

  /**
   * Save a place (home, work, or favorite)
   */
  const savePlace = async (
    location: LocationSearchResult,
    label: 'home' | 'work' | 'favorite',
  ) => {
    try {
      const saved = await getSavedPlaces();
      
      // Remove existing entry with same label
      const filtered = saved.filter(
        item => !(item.id === location.id || item.name === label),
      );
      
      const updated = [
        { ...location, name: label, type: 'saved' as const },
        ...filtered,
      ];

      await AsyncStorage.setItem('saved_places', JSON.stringify(updated));
      
      return { success: true };
    } catch (error) {
      console.error('Error saving place:', error);
      return { success: false, error: 'Failed to save place' };
    }
  };

  return {
    searchLocations,
    searchNearbyIntermediateStops,
    getRecentSearches,
    saveToRecentSearches,
    getSavedPlaces,
    savePlace,
    isLoading,
  };
};