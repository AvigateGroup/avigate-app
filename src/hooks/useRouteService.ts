// src/hooks/useRouteService.ts

import { useState } from 'react';
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

      const response = await apiClient.post<ApiResponse>('/routes/search/smart', {
        startLat,
        startLng,
        endLat,
        endLng,
        endAddress: endLocationName, // Optional for better matching
      });

      if (response.success) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: response.message || 'Failed to find routes',
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

      const response = await apiClient.get<ApiResponse>('/routes/popular', {
        params: { city, limit },
      });

      if (response.success && response.data?.routes) {
        return {
          success: true,
          data: response.data.routes,
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

      const response = await apiClient.get<ApiResponse>(`/routes/${routeId}`);

      if (response.success && response.data?.route) {
        return {
          success: true,
          data: response.data.route,
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

      const response = await apiClient.post<ApiResponse>('/routes/trips/start', {
        routeId,
        currentLat,
        currentLng,
      });

      if (response.success && response.data?.trip) {
        return {
          success: true,
          data: response.data.trip,
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
      const response = await apiClient.get<ApiResponse>('/routes/trips/active');

      if (response.success && response.data?.trip) {
        return {
          success: true,
          data: response.data.trip,
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
  const updateTripLocation = async (
    tripId: string,
    lat: number,
    lng: number,
    accuracy?: number,
  ) => {
    try {
      const response = await apiClient.patch<ApiResponse>(`/routes/trips/${tripId}/location`, {
        lat,
        lng,
        accuracy,
      });

      if (response.success && response.data?.progress) {
        return {
          success: true,
          data: response.data.progress,
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
      const response = await apiClient.post<ApiResponse>(`/routes/trips/${tripId}/complete`, {});

      if (response.success && response.data?.trip) {
        return {
          success: true,
          data: response.data.trip,
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
      const response = await apiClient.post<ApiResponse>(`/routes/trips/${tripId}/end`, {});

      if (response.success && response.data?.trip) {
        return {
          success: true,
          data: response.data.trip,
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
      const response = await apiClient.post<ApiResponse>(`/routes/trips/${tripId}/cancel`, {
        reason,
      });

      if (response.success && response.data?.trip) {
        return {
          success: true,
          data: response.data.trip,
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
      const response = await apiClient.get<ApiResponse>('/routes/trips/history', {
        params: { limit },
      });

      if (response.success && response.data?.trips) {
        return {
          success: true,
          data: response.data.trips,
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
