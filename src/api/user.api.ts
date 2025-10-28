// src/api/user.api.ts

import { apiClient } from './client';
import { UpdateProfileDto, ApiResponse, User } from '@/types/auth.types';

export const userApi = {
  // Get user profile
  getProfile: () => 
    apiClient.get<ApiResponse<{ user: User }>>('/users/profile'),

  // Update user profile
  updateProfile: (data: UpdateProfileDto) => 
    apiClient.put<ApiResponse<{ user: User }>>('/users/profile', data),

  // Upload profile picture
  uploadProfilePicture: (file: FormData) => 
    apiClient.post<ApiResponse<{ profilePicture: string }>>('/users/profile/picture', file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  // Get user devices
  getDevices: () => 
    apiClient.get<ApiResponse>('/users/devices'),

  // Deactivate device
  deactivateDevice: (deviceId: string) => 
    apiClient.delete<ApiResponse>(`/users/devices/${deviceId}`),

  // Get user statistics
  getUserStats: () => 
    apiClient.get<ApiResponse>('/users/stats'),

  // Delete account
  deleteAccount: (password: string, confirmDelete: string) => 
    apiClient.delete<ApiResponse>('/users/account', {
      data: { password, confirmDelete },
    }),
};