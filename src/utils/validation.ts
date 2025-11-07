// src/utils/validation.ts

import { APP_CONFIG } from '@/constants/config';

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string,
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (password.length < APP_CONFIG.PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${APP_CONFIG.PASSWORD_MIN_LENGTH} characters long`);
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // Remove all spaces and special characters except +
  const cleanNumber = phoneNumber.replace(/[\s()-]/g, '').trim();

  // Check if it starts with a country code
  if (cleanNumber.startsWith('+')) {
    // For numbers with country code
    // Nigerian format: +234XXXXXXXXXX (13 characters total, 10 digits after +234)
    // US/Canada format: +1XXXXXXXXXX (12 characters total, 10 digits after +1)

    if (cleanNumber.startsWith('+234')) {
      // Nigerian number: Should be +234 followed by 10 digits (no leading 0)
      const phoneRegex = /^\+234[789]\d{9}$/;
      return phoneRegex.test(cleanNumber);
    } else if (cleanNumber.startsWith('+1')) {
      // US/Canada: Should be +1 followed by 10 digits
      const phoneRegex = /^\+1[2-9]\d{9}$/;
      return phoneRegex.test(cleanNumber);
    } else if (cleanNumber.startsWith('+44')) {
      // UK: Should be +44 followed by 10 digits
      const phoneRegex = /^\+44[1-9]\d{9}$/;
      return phoneRegex.test(cleanNumber);
    } else {
      // Generic validation for other countries: country code + 7-15 digits
      const phoneRegex = /^\+\d{1,4}\d{7,15}$/;
      return phoneRegex.test(cleanNumber);
    }
  } else {
    // For numbers without country code (should have 10 digits)
    // Nigerian mobile numbers start with 7, 8, or 9
    const phoneRegex = /^[789]\d{9}$/;
    return phoneRegex.test(cleanNumber);
  }
};

export const validateOTP = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2 && name.trim().length <= 50;
};

export const getPasswordStrength = (
  password: string,
): {
  strength: 'weak' | 'medium' | 'strong';
  score: number;
} => {
  let score = 0;

  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { strength: 'weak', score };
  if (score <= 4) return { strength: 'medium', score };
  return { strength: 'strong', score };
};
