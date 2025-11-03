// src/styles/commonStyles.ts

/**
 * Backward compatibility layer for commonStyles
 * Re-exports all base styles under the commonStyles name
 *
 * @deprecated Use individual imports from '@/styles/base' instead
 * This file exists for backward compatibility only
 */

import { StyleSheet } from 'react-native';
import {
  containerStyles,
  typographyStyles,
  buttonStyles,
  cardStyles,
  layoutStyles,
  spacingStyles,
  iconStyles,
  formStyles,
  listStyles,
  avatarStyles,
  shadowStyles,
} from './base';

/**
 * Combined common styles object for backward compatibility
 */
export const commonStyles = StyleSheet.create({
  ...containerStyles,
  ...typographyStyles,
  ...buttonStyles,
  ...cardStyles,
  ...layoutStyles,
  ...spacingStyles,
  ...iconStyles,
  ...formStyles,
  ...listStyles,
  ...avatarStyles,
  ...shadowStyles,
});

// Re-export platform styles
export { platformStyles } from './utils/platform';
