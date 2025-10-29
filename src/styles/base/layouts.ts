// src/styles/base/layouts.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Layout and positioning styles
 */
export const layoutStyles = StyleSheet.create({
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

  // ========== SECTIONS ==========
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },

  sectionContent: {
    backgroundColor: COLORS.textWhite,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // ========== FOOTER ==========
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
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
});