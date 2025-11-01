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
 * Includes Login, Register, Google Auth, and Verification screens
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
    marginBottom: SPACING.xs,
    lineHeight: LINE_HEIGHTS.xxl,
  },

  welcomeSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.base,
    lineHeight: LINE_HEIGHTS.sm,
    paddingHorizontal: SPACING.base,
  },

  // ========== SOCIAL BUTTONS ==========
  socialButtonsContainer: {
    marginBottom: SPACING.base,
  },

  // Google Button Image Style
  googleButtonImage: {
    width: '100%',
    height: moderateScale(52),
  },

  // ========== MULTI-STEP REGISTRATION ==========
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.base,
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
    marginBottom: SPACING.base,
  },

  stepTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    lineHeight: LINE_HEIGHTS.xl,
  },

  stepSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.base,
    lineHeight: LINE_HEIGHTS.sm,
  },

  // ========== NAVIGATION BUTTONS ==========
  navigationButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.base,
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
    gap: SPACING.sm,
  },

  languageButton: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
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
    fontSize: FONT_SIZES.sm,
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
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
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
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    lineHeight: LINE_HEIGHTS.xs,
  },

  // ========== GOOGLE AUTH SPECIFIC ==========
  googleIconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.base,
  },

  googleIconCircle: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    backgroundColor: COLORS.backgroundLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  titleCentered: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    lineHeight: LINE_HEIGHTS.xxl,
  },

  subtitleCentered: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.base,
    lineHeight: LINE_HEIGHTS.sm,
    paddingHorizontal: SPACING.base,
  },

  benefitsContainer: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.base,
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },

  benefitText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.sm,
  },

  emailSignIn: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },

  emailSignInText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.md,
  },

  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },

  privacyText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.xs,
    flex: 1,
  },

  // ========== VERIFICATION SCREENS ==========
  verifyIconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.base,
  },

  verifyIconCircle: {
    width: moderateScale(72),
    height: moderateScale(72),
    borderRadius: moderateScale(36),
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emailText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.base,
  },

  instructionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.base,
    lineHeight: LINE_HEIGHTS.sm,
  },

  otpWrapper: {
    marginBottom: SPACING.base,
  },

  resendSection: {
    alignItems: 'center',
    marginVertical: SPACING.base,
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resendLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    lineHeight: LINE_HEIGHTS.sm,
  },

  resendLink: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.sm,
  },

  countdownText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.sm,
  },

  helpNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.sm,
  },

  helpText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.xs,
    flex: 1,
    textAlign: 'center',
  },

  backLink: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },

  backLinkText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.sm,
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

  // ========== BACK TO LOGIN ==========
  backToLoginWithMargin: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    marginTop: SPACING.base,
  },

  backToLoginText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.sm,
  },

  // ========== EMAIL HIGHLIGHT ==========
  email: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.primary,
    lineHeight: LINE_HEIGHTS.base,
  },
});