// src/styles/features/auth.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Authentication screen specific styles
 * (Login, Register, Forgot Password, OTP verification, etc.)
 */
export const authFeatureStyles = StyleSheet.create({
  // ========== AUTH CONTAINERS ==========
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

  // ========== INSTRUCTIONS ==========
  instruction: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
  },

  email: {
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ========== HELP & CHANGE EMAIL ==========
  helpContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },

  helpText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },

  changeEmail: {
    alignItems: 'center',
  },

  changeEmailText: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
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

  // ========== GOOGLE AUTH ==========
  emailSignIn: {
    alignItems: 'center',
    marginBottom: 24,
  },

  emailSignInText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
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
});