// src/styles/utils/platform.ts

import { StyleSheet, Platform } from 'react-native';

/**
 * Platform-specific utility styles
 */
export const platformStyles = StyleSheet.create({
  monospaceText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  safeArea: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
});
