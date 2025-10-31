// src/styles/features/auth.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { 
  SPACING, 
  FONT_SIZES, 
  LINE_HEIGHTS, 
  BORDER_RADIUS, 
  moderateScale,
  ICON_SIZES,
} from '@/utils/responsive';

/**
 * Authentication feature-specific styles
 * These styles are used across authentication screens (login, register, google auth)
 * Using responsive sizing for cross-device compatibility
 */
export const authFeatureStyles = StyleSheet.create({
  // ========== SCROLL CONTENT ==========
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xxxl,
    paddingHorizontal: SPACING.base,
  },

  // ========== WELCOME SECTION ==========
  welcomeTitle: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    marginTop: SPACING.lg,
    lineHeight: LINE_HEIGHTS.xxxl,
  },

  welcomeSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: LINE_HEIGHTS.base,
    paddingHorizontal: SPACING.lg,
  },

  // ========== SOCIAL BUTTONS ==========
  socialButtonsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },

  // Google Button Image Style
  googleButtonImage: {
    width: '100%',
    height: moderateScale(56),
  },

  // ========== MULTI-STEP REGISTRATION ==========
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
    marginTop: SPACING.lg,
  },

  progressDot: {
    width: moderateScale(8),
    height: moderateScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: COLORS.border,
  },

  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: moderateScale(24),
  },

  stepContainer: {
    marginBottom: SPACING.xxl,
  },

  stepTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.xxl,
  },

  stepSubtitle: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    marginBottom: SPACING.xl,
    lineHeight: LINE_HEIGHTS.base,
  },

  // ========== NAVIGATION BUTTONS ==========
  navigationButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },

  backButton: {
    flex: 1,
  },

  nextButton: {
    flex: 2,
  },

  // ========== LANGUAGE SELECTION ==========
  languageButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },

  languageButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.textWhite,
  },

  languageButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}15`,
  },

  languageButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.base,
  },

  languageButtonTextActive: {
    color: COLORS.primary,
  },

  // ========== CHECKBOX ==========
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },

  checkbox: {
    width: ICON_SIZES.base,
    height: ICON_SIZES.base,
    borderRadius: moderateScale(6),
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },

  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  checkboxLabel: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    lineHeight: LINE_HEIGHTS.sm,
  },

  // ========== GOOGLE AUTH SPECIFIC ==========
  titleCentered: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.xxl,
  },

  subtitleCentered: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.xxl,
    lineHeight: LINE_HEIGHTS.base,
    paddingHorizontal: SPACING.lg,
  },

  benefitsContainer: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  benefitText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.text,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.base,
  },

  emailSignIn: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },

  emailSignInText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.md,
  },

  // ========== FOOTER ==========
  termsFooter: {
    marginTop: SPACING.xl,
    paddingTop: SPACING.xl,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  termsText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: LINE_HEIGHTS.sm,
  },
});