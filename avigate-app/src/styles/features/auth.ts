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
 */
export const authFeatureStyles = StyleSheet.create({
  // MAIN CONTENT WRAPPER
  authContent: {
    flex: 1,
  },

  // WELCOME SECTION
  welcomeTitle: {
    fontSize: FONT_SIZES.xxl,
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
    marginBottom: SPACING.lg,
    lineHeight: LINE_HEIGHTS.sm,
    paddingHorizontal: SPACING.base,
  },

  // SOCIAL BUTTONS
  socialButtonsContainer: {
    marginBottom: SPACING.lg,
  },

  googleButtonImage: {
    width: '100%',
    height: moderateScale(52),
  },

  // MULTI-STEP REGISTRATION
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
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
    marginBottom: SPACING.lg,
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
    marginBottom: SPACING.lg,
    lineHeight: LINE_HEIGHTS.sm,
  },

  // NAVIGATION BUTTONS
  navigationButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
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

  // GOOGLE AUTH SPECIFIC
  googleIconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  googleIconCircle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
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
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.xxl,
  },

  subtitleCentered: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.md,
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

  privacyNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.xs,
  },

  privacyText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.xs,
    flex: 1,
    textAlign: 'center',
  },

  // VERIFICATION SCREENS (ENHANCED)
  verifyIconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.base,
  },

  verifyIconCircle: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  // ENHANCED EMAIL DISPLAY
  emailText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
    lineHeight: LINE_HEIGHTS.lg,
    letterSpacing: 0.3,
    marginBottom: SPACING.md,
  },

  // EMAIL CONTAINER WITH BACKGROUND
  emailContainer: {
    backgroundColor: `${COLORS.primary}08`,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.base,
    borderRadius: BORDER_RADIUS.base,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: `${COLORS.primary}20`,
  },

  instructionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.base,
    lineHeight: LINE_HEIGHTS.sm,
    paddingHorizontal: SPACING.md,
  },

  otpWrapper: {
    marginBottom: SPACING.lg,
    marginTop: SPACING.sm,
  },

  resendSection: {
    alignItems: 'center',
    marginVertical: SPACING.base,
    paddingVertical: SPACING.sm,
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
    textDecorationLine: 'underline',
  },

  countdownText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.sm,
    fontWeight: '500',
  },

  changeEmailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },

  changeEmailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.sm,
  },

  // ========== LEGACY STYLES (kept for other screens) ==========
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
    paddingVertical: SPACING.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.sm,
  },

  backLinkText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.sm,
    textDecorationLine: 'underline',
  },

  // ========== INFO BOX ==========
  infoBox: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.base,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },

  infoTitle: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: LINE_HEIGHTS.xs,
  },

  infoList: {
    gap: 2,
  },

  infoItem: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    lineHeight: LINE_HEIGHTS.xs,
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

  backToLoginWithMargin: {
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },

  backToLoginText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.xs,
  },

  email: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    lineHeight: LINE_HEIGHTS.sm,
  },
});
