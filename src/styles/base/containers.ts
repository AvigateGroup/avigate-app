// src/styles/base/containers.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Base container styles used throughout the application
 */
export const containerStyles = StyleSheet.create({
  // ========== BASIC CONTAINERS ==========
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  containerLight: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },

  containerPadded: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },

  scrollContainer: {
    flex: 1,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  // ========== LOADING ==========
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});