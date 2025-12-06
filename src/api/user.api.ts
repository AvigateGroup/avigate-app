// src/api/user.api.ts

import { apiClient } from './client';
import { UpdateProfileDto, ApiResponse, User, VerifyEmailDto } from '@/types/auth.types';

export const userApi = {
  // Get user profile
  getProfile: () => apiClient.get<ApiResponse<{ user: User }>>('/users/profile'),

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

  // Verify email change with OTP (reuses auth verification logic)
  verifyEmailChange: (data: VerifyEmailDto) =>
    apiClient.post<ApiResponse<{ user: User }>>('/auth/verify-email', data),

  // Resend email change OTP (reuses auth resend verification logic)
  resendEmailChangeOTP: (email: string) =>
    apiClient.post<ApiResponse>('/auth/resend-verification', { email }),

  // Get user devices
  getDevices: () => apiClient.get<ApiResponse>('/users/devices'),

  // Deactivate device
  deactivateDevice: (deviceId: string) =>
    apiClient.delete<ApiResponse>(`/users/devices/${deviceId}`),

  // Get user statistics
  getUserStats: () => apiClient.get<ApiResponse>('/users/stats'),

  // Delete account 
  deleteAccount: (confirmDelete: string) =>
    apiClient.delete<ApiResponse>('/users/account', {
      data: { confirmDelete },
    }),
};