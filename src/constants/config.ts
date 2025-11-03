import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Helper to get environment variables with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
  return process.env[key] || Constants.expoConfig?.extra?.[key] || fallback;
};

// Determine the correct API URL based on platform and environment
const getApiBaseUrl = (): string => {
  if (!__DEV__) {
    // Production
    return getEnvVar('EXPO_PUBLIC_PRODUCTION_API_URL', 'https://your-production-api.com/api/v1');
  }

  // Development - use different URLs based on platform
  const customUrl = getEnvVar('EXPO_PUBLIC_API_BASE_URL', '');
  
  if (customUrl) {
    return customUrl;
  }

  // Fallback URLs for different platforms
  if (Platform.OS === 'android') {
    // Android emulator
    return 'http://10.0.2.2:3000/api/v1';
  } else if (Platform.OS === 'ios') {
    // iOS simulator
    return 'http://localhost:3000/api/v1';
  } else {
    // Physical device - you need to set your IP in .env
    return 'http://192.168.0.134:3000/api/v1';
  }
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 30000,
};

export const GOOGLE_CONFIG = {
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
  OTP_TIMEOUT: 600,
  PASSWORD_MIN_LENGTH: 8,
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@avigate_access_token',
  REFRESH_TOKEN: '@avigate_refresh_token',
  USER_DATA: '@avigate_user_data',
  FCM_TOKEN: '@avigate_fcm_token',
};

// Development logging
if (__DEV__) {
  console.log('🔧 API Configuration:');
  console.log('  Platform:', Platform.OS);
  console.log('  Base URL:', API_CONFIG.BASE_URL);
  
  const requiredVars = ['EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'];
  const missing = requiredVars.filter(varName => !getEnvVar(varName));
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing required environment variables:', missing.join(', '));
  }
}