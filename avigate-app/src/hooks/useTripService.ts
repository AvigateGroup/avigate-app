// src/hooks/useTripService.ts
import { useState } from 'react';
import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/auth.types';

interface TripProgress {
  currentStepCompleted: boolean;
  nextStepStarted: boolean;
  distanceToNextWaypoint: number;
  estimatedArrival: Date;
  alerts: string[];
}

interface ActiveTrip {
  id: string;
  routeId: string;
  currentStepId: string;
  status: 'in_progress' | 'completed' | 'cancelled';
  startedAt: string;
  estimatedArrival: Date;
  currentLat: number;
  currentLng: number;
  route: {
    name: string;
    distance: number;
    estimatedDuration: number;
    minFare?: number;
    maxFare?: number;
    steps: Array<{
      id: string;
      order: number;
      fromLocation: string;
      toLocation: string;
      transportMode: string;
      instructions: string;
      duration: number;
      distance: number;
      estimatedFare?: number;
    }>;
  };
}

interface StartTripResponse {
  success: boolean;
  data?: { trip: ActiveTrip };
  error?: string;
}

interface GetActiveTripResponse {
  success: boolean;
  data?: { trip: ActiveTrip | null };
  error?: string;
}

interface UpdateLocationResponse {
  success: boolean;
  data?: { progress: TripProgress };
  error?: string;
}

interface CompleteTripResponse {
  success: boolean;
  data?: { trip: ActiveTrip };
  error?: string;
}

export const useTripService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Start a new trip
   */
  const startTrip = async (
    routeId: string,
    currentLat: number,
    currentLng: number,
  ): Promise<StartTripResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<{ trip: ActiveTrip }>>(
        '/routes/trips/start',
        {
          routeId,
          currentLat,
          currentLng,
        },
      );

      if (!response.data?.trip) {
        throw new Error('No trip data returned from server');
      }

      return {
        success: true,
        data: { trip: response.data.trip },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to start trip';
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
  const getActiveTrip = async (): Promise<GetActiveTripResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response =
        await apiClient.get<ApiResponse<{ trip: ActiveTrip | null }>>('/routes/trips/active');

      return {
        success: true,
        data: { trip: response.data?.trip || null },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get active trip';
      setError(errorMessage);

      return {
        success: false,
        data: { trip: null },
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update trip location
   */
  const updateTripLocation = async (
    tripId: string,
    location: { lat: number; lng: number; accuracy?: number },
  ): Promise<UpdateLocationResponse> => {
    try {
      const response = await apiClient.patch<ApiResponse<{ progress: TripProgress }>>(
        `/routes/trips/${tripId}/location`,
        location,
      );

      if (!response.data?.progress) {
        throw new Error('No progress data returned');
      }

      return {
        success: true,
        data: { progress: response.data.progress },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update location';

      return {
        success: false,
        error: errorMessage,
      };
    }
  };

  /**
   * Complete trip
   */
  const completeTrip = async (tripId: string): Promise<CompleteTripResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<{ trip: ActiveTrip }>>(
        `/routes/trips/${tripId}/complete`,
      );

      if (!response.data?.trip) {
        throw new Error('No trip data returned');
      }

      return {
        success: true,
        data: { trip: response.data.trip },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to complete trip';
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
   * End trip manually
   */
  const endTrip = async (tripId: string): Promise<CompleteTripResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<{ trip: ActiveTrip }>>(
        `/routes/trips/${tripId}/end`,
      );

      if (!response.data?.trip) {
        throw new Error('No trip data returned');
      }

      return {
        success: true,
        data: { trip: response.data.trip },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to end trip';
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
   * Cancel trip
   */
  const cancelTrip = async (tripId: string, reason?: string): Promise<CompleteTripResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<{ trip: ActiveTrip }>>(
        `/routes/trips/${tripId}/cancel`,
        { reason },
      );

      if (!response.data?.trip) {
        throw new Error('No trip data returned');
      }

      return {
        success: true,
        data: { trip: response.data.trip },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to cancel trip';
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
   * Get trip history
   */
  const getTripHistory = async (limit: number = 20) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse<{ trips: ActiveTrip[] }>>(
        '/routes/trips/history',
        {
          params: { limit },
        },
      );

      return {
        success: true,
        data: { trips: response.data?.trips || [] },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get trip history';
      setError(errorMessage);

      return {
        success: false,
        data: { trips: [] },
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Get trip statistics
   */
  const getTripStatistics = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse>('/routes/trips/statistics');

      return {
        success: true,
        data: response.data,
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get trip statistics';
      setError(errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    startTrip,
    getActiveTrip,
    updateTripLocation,
    completeTrip,
    endTrip,
    cancelTrip,
    getTripHistory,
    getTripStatistics,
  };
};
