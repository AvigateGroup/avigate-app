// src/styles/base/buttons.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Button styles used throughout the application
 */
export const buttonStyles = StyleSheet.create({
  // ========== PRIMARY BUTTONS ==========
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textWhite,
  },

  // ========== OUTLINE BUTTONS ==========
  buttonOutline: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  buttonTextOutline: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ========== DISABLED STATE ==========
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
  },

  // ========== NAVIGATION BUTTONS ==========
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

  // ========== ACTION BUTTONS ==========
  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  // ========== SPECIALIZED BUTTONS ==========
  submitButton: {
    marginTop: 8,
  },

  googleButton: {
    marginBottom: 24,
  },

  skipButton: {
    alignItems: 'center',
    marginTop: 16,
  },

  skipText: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },

  // ========== LOGOUT/DELETE BUTTONS ==========
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textWhite,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textWhite,
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.error,
  },

  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.error,
  },
});