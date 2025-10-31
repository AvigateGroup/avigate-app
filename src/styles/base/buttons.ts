// src/styles/base/buttons.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { BUTTON_HEIGHTS, BORDER_RADIUS, FONT_SIZES, ICON_SIZES, SPACING } from '@/utils/responsive';

/**
 * Button styles used throughout the application
 * Using responsive sizing for cross-device compatibility
 */
export const buttonStyles = StyleSheet.create({
  // ========== PRIMARY BUTTONS ==========
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: BUTTON_HEIGHTS.medium,
  },

  buttonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textWhite,
  },

  // ========== OUTLINE BUTTONS ==========
  buttonOutline: {
    backgroundColor: 'transparent',
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    minHeight: BUTTON_HEIGHTS.medium,
  },

  buttonTextOutline: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // ========== DISABLED STATE ==========
  buttonDisabled: {
    backgroundColor: COLORS.disabled,
  },

  // ========== NAVIGATION BUTTONS ==========
  backButton: {
    marginBottom: SPACING.xl,
  },

  backButtonWithIcon: {
    width: ICON_SIZES.xl,
    height: ICON_SIZES.xl,
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },

  backButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ========== ACTION BUTTONS ==========
  actionButton: {
    width: BUTTON_HEIGHTS.large,
    height: BUTTON_HEIGHTS.large,
    borderRadius: BUTTON_HEIGHTS.large / 2,
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
    marginTop: SPACING.sm,
  },

  googleButton: {
    marginBottom: SPACING.xl,
  },

  skipButton: {
    alignItems: 'center',
    marginTop: SPACING.base,
  },

  skipText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },

  // ========== LOGOUT/DELETE BUTTONS ==========
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textWhite,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    minHeight: BUTTON_HEIGHTS.medium,
  },

  logoutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.error,
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textWhite,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.lg,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.error,
    minHeight: BUTTON_HEIGHTS.medium,
  },

  deleteButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.error,
  },
});