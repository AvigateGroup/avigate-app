// src/styles/base/spacing.ts

import { StyleSheet } from 'react-native';
import { SPACING } from '@/utils/responsive';

/**
 * Spacing utility styles with responsive values
 * Based on 8pt grid system
 */
export const spacingStyles = StyleSheet.create({
  // ========== MARGIN TOP ==========
  marginTop8: {
    marginTop: SPACING.sm,
  },

  marginTop16: {
    marginTop: SPACING.base,
  },

  marginTop24: {
    marginTop: SPACING.xl,
  },

  marginTop32: {
    marginTop: SPACING.xxl,
  },

  // ========== MARGIN BOTTOM ==========
  marginBottom8: {
    marginBottom: SPACING.sm,
  },

  marginBottom16: {
    marginBottom: SPACING.base,
  },

  marginBottom20: {
    marginBottom: SPACING.lg,
  },

  marginBottom24: {
    marginBottom: SPACING.xl,
  },

  marginBottom32: {
    marginBottom: SPACING.xxl,
  },

  // ========== PADDING HORIZONTAL ==========
  paddingHorizontal16: {
    paddingHorizontal: SPACING.base,
  },

  paddingHorizontal24: {
    paddingHorizontal: SPACING.xl,
  },
});