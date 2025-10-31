// src/styles/features/auth.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

/**
 * Authentication feature-specific styles
 * These styles are used across authentication screens (login, register, google auth)
 */
export const authFeatureStyles = StyleSheet.create({
  // ========== SCROLL CONTENT ==========
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },

  // ========== WELCOME SECTION ==========
  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 20,
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  // ========== TAB SWITCHER ==========
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },

  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },

  tabActive: {
    backgroundColor: COLORS.textWhite,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  tabText: {
    fontSize: 15,
    fontWeight: '500',
    color: COLORS.textMuted,
  },

  tabTextActive: {
    color: COLORS.text,
    fontWeight: '600',
  },

  // ========== SOCIAL BUTTONS ==========
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 24,
  },

  // ========== MULTI-STEP REGISTRATION ==========
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
    marginTop: 20,
  },

  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },

  progressDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },

  stepContainer: {
    marginBottom: 32,
  },

  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  stepSubtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 24,
    lineHeight: 20,
  },

  // ========== NAVIGATION BUTTONS ==========
  navigationButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
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
    gap: 12,
  },

  languageButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.textWhite,
  },

  languageButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}15`,
  },

  languageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
  },

  languageButtonTextActive: {
    color: COLORS.primary,
  },

  // ========== CHECKBOX ==========
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
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
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 20,
  },

  // ========== GOOGLE AUTH SPECIFIC ==========
  titleCentered: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitleCentered: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  benefitsContainer: {
    backgroundColor: COLORS.backgroundLight,
    padding: 20,
    borderRadius: 12,
    gap: 12,
    marginBottom: 24,
  },

  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  benefitText: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },

  emailSignIn: {
    paddingVertical: 12,
    alignItems: 'center',
  },

  emailSignInText: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // ========== FOOTER ==========
  termsFooter: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  termsText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
});