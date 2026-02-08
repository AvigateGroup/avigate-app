// src/hooks/useGooglePlacesAutocomplete.ts

import { useState, useCallback, useRef } from 'react';
import { GOOGLE_MAPS_CONFIG } from '@/constants/config';

// Simple debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export interface PlaceAutocompleteResult {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
}

export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}

export const useGooglePlacesAutocomplete = () => {
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Search for places using Google Places Autocomplete API
   */
  const searchPlaces = async (input: string, location?: { latitude: number; longitude: number }) => {
    if (!input || input.trim().length === 0) {
      setPredictions([]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Build the URL for Google Places Autocomplete API
      const baseUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
      const params = new URLSearchParams({
        input: input.trim(),
        key: GOOGLE_MAPS_CONFIG.API_KEY,
        // Bias results towards Nigeria (specifically Port Harcourt area)
        components: 'country:ng',
      });

      // Add location bias if available
      if (location) {
        params.append('location', `${location.latitude},${location.longitude}`);
        params.append('radius', '50000'); // 50km radius
      }

      const response = await fetch(`${baseUrl}?${params.toString()}`);
      const data = await response.json();

      if (data.status === 'OK' && data.predictions) {
        const results: PlaceAutocompleteResult[] = data.predictions.map((prediction: any) => ({
          placeId: prediction.place_id,
          description: prediction.description,
          mainText: prediction.structured_formatting?.main_text || prediction.description,
          secondaryText: prediction.structured_formatting?.secondary_text || '',
        }));

        setPredictions(results);
      } else if (data.status === 'ZERO_RESULTS') {
        setPredictions([]);
      } else {
        setError('Unable to search locations. Please try again.');
        console.error('Google Places API error:', data);
        setPredictions([]);
      }
    } catch (err) {
      setError('Failed to fetch place predictions');
      console.error('Error fetching place predictions:', err);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Debounced search function to avoid too many API calls
   */
  const debouncedSearch = useCallback(
    debounce((input: string, location?: { latitude: number; longitude: number }) => {
      searchPlaces(input, location);
    }, 300),
    [],
  );

  /**
   * Get place details using Google Places Details API
   */
  const getPlaceDetails = async (placeId: string): Promise<PlaceDetails | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const baseUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
      const params = new URLSearchParams({
        place_id: placeId,
        key: GOOGLE_MAPS_CONFIG.API_KEY,
        fields: 'place_id,name,formatted_address,geometry',
      });

      const response = await fetch(`${baseUrl}?${params.toString()}`);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const result = data.result;
        return {
          placeId: result.place_id,
          name: result.name || result.formatted_address?.split(',')[0] || 'Unknown',
          address: result.formatted_address || '',
          latitude: result.geometry?.location?.lat || 0,
          longitude: result.geometry?.location?.lng || 0,
        };
      } else {
        setError('Unable to get location details. Please try again.');
        console.error('Google Places Details API error:', data);
        return null;
      }
    } catch (err) {
      setError('Failed to fetch place details');
      console.error('Error fetching place details:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Clear predictions
   */
  const clearPredictions = () => {
    setPredictions([]);
    setError(null);
  };

  return {
    predictions,
    isLoading,
    error,
    searchPlaces,
    debouncedSearch,
    getPlaceDetails,
    clearPredictions,
  };
};
