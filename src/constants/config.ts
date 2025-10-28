// src/constants/config.ts

// IMPORTANT: Update this with your actual backend URL
// For local development:
// - Android Emulator: use 10.0.2.2
// - iOS Simulator: use localhost
// - Physical Device: use your computer's IP address

export const API_CONFIG = {
  // Update this based on your environment
  BASE_URL: __DEV__ 
    ? 'http://10.0.2.2:3000/api' // Android emulator
    // ? 'http://localhost:3000/api' // iOS simulator
    // ? 'http://192.168.1.100:3000/api' // Physical device (replace with your IP)
    : 'https://your-production-api.com/api',
  
  TIMEOUT: 30000,
};

export const GOOGLE_CONFIG = {
  WEB_CLIENT_ID: 'YOUR_GOOGLE_WEB_CLIENT_ID.apps.googleusercontent.com',
  IOS_CLIENT_ID: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
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