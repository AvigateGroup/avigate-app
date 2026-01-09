// src/hooks/useNotifications.ts

import { useState } from 'react';
import { apiClient } from '@/api/client';
import { ApiResponse } from '@/types/auth.types';

export enum NotificationType {
  TRIP_STARTED = 'trip_started',
  TRIP_COMPLETED = 'trip_completed',
  TRIP_CANCELLED = 'trip_cancelled',
  NEXT_STEP = 'next_step',
  APPROACHING_STOP = 'approaching_stop',
  LOCATION_SHARED = 'location_shared',
  COMMUNITY_POST = 'community_post',
  CONTRIBUTION_APPROVED = 'contribution_approved',
  CONTRIBUTION_REJECTED = 'contribution_rejected',
  SYSTEM_ALERT = 'system_alert',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  type?: NotificationType;
  isRead?: boolean;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const useNotifications = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get user notifications
   */
  const getNotifications = async (params: GetNotificationsParams = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get<{ success: boolean; data: NotificationsResponse }>('/notifications', {
        params: {
          page: params.page || 1,
          limit: params.limit || 20,
          type: params.type,
          isRead: params.isRead,
        },
      });

      return {
        success: response.success || true,
        data: response.data,
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load notifications';
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
   * Get unread notification count
   */
  const getUnreadCount = async () => {
    try {
      const response = await apiClient.get<ApiResponse>('/notifications/unread-count');

      if (response.success) {
        return {
          success: true,
          count: response.count || 0,
        };
      }

      return {
        success: false,
        count: 0,
      };
    } catch (err: any) {
      // Silently handle errors - backend may not have this endpoint yet
      // Only log non-500 errors in development
      if (__DEV__ && err.response?.status !== 500) {
        console.warn('Get unread count error:', err.message);
      }
      return {
        success: false,
        count: 0,
      };
    }
  };

  /**
   * Mark notification as read
   */
  const markAsRead = async (notificationId: string, isRead: boolean = true) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.patch<ApiResponse>(
        `/notifications/${notificationId}/read`,
        { isRead },
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        error: 'Failed to update notification',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update notification';
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
   * Mark all notifications as read
   */
  const markAllAsRead = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.post<ApiResponse>('/notifications/mark-all-read');

      if (response.success) {
        return {
          success: true,
          message: 'All notifications marked as read',
        };
      }

      return {
        success: false,
        error: 'Failed to mark all as read',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to mark all as read';
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
   * Delete notification
   */
  const deleteNotification = async (notificationId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.delete<ApiResponse>(`/notifications/${notificationId}`);

      if (response.success) {
        return {
          success: true,
          message: 'Notification deleted',
        };
      }

      return {
        success: false,
        error: 'Failed to delete notification',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete notification';
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
   * Delete all read notifications
   */
  const deleteReadNotifications = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.delete<ApiResponse>('/notifications/read/all');

      if (response.success) {
        return {
          success: true,
          message: 'Read notifications deleted',
        };
      }

      return {
        success: false,
        error: 'Failed to delete read notifications',
      };
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete read notifications';
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
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications,
  };
};
