// src/styles/base/typography.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Typography styles for text elements
 */
export const typographyStyles = StyleSheet.create({
  // ========== TITLES ==========
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },

  titleCentered: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },

  // ========== SUBTITLES ==========
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
  },

  subtitleCentered: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },

  // ========== BODY TEXT ==========
  bodyText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },

  bodyTextLight: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },

  captionText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // ========== SPECIAL TEXT ==========
  linkText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginTop: 4,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
  },
});