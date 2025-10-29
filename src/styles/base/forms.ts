// src/styles/base/forms.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Form element styles
 */
export const formStyles = StyleSheet.create({
  // ========== FORM CONTAINERS ==========
  form: {
    marginBottom: 24,
  },

  // ========== LABELS ==========
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },

  // ========== LINKS ==========
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },

  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ========== GENDER SELECTION ==========
  genderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },

  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },

  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },

  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  genderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 8,
  },

  genderButtonTextActive: {
    color: COLORS.textWhite,
  },

  // ========== PASSWORD REQUIREMENTS ==========
  passwordRequirements: {
    backgroundColor: COLORS.backgroundLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },

  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },

  requirementItem: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },

  // ========== OTP ==========
  otpContainer: {
    marginBottom: 32,
  },

  // ========== RESEND CODE ==========
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  resendTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  resendLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },

  resendText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },

  resendLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  countdownText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});