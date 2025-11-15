// src/hooks/useLocationShareService.ts

import { useState } from 'react';
import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/auth.types';

interface CreateShareDto {
  shareType: 'public' | 'private' | 'event';
  locationName: string;
  latitude: number;
  longitude: number;
  description?: string;
  expiresAt?: Date;
}

interface ShareLocation {
  id: string;
  shareType: string;
  locationName: string;
  latitude: number;
  longitude: number;
  description?: string;
  shareUrl: string;
  expiresAt?: string;
  createdAt: string;
}

interface CreateShareResponse {
  success: boolean;
  data?: ShareLocation;
  error?: string;
}

interface GetSharesResponse {
  success: boolean;
  data: ShareLocation[];
  error?: string;
}

interface DeleteShareResponse {
  success: boolean;
  error?: string;
}

interface GetShareDetailsResponse {
  success: boolean;
  data?: ShareLocation;
  error?: string;
}

export const useLocationShareService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createShare = async (data: CreateShareDto): Promise<CreateShareResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<ShareLocation>>(
        '/location-share/create',
        data
      );

      if (!response.data) {
        throw new Error('No data returned from server');
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create share';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getMyShares = async (): Promise<GetSharesResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse<{ shares: ShareLocation[] }>>(
        '/location-share/my-shares'
      );

      if (!response.data?.shares) {
        throw new Error('No data returned from server');
      }

      return {
        success: true,
        data: response.data.shares,
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch shares';
      setError(errorMessage);
      
      return {
        success: false,
        data: [],
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteShare = async (shareId: string): Promise<DeleteShareResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.delete(`/location-share/${shareId}`);

      return {
        success: true,
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete share';
      setError(errorMessage);
      
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const getShareDetails = async (shareCode: string): Promise<GetShareDetailsResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse<ShareLocation>>(
        `/location-share/public/${shareCode}`
      );

      if (!response.data) {
        throw new Error('No data returned from server');
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to fetch share details';
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
    createShare,
    getMyShares,
    deleteShare,
    getShareDetails,
  };
};