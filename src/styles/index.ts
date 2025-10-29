// src/styles/index.ts

/**
 * Central export file for all application styles
 * 
 * RECOMMENDED USAGE (Modern approach):
 * Import specific style modules:
 * import { containerStyles, typographyStyles, buttonStyles } from '@/styles/base';
 * import { authFeatureStyles } from '@/styles/features/auth';
 * 
 * BACKWARD COMPATIBLE USAGE (Legacy):
 * import { commonStyles, authStyles, profileStyles, homeStyles } from '@/styles';
 */

// ========== BASE STYLES (RECOMMENDED) ==========
// Import individual base style modules for better tree-shaking
export {
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

// ========== FEATURE STYLES (RECOMMENDED) ==========
// Import feature-specific styles
export {
  authFeatureStyles,
  profileFeatureStyles,
  homeFeatureStyles,
} from './features';

// ========== UTILITY STYLES ==========
export { platformStyles } from './utils';

// ========== BACKWARD COMPATIBILITY (LEGACY) ==========
// These exports maintain backward compatibility with existing code
// but are deprecated in favor of the modular imports above
export { commonStyles } from './commonStyles';
export { authStyles } from './authStyles';
export { profileStyles } from './profileStyles';
export { homeStyles } from './homeStyles';

// Re-export all for convenience
export * from './base';
export * from './features';
export * from './utils';