// src/styles/base/forms.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS, LINE_HEIGHTS } from '@/utils/responsive';

/**
 * Form element styles with responsive sizing
 */
export const formStyles = StyleSheet.create({
  // ========== FORM CONTAINERS ==========
  form: {
    marginBottom: SPACING.xl,
  },

  // ========== LABELS ==========
  inputLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.base,
  },

  // ========== LINKS ==========
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },

  forgotPasswordText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.base,
  },

  // ========== GENDER SELECTION ==========
  genderLabel: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
    lineHeight: LINE_HEIGHTS.base,
  },

  genderContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },

  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.base,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: SPACING.sm,
  },

  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  genderButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: LINE_HEIGHTS.md,
  },

  genderButtonTextActive: {
    color: COLORS.textWhite,
  },

  // ========== PASSWORD REQUIREMENTS ==========
  passwordRequirements: {
    backgroundColor: COLORS.backgroundLight,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.base,
    marginBottom: SPACING.xl,
  },

  requirementsTitle: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.base,
  },

  requirementItem: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textLight,
    marginBottom: SPACING.xs,
    lineHeight: LINE_HEIGHTS.sm,
  },

  // ========== OTP ==========
  otpContainer: {
    marginBottom: SPACING.xxxl,
  },

  // ========== RESEND CODE ==========
  resendContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },

  resendTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  resendLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    lineHeight: LINE_HEIGHTS.base,
  },

  resendText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.md,
  },

  resendLink: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.base,
  },

  countdownText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.base,
  },
});
