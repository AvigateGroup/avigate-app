// src/styles/base/lists.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * List items and avatar styles
 */
export const listStyles = StyleSheet.create({
  // ========== LIST ITEMS ==========
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

  // ========== MENU ITEMS ==========
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textWhite,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },

  menuItemBordered: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },

  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },

  menuSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // ========== SETTINGS ITEMS ==========
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },

  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },

  settingSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
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
