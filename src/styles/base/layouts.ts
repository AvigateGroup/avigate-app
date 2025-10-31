// src/styles/base/layouts.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS, LINE_HEIGHTS } from '@/utils/responsive';

/**
 * Layout and positioning styles with responsive sizing
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
    marginVertical: SPACING.xl,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },

  dividerText: {
    marginHorizontal: SPACING.base,
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
    lineHeight: LINE_HEIGHTS.base,
  },

  horizontalDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.base,
  },

  // ========== SECTIONS ==========
  section: {
    marginTop: SPACING.base,
    paddingHorizontal: SPACING.base,
  },

  sectionContent: {
    backgroundColor: COLORS.textWhite,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },

  // ========== FOOTER ==========
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.xl,
    flexWrap: 'wrap',
  },

  footerWithPadding: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.xl,
    flexWrap: 'wrap',
  },

  footerText: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
    lineHeight: LINE_HEIGHTS.base,
  },

  footerLink: {
    fontSize: FONT_SIZES.base,
    color: COLORS.primary,
    fontWeight: '600',
    lineHeight: LINE_HEIGHTS.base,
  },

  footerWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
  },

  footerTextWithIcon: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
    flex: 1,
    lineHeight: LINE_HEIGHTS.sm,
  },
});