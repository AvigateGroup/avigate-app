// src/styles/authStyles.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

/**
 * Styles specific to authentication screens
 * (Login, Register, Forgot Password, OTP verification, etc.)
 */

export const authStyles = StyleSheet.create({
  // ========== CONTAINERS ==========
  container: {
    flex: 1,
    paddingTop: 20,
  },

  scrollContainer: {
    flex: 1,
    paddingTop: 20,
  },

  centeredContainer: {
    flex: 1,
    paddingTop: 40,
  },

  // ========== TITLES & TEXT ==========
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

  email: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  instruction: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },

  // ========== NAVIGATION ==========
  backButton: {
    marginBottom: 24,
  },

  backButtonWithIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },

  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ========== FORMS ==========
  form: {
    marginBottom: 24,
  },

  submitButton: {
    marginTop: 8,
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

  // ========== DIVIDERS ==========
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.textMuted,
  },

  // ========== FOOTER ==========
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  footerWithPadding: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
  },

  footerText: {
    fontSize: 14,
    color: COLORS.textLight,
  },

  footerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  footerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  footerTextWithIcon: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },

  // ========== OTP STYLES ==========
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

  // ========== INFO BOX ==========
  infoBox: {
    backgroundColor: COLORS.backgroundLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },

  // ========== HELP CONTAINER ==========
  helpContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  helpText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },

  // ========== BACK TO LOGIN ==========
  backToLogin: {
    alignItems: 'center',
  },

  backToLoginWithMargin: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },

  backToLoginText: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },

  // ========== ICON CONTAINER ==========
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  iconContainerLarge: {
    alignItems: 'center',
    marginBottom: 32,
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  googleIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // ========== BENEFITS ==========
  benefitsContainer: {
    marginBottom: 32,
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },

  benefitText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
  },

  // ========== GOOGLE AUTH ==========
  googleButton: {
    marginBottom: 24,
  },

  emailSignIn: {
    alignItems: 'center',
    marginBottom: 24,
  },

  emailSignInText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
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

  // ========== SKIP BUTTON ==========
  skipButton: {
    alignItems: 'center',
    marginTop: 16,
  },

  skipText: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },

  // ========== CHANGE EMAIL ==========
  changeEmail: {
    alignItems: 'center',
  },

  changeEmailText: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },
});