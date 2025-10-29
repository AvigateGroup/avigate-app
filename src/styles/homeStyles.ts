// src/styles/homeStyles.ts

/**
 * Backward compatibility layer for homeStyles
 * Combines base styles with home-specific styles
 * 
 * @deprecated Use individual imports from '@/styles/base' and '@/styles/features/home' instead
 * This file exists for backward compatibility only
 */

import { StyleSheet } from 'react-native';
import {
  containerStyles,
  buttonStyles,
  cardStyles,
  typographyStyles,
} from './base';
import { homeFeatureStyles } from './features/home';

/**
 * Combined home styles object for backward compatibility
 */
export const homeStyles = StyleSheet.create({
  // Base styles commonly used in home screen
  ...containerStyles,
  ...buttonStyles,
  ...cardStyles,
  ...typographyStyles,
  
  // Home-specific styles
  ...homeFeatureStyles,
});