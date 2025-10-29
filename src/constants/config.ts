// src/constants/config.ts

// IMPORTANT: Sensitive values are now stored in .env file
// This file is safe to commit to GitHub

import Constants from 'expo-constants';

// Helper to get environment variables with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
  return process.env[key] || Constants.expoConfig?.extra?.[key] || fallback;
};

export const API_CONFIG = {
  // Automatically uses the correct URL based on environment
  BASE_URL: __DEV__ 
    ? getEnvVar('EXPO_PUBLIC_API_BASE_URL', 'http://10.0.2.2:3000/api')
    : getEnvVar('EXPO_PUBLIC_PRODUCTION_API_URL', 'https://your-production-api.com/api'),
  
  TIMEOUT: 30000,
};

export const GOOGLE_CONFIG = {
  // These are loaded from .env file - safe to commit this code!
  WEB_CLIENT_ID: getEnvVar('EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID', ''),
  IOS_CLIENT_ID: getEnvVar('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID', ''),
  ANDROID_CLIENT_ID: getEnvVar('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID', ''),
};

export const GOOGLE_MAPS_CONFIG = {
  API_KEY: getEnvVar('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY', ''),
};

export const APP_CONFIG = {
  APP_NAME: 'Avigate',
  VERSION: '1.0.0',
  OTP_LENGTH: 6,
  OTP_TIMEOUT: 600, // 10 minutes in seconds
  PASSWORD_MIN_LENGTH: 8,
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@avigate_access_token',
  REFRESH_TOKEN: '@avigate_refresh_token',
  USER_DATA: '@avigate_user_data',
  FCM_TOKEN: '@avigate_fcm_token',
};

// Validation: Warn if critical environment variables are missing
if (__DEV__) {
  const requiredVars = [
    'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
  ];

  const missing = requiredVars.filter(varName => !getEnvVar(varName));
  
  if (missing.length > 0) {
    console.warn(
      '⚠️  Missing required environment variables:',
      missing.join(', '),
      '\n💡 Copy .env.example to .env and add your credentials'
    );
  }
}