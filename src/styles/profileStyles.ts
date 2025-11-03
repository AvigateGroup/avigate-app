// src/styles/profileStyles.ts

/**
 * Backward compatibility layer for profileStyles
 * Combines base styles with profile-specific styles
 *
 * @deprecated Use individual imports from '@/styles/base' and '@/styles/features/profile' instead
 * This file exists for backward compatibility only
 */

import { StyleSheet } from 'react-native';
import { containerStyles, avatarStyles, listStyles, buttonStyles, cardStyles } from './base';
import { profileFeatureStyles } from './features/profile';

/**
 * Combined profile styles object for backward compatibility
 */
export const profileStyles = StyleSheet.create({
  // Base styles commonly used in profile screens
  ...containerStyles,
  ...avatarStyles,
  ...listStyles,
  ...buttonStyles,
  ...cardStyles,

  // Profile-specific styles
  ...profileFeatureStyles,
});
