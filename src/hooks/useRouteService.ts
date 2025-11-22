// src/hooks/useRouteService.ts

import { useState } from 'react';
import axios from 'axios';
import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/auth.types';

interface SmartRouteSearchParams {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  endLocationName?: string;
}

export const useRouteService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Find smart routes with walking directions support
   */
  const findSmartRoutes = async (
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    endLocationName?: string,
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(`${API_BASE_URL}/routes/search/smart`, {
        startLat,
        startLng,
        endLat,
        endLng,
        endAddress: endLocationName, // Optional for better matching
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        error: response.data.message || 'Failed to find routes',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get popular routes for a city
   */
  const getPopularRoutes = async (city?: string, limit: number = 20) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/routes/popular`, {
        params: { city, limit },
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.routes,
        };
      }

      return {
        success: false,
        error: 'Failed to get popular routes',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get route by ID
   */
  const getRouteById = async (routeId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.get(`${API_BASE_URL}/routes/${routeId}`);

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.route,
        };
      }

      return {
        success: false,
        error: 'Route not found',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Start a trip
   */
  const startTrip = async (routeId: string, currentLat: number, currentLng: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await axios.post(
        `${API_BASE_URL}/routes/trips/start`,
        {
          routeId,
          currentLat,
          currentLng,
        },
        {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.trip,
        };
      }

      return {
        success: false,
        error: 'Failed to start trip',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get active trip
   */
  const getActiveTrip = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/routes/trips/active`, {
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.trip,
        };
      }

      return {
        success: false,
        data: null,
      };
    } catch (err: any) {
      return {
        success: false,
        data: null,
      };
    }
  };

  /**
   * Update trip location
   */
  const updateTripLocation = async (tripId: string, lat: number, lng: number, accuracy?: number) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/routes/trips/${tripId}/location`,
        { lat, lng, accuracy },
        {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.progress,
        };
      }

      return {
        success: false,
        error: 'Failed to update location',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  };

  /**
   * Complete trip
   */
  const completeTrip = async (tripId: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/routes/trips/${tripId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.trip,
        };
      }

      return {
        success: false,
        error: 'Failed to complete trip',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  };

  /**
   * End trip manually
   */
  const endTrip = async (tripId: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/routes/trips/${tripId}/end`,
        {},
        {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.trip,
        };
      }

      return {
        success: false,
        error: 'Failed to end trip',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  };

  /**
   * Cancel trip
   */
  const cancelTrip = async (tripId: string, reason?: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/routes/trips/${tripId}/cancel`,
        { reason },
        {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        },
      );

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.trip,
        };
      }

      return {
        success: false,
        error: 'Failed to cancel trip',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  };

  /**
   * Get trip history
   */
  const getTripHistory = async (limit: number = 20) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/routes/trips/history`, {
        params: { limit },
        headers: {
          Authorization: `Bearer ${await getAuthToken()}`,
        },
      });

      if (response.data.success) {
        return {
          success: true,
          data: response.data.data.trips,
        };
      }

      return {
        success: false,
        error: 'Failed to get trip history',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message,
      };
    }
  };

  /**
   * Helper: Get auth token
   */
  const getAuthToken = async (): Promise<string> => {
    // Implement your auth token retrieval here
    // This might come from AsyncStorage, SecureStore, or a context
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    const token = await AsyncStorage.getItem('auth_token');
    return token || '';
  };

  return {
    findSmartRoutes,
    getPopularRoutes,
    getRouteById,
    startTrip,
    getActiveTrip,
    updateTripLocation,
    completeTrip,
    endTrip,
    cancelTrip,
    getTripHistory,
    isLoading,
    error,
  };
};