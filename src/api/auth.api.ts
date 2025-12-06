// src/api/auth.api.ts

import { apiClient } from './client';
import {
  RegisterDto,
  RequestLoginOtpDto,
  VerifyLoginOtpDto,
  VerifyEmailDto,
  GoogleAuthDto,
  AuthResponse,
  ApiResponse,
} from '@/types/auth.types';

export const authApi = {
  // Register new user 
  register: (data: RegisterDto) => apiClient.post<AuthResponse>('/auth/register', data),

  // Step 1: Request login OTP 
  requestLoginOtp: (data: RequestLoginOtpDto) =>
    apiClient.post<AuthResponse>('/auth/login/request-otp', data),

  // Step 2: Verify login OTP
  verifyLoginOtp: (data: VerifyLoginOtpDto) =>
    apiClient.post<AuthResponse>('/auth/login/verify-otp', data),

  // Resend login OTP
  resendLoginOtp: (email: string) =>
    apiClient.post<ApiResponse>('/auth/login/resend-otp', { email }),

  // Google OAuth authentication
  googleAuth: (data: GoogleAuthDto) => apiClient.post<AuthResponse>('/auth/google', data),

  // Capture phone number (for Google users)
  capturePhone: (data: { phoneNumber: string; sex?: string }) =>
    apiClient.put<AuthResponse>('/auth/capture-phone', data),

  // Verify email with OTP
  verifyEmail: (data: VerifyEmailDto) => apiClient.post<AuthResponse>('/auth/verify-email', data),

  // Resend verification email
  resendVerification: (email: string) =>
    apiClient.post<ApiResponse>('/auth/resend-verification', { email }),

  // Refresh access token
  refreshToken: (refreshToken: string) =>
    apiClient.post<ApiResponse>('/auth/refresh-token', { refreshToken }),

  // Logout
  logout: (fcmToken?: string) => apiClient.post<ApiResponse>('/auth/logout', { fcmToken }),

  // Get current user profile
  getProfile: () => apiClient.get<AuthResponse>('/auth/me'),
};