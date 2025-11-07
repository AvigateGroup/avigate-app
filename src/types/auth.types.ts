// src/types/auth.types.ts

export enum UserSex {
  MALE = 'male',
  FEMALE = 'female',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  sex?: UserSex;
  phoneNumber?: string;
  country: string;
  language: string;
  googleId?: string;
  authProvider: AuthProvider;
  profilePicture?: string;
  preferredLanguage: string;
  isVerified: boolean;
  isActive: boolean;
  isTestAccount: boolean;
  phoneNumberCaptured: boolean;
  lastLoginAt?: Date;
  reputationScore: number;
  totalContributions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  sex?: UserSex;
  phoneNumber?: string;
  country?: string;
  language?: string;
  fcmToken?: string;
  deviceInfo?: string;
}

export interface LoginDto {
  email: string;
  password: string;
  fcmToken?: string;
  deviceInfo?: string;
}

export interface VerifyLoginOtpDto {
  email: string;
  otpCode: string;
  fcmToken?: string;
  deviceInfo?: string;
}

export interface VerifyEmailDto {
  email: string;
  otpCode: string;
}

export interface GoogleAuthDto {
  email: string;
  googleId: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  phoneNumber?: string;
  sex?: UserSex;
  country?: string;
  language?: string;
  fcmToken?: string;
  deviceInfo?: Record<string, any>;
  idToken?: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  email: string;
  otpCode: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  sex?: UserSex;
  phoneNumber?: string;
  email?: string;
  country?: string;
  language?: string;
}

export interface DeleteAccountDto {
  password: string;
  confirmDelete: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    email?: string;
    user: User;
    accessToken?: string;
    refreshToken?: string;
    requiresVerification?: boolean;
    requiresPhoneNumber?: boolean;
    requiresOtpVerification?: boolean;
    isNewUser?: boolean;
    isTestAccount?: boolean;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface UserDevice {
  id: string;
  userId: string;
  fcmToken?: string;
  deviceFingerprint: string;
  deviceInfo?: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  platform: 'ios' | 'android' | 'web' | 'unknown';
  appVersion?: string;
  ipAddress?: string;
  lastActiveAt: Date;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserStats {
  userId: string;
  email: string;
  isVerified: boolean;
  isTestAccount: boolean;
  memberSince: string;
  lastLogin: string;
  reputationScore: number;
  totalContributions: number;
  totalDevices: number;
  activeDevices: number;
  totalOTPs: number;
  usedOTPs: number;
}
