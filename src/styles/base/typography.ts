// src/styles/base/typography.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { FONT_SIZES, LINE_HEIGHTS } from '@/utils/responsive';

/**
 * Typography styles for text elements
 * Using responsive font sizing for cross-device compatibility
 */
export const typographyStyles = StyleSheet.create({
  // ========== TITLES ==========
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    lineHeight: LINE_HEIGHTS.xxxl,
  },

  titleCentered: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: LINE_HEIGHTS.xxxl,
  },

  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: LINE_HEIGHTS.md,
  },

  // ========== SUBTITLES ==========
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: 32,
    lineHeight: LINE_HEIGHTS.md,
  },

  subtitleCentered: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: LINE_HEIGHTS.md,
  },

  // ========== BODY TEXT ==========
  bodyText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    lineHeight: LINE_HEIGHTS.base,
  },

  bodyTextLight: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    lineHeight: LINE_HEIGHTS.base,
  },

  captionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.sm,
  },

  // ========== SPECIAL TEXT ==========
  linkText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.base,
  },

  errorText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.error,
    marginTop: 4,
    lineHeight: LINE_HEIGHTS.base,
  },

  loadingText: {
    marginTop: 16,
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    lineHeight: LINE_HEIGHTS.md,
  },
});