// src/styles/authStyles.ts

/**
 * Backward compatibility layer for authStyles
 * Combines base styles with auth-specific styles
 * 
 * @deprecated Use individual imports from '@/styles/base' and '@/styles/features/auth' instead
 * This file exists for backward compatibility only
 */

import { StyleSheet } from 'react-native';
import {
  containerStyles,
  typographyStyles,
  buttonStyles,
  formStyles,
  layoutStyles,
  iconStyles,
  listStyles,
} from './base';
import { authFeatureStyles } from './features/auth';

/**
 * Combined auth styles object for backward compatibility
 */
export const authStyles = StyleSheet.create({
  // Base styles commonly used in auth screens
  ...containerStyles,
  ...typographyStyles,
  ...buttonStyles,
  ...formStyles,
  ...layoutStyles,
  ...iconStyles,
  ...listStyles,
  
  // Auth-specific styles
  ...authFeatureStyles,
});