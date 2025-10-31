// src/utils/helpers.ts

import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

/**
 * Get device information string for backend
 * Format: "Device Model, OS Version"
 * Example: "iPhone 12, iOS 15" or "Mozilla/5.0..."
 */
export const getDeviceInfo = (): string => {
  try {
    if (Platform.OS === 'web') {
      return navigator.userAgent;
    }

    const deviceName = Device.modelName || Device.deviceName || 'Unknown Device';
    const osVersion = Device.osVersion || 'Unknown Version';
    const osName = Platform.OS === 'ios' ? 'iOS' : 'Android';

    return `${deviceName}, ${osName} ${osVersion}`;
  } catch (error) {
    console.error('Error getting device info:', error);
    return `${Platform.OS}, ${Platform.Version}`;
  }
};

/**
 * Get FCM (Firebase Cloud Messaging) token for push notifications
 * Returns the token string or undefined if not available
 */
export const getFCMToken = async (): Promise<string | undefined> => {
  try {
    // Check if we're running on a physical device
    if (!Device.isDevice) {
      console.log('Push notifications only work on physical devices');
      return undefined;
    }

    // Request notification permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Permission for push notifications not granted');
      return undefined;
    }

    // Get the Expo push token
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });

    return tokenData.data;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return undefined;
  }
};

/**
 * Handle API errors and return user-friendly messages
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.message;
    const errors = error.response.data?.errors;

    if (errors && Array.isArray(errors)) {
      return errors.map((err: any) => err.message).join(', ');
    }

    if (message) {
      return message;
    }

    // HTTP status code messages
    switch (error.response.status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Invalid credentials. Please try again.';
      case 403:
        return 'Access denied. You don\'t have permission.';
      case 404:
        return 'Resource not found.';
      case 409:
        return 'This email or phone number is already registered.';
      case 422:
        return 'Validation error. Please check your input.';
      case 429:
        return 'Too many attempts. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'Something went wrong. Please try again.';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Network error. Please check your connection.';
  } else {
    // Error in request setup
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Format phone number for display
 * Example: "+2349076434333" -> "+234 907 643 4333"
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) return '';

  // Extract country code and number
  const match = phoneNumber.match(/^(\+\d{1,4})(\d+)$/);
  if (!match) return phoneNumber;

  const [, countryCode, number] = match;

  // Format based on length
  if (number.length === 10) {
    // Format: +234 907 643 4333
    return `${countryCode} ${number.slice(0, 3)} ${number.slice(3, 6)} ${number.slice(6)}`;
  }

  return `${countryCode} ${number}`;
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (international)
 * Example: "+2349076434333"
 */
export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneRegex = /^\+\d{1,4}\d{10}$/;
  return phoneRegex.test(phoneNumber);
};

/**
 * Capitalize first letter of each word
 */
export const capitalizeWords = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get initials from name
 * Example: "John Doe" -> "JD"
 */
export const getInitials = (firstName: string, lastName: string): string => {
  const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
  const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
  return firstInitial + lastInitial;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
};

/**
 * Format date to readable string
 * Example: "2025-10-31T09:00:00Z" -> "Oct 31, 2025"
 */
export const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format time to readable string
 * Example: "2025-10-31T09:30:00Z" -> "9:30 AM"
 */
export const formatTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return date.toLocaleTimeString('en-US', options);
};

/**
 * Get relative time string
 * Example: "2 hours ago", "3 days ago"
 */
export const getRelativeTime = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return formatDate(date);
};

/**
 * Debounce function for search/input
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate random string (for testing, temp IDs)
 */
export const generateRandomString = (length: number = 10): string => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};