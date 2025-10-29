// src/styles/index.ts

/**
 * Central export file for all application styles
 * Import styles using: import { commonStyles, authStyles } from '@/styles';
 */

export { commonStyles, platformStyles } from './commonStyles';
export { authStyles } from './authStyles';
export { profileStyles } from './profileStyles';
export { homeStyles } from './homeStyles';

// Re-export for convenience
export * from './commonStyles';
export * from './authStyles';
export * from './profileStyles';
export * from './homeStyles';