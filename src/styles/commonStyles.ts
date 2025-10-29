// src/styles/commonStyles.ts

import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants/colors';

/**
 * Common reusable styles used across the application
 * These styles help maintain consistency and reduce code duplication
 */

export const commonStyles = StyleSheet.create({
  // ========== CONTAINERS ==========
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  containerLight: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },

  containerPadded: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 16,
  },

  scrollContainer: {
    flex: 1,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  // ========== CARDS ==========
  card: {
    backgroundColor: COLORS.textWhite,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  cardWithBorder: {
    backgroundColor: COLORS.textWhite,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  infoCard: {
    backgroundColor: COLORS.textWhite,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  // ========== TEXT STYLES ==========
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

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },

  bodyText: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },

  bodyTextLight: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 20,
  },

  captionText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  linkText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },

  errorText: {
    fontSize: 14,
    color: COLORS.error,
    marginTop: 4,
  },

  // ========== FORM ELEMENTS ==========
  form: {
    marginBottom: 24,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },

  // ========== BUTTONS ==========
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonOutline: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textWhite,
  },

  buttonTextOutline: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },

  buttonDisabled: {
    backgroundColor: COLORS.disabled,
  },

  // ========== NAVIGATION ELEMENTS ==========
  backButton: {
    marginBottom: 24,
  },

  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ========== DIVIDERS ==========
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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

  horizontalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },

  // ========== ROW LAYOUTS ==========
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========== SPACING ==========
  marginTop8: {
    marginTop: 8,
  },

  marginTop16: {
    marginTop: 16,
  },

  marginTop24: {
    marginTop: 24,
  },

  marginTop32: {
    marginTop: 32,
  },

  marginBottom8: {
    marginBottom: 8,
  },

  marginBottom16: {
    marginBottom: 16,
  },

  marginBottom24: {
    marginBottom: 24,
  },

  marginBottom32: {
    marginBottom: 32,
  },

  paddingHorizontal16: {
    paddingHorizontal: 16,
  },

  paddingHorizontal24: {
    paddingHorizontal: 24,
  },

  // ========== FOOTER ==========
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
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

  // ========== LOADING ==========
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
  },

  // ========== ICONS ==========
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // ========== BADGES & STATUS ==========
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  badgeSuccess: {
    backgroundColor: `${COLORS.success}15`,
  },

  badgeError: {
    backgroundColor: `${COLORS.error}15`,
  },

  badgeWarning: {
    backgroundColor: `${COLORS.warning}15`,
  },

  badgeInfo: {
    backgroundColor: `${COLORS.info}15`,
  },

  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ========== SHADOWS ==========
  shadowLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  shadowHeavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },

  // ========== AVATARS ==========
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  avatarMedium: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.textWhite,
  },

  // ========== LISTS ==========
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.textWhite,
    borderRadius: 12,
    marginBottom: 8,
  },

  listItemBordered: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
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

  // ========== BENEFITS/FEATURES LIST ==========
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
});

// Platform-specific styles
export const platformStyles = StyleSheet.create({
  monospaceText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  safeArea: {
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
});