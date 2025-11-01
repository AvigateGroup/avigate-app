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
 * Optimized for better spacing and no scroll issues
 */
export const authFeatureStyles = StyleSheet.create({
  // ========== MAIN CONTENT WRAPPER (Prevents scrolling) ==========
  authContent: {
    flex: 1,
    justifyContent: 'space-between', // Distributes space evenly
  },

  // ========== WELCOME SECTION ==========
  welcomeTitle: {
    fontSize: FONT_SIZES.xxl,        // Reduced from xxxl (28) to xxl (24)
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,         // Reduced from sm to xs
    lineHeight: LINE_HEIGHTS.xxl,
  },

  welcomeSubtitle: {
    fontSize: FONT_SIZES.sm,          // Reduced from base to sm
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.base,       // Reduced from xl to base
    lineHeight: LINE_HEIGHTS.sm,
    paddingHorizontal: SPACING.base,
  },

  // ========== SOCIAL BUTTONS ==========
  socialButtonsContainer: {
    marginBottom: SPACING.base,       // Reduced from xl to base
  },

  // Google Button Image Style
  googleButtonImage: {
    width: '100%',
    height: moderateScale(52),        // Slightly reduced from 56
  },

  // ========== MULTI-STEP REGISTRATION ==========
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,       // Reduced from xxl to base
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
    marginBottom: SPACING.base,       // Reduced from xxl to base
  },

  stepTitle: {
    fontSize: FONT_SIZES.xl,          // Reduced from xxl
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,         // Reduced
    lineHeight: LINE_HEIGHTS.xl,
  },

  stepSubtitle: {
    fontSize: FONT_SIZES.sm,          // Reduced from base
    color: COLORS.textLight,
    marginBottom: SPACING.base,       // Reduced from xl
    lineHeight: LINE_HEIGHTS.sm,
  },

  // ========== NAVIGATION BUTTONS ==========
  navigationButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.base,          // Added top margin
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
    gap: SPACING.sm,                  // Reduced from md
  },

  languageButton: {
    paddingHorizontal: SPACING.base,  // Reduced from lg
    paddingVertical: SPACING.sm,      // Reduced from md
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
    fontSize: FONT_SIZES.sm,          // Reduced from base
    fontWeight: '500',
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.sm,
  },

  languageButtonTextActive: {
    color: COLORS.primary,
  },

  // ========== CHECKBOX ==========
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,                  // Reduced from md
    marginBottom: SPACING.xs,         // Reduced from sm
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
    fontSize: FONT_SIZES.xs,          // Reduced from sm
    color: COLORS.text,
    lineHeight: LINE_HEIGHTS.xs,
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