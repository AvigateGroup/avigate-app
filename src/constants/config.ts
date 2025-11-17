// src/constants/config.ts
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// Helper to get environment variables with fallback
const getEnvVar = (key: string, fallback: string = ''): string => {
  // First try process.env (works in development)
  if (process.env[key]) {
    return process.env[key];
  }
  
  // Then try expo-constants extra (works in production builds)
  if (Constants.expoConfig?.extra?.[key]) {
    return Constants.expoConfig.extra[key];
  }
  
  // Finally use fallback
  return fallback;
};

// Determine the correct API URL based on platform and environment
const getApiBaseUrl = (): string => {
  // Always use production URL in production builds
  if (!__DEV__) {
    const prodUrl = getEnvVar('EXPO_PUBLIC_PRODUCTION_API_URL', '');
    if (prodUrl) {
      return prodUrl;
    }
    // Fallback production URL
    return 'https://avigate-api-production.up.railway.app/api/v1';
  }

  // Development - use different URLs based on platform
  const customUrl = getEnvVar('EXPO_PUBLIC_API_BASE_URL', '');

  if (customUrl) {
    return customUrl;
  }

  // Fallback URLs for different platforms in development
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
  WEB_CLIENT_ID: getEnvVar(
    'EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID',
    '162294874203-grlpvqerq74dttlg04gu0is3e3utle45.apps.googleusercontent.com'
  ),
  IOS_CLIENT_ID: getEnvVar('EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID', ''),
  ANDROID_CLIENT_ID: getEnvVar(
    'EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID',
    '162294874203-e3rcdcbjj1ncubsfkekcsq4cvi5i6khq.apps.googleusercontent.com'
  ),
};

export const GOOGLE_MAPS_CONFIG = {
  API_KEY: getEnvVar('EXPO_PUBLIC_GOOGLE_MAPS_API_KEY', 'AIzaSyAD8vXDmVwwexRYbZf63Fh5s'),
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

// Development and Production logging
console.log('🔧 API Configuration:');
console.log('  Environment:', __DEV__ ? 'Development' : 'Production');
console.log('  Platform:', Platform.OS);
console.log('  Base URL:', API_CONFIG.BASE_URL);
console.log('  Google Web Client ID:', GOOGLE_CONFIG.WEB_CLIENT_ID ? '✓ Set' : '✗ Missing');
console.log('  Google Android Client ID:', GOOGLE_CONFIG.ANDROID_CLIENT_ID ? '✓ Set' : '✗ Missing');

if (__DEV__) {
  const requiredVars = ['EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID'];
  const missing = requiredVars.filter(varName => !getEnvVar(varName));

  if (missing.length > 0) {
    console.warn('⚠️  Missing required environment variables:', missing.join(', '));
  }
}