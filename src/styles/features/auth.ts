// src/styles/features/auth.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { 
  SPACING, 
  FONT_SIZES, 
  LINE_HEIGHTS, 
  BORDER_RADIUS, 
  moderateScale,
} from '@/utils/responsive';

/**
 * Authentication feature-specific styles
 * ULTRA-COMPACT VERSION - Minimal white space
 */
export const authFeatureStyles = StyleSheet.create({
  // ========== MAIN CONTENT WRAPPER ==========
  authContent: {
    flex: 1,
    justifyContent: 'space-between',
  },

  // ========== WELCOME SECTION (ULTRA COMPACT) ==========
  welcomeTitle: {
    fontSize: FONT_SIZES.xl,              // Reduced from xxl (24) to xl (20)
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 0,                      // REMOVED margin
    lineHeight: LINE_HEIGHTS.xl,
  },

  welcomeSubtitle: {
    fontSize: FONT_SIZES.xs,              // Reduced from sm (12) to xs (10)
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.sm,             // 8pt
    lineHeight: LINE_HEIGHTS.xs,
    paddingHorizontal: SPACING.base,
    marginTop: SPACING.xs,                // 4pt gap after title
  },

  // ========== SOCIAL BUTTONS (COMPACT) ==========
  socialButtonsContainer: {
    marginBottom: SPACING.sm,             // 8pt
  },

  googleButtonImage: {
    width: '100%',
    height: moderateScale(48),            // Reduced from 52 to 48
  },

  // ========== MULTI-STEP REGISTRATION ==========
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },

  progressDot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: COLORS.border,
  },

  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: moderateScale(20),
  },

  stepContainer: {
    marginBottom: SPACING.sm,
  },

  stepTitle: {
    fontSize: FONT_SIZES.lg,              // 18px
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 0,
    lineHeight: LINE_HEIGHTS.lg,
  },

  stepSubtitle: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.xs,
    marginTop: SPACING.xs,
  },

  // ========== NAVIGATION BUTTONS ==========
  navigationButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
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
    gap: SPACING.xs,
  },

  languageButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
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
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.xs,
  },

  languageButtonTextActive: {
    color: COLORS.primary,
  },

  // ========== CHECKBOX ==========
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    marginBottom: 0,
  },

  checkbox: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(5),
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
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 0,
    lineHeight: LINE_HEIGHTS.xl,
  },

  subtitleCentered: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.xs,
    paddingHorizontal: SPACING.base,
    marginTop: SPACING.xs,
  },

  benefitsContainer: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.base,
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  benefitText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.text,
    fontWeight: '500',
    lineHeight: LINE_HEIGHTS.xs,
  },

  emailSignIn: {
    paddingVertical: SPACING.xs,
    alignItems: 'center',
  },

  emailSignInText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.sm,
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

  // ========== VERIFICATION SCREENS ==========
  verifyIconContainer: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },

  verifyIconCircle: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emailText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    lineHeight: LINE_HEIGHTS.sm,
  },

  instructionText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.xs,
  },

  otpWrapper: {
    marginBottom: SPACING.sm,
  },

  resendSection: {
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },

  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  resendLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textLight,
    lineHeight: LINE_HEIGHTS.xs,
  },

  resendLink: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.xs,
  },

  countdownText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.xs,
  },

  helpNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.base,
    marginBottom: SPACING.xs,
  },

  helpText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.xs,
    flex: 1,
    textAlign: 'center',
  },

  backLink: {
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  backLinkText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.xs,
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
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  termsText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: LINE_HEIGHTS.xs,
  },

  // ========== BACK TO LOGIN ==========
  backToLoginWithMargin: {
    paddingVertical: SPACING.xs,
    alignItems: 'center',
    marginTop: SPACING.xs,
  },

  backToLoginText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.xs,
  },

  // ========== EMAIL HIGHLIGHT ==========
  email: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    lineHeight: LINE_HEIGHTS.sm,
  },
});