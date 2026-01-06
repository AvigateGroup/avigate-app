// src/hooks/useLocationShareService.ts

import { useState } from 'react';
import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/auth.types';

interface CreateShareDto {
  shareType: 'public' | 'private' | 'event' | 'business';
  locationName: string;
  latitude: number;
  longitude: number;
  description?: string;
  expiresAt?: Date;
  eventDate?: Date;
}

interface ShareLocation {
  id: string;
  shareType: string;
  locationName: string;
  latitude: number;
  longitude: number;
  description?: string;
  shareUrl: string;
  shareToken: string;
  expiresAt?: string;
  eventDate?: string;
  createdAt: string;
  metadata?: {
    qrCodeDataUrl?: string;
    qrCodeImageUrl?: string;
  };
}

interface CreateShareResponse {
  success: boolean;
  data?: {
    shareUrl: string;
    qrCodeDataUrl?: string;
    qrCodeImageUrl?: string;
    share: ShareLocation;
  };
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

interface QRCodeResponse {
  success: boolean;
  data?: {
    qrCode: string;
    format: 'dataUrl' | 'url';
  };
  error?: string;
}

interface PrintableQRResponse {
  success: boolean;
  data?: {
    html: string;
  };
  error?: string;
}

export const useLocationShareService = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createShare = async (data: CreateShareDto): Promise<CreateShareResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiResponse<{ share: ShareLocation }>>(
        '/location-share',
        data,
      );

      if (!response.data?.share) {
        throw new Error('No data returned from server');
      }

      const share = response.data.share;

      return {
        success: true,
        data: {
          shareUrl: share.shareUrl,
          qrCodeDataUrl: share.metadata?.qrCodeDataUrl,
          qrCodeImageUrl: share.metadata?.qrCodeImageUrl,
          share,
        },
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
        '/location-share/my-shares',
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

  const getShareDetails = async (shareToken: string): Promise<GetShareDetailsResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse<ShareLocation>>(
        `/location-share/token/${shareToken}`,
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

  /**
   * Get QR code for a share
   */
  const getQRCode = async (
    shareToken: string,
    format: 'dataUrl' | 'url' = 'dataUrl',
  ): Promise<QRCodeResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse<{ qrCode: string; format: string }>>(
        `/location-share/token/${shareToken}/qr-code`,
        {
          params: { format },
        },
      );

      if (!response.data?.qrCode) {
        throw new Error('No QR code returned from server');
      }

      return {
        success: true,
        data: {
          qrCode: response.data.qrCode,
          format: response.data.format as 'dataUrl' | 'url',
        },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get QR code';
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
   * Get printable QR code HTML
   */
  const getPrintableQRCode = async (shareToken: string): Promise<PrintableQRResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.get<ApiResponse<{ html: string }>>(
        `/location-share/token/${shareToken}/qr-code/print`,
      );

      if (!response.data?.html) {
        throw new Error('No HTML returned from server');
      }

      return {
        success: true,
        data: {
          html: response.data.html,
        },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to get printable QR code';
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
   * Regenerate QR code for a share
   */
  const regenerateQRCode = async (shareId: string): Promise<QRCodeResponse> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post<
        ApiResponse<{ qrCodeDataUrl: string; qrCodeImageUrl?: string }>
      >(`/location-share/${shareId}/qr-code/regenerate`);

      if (!response.data?.qrCodeDataUrl) {
        throw new Error('No QR code returned from server');
      }

      return {
        success: true,
        data: {
          qrCode: response.data.qrCodeDataUrl,
          format: 'dataUrl',
        },
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to regenerate QR code';
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
    getQRCode,
    getPrintableQRCode,
    regenerateQRCode,
  };
};
