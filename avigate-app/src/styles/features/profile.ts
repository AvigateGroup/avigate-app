// src/styles/features/profile.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS, moderateScale } from '@/utils/responsive';

/**
 * Profile and settings screen specific styles
 */
export const profileFeatureStyles = StyleSheet.create({
  // ========== CONTAINERS ==========
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundLight,
  },

  scrollContainer: {
    flex: 1,
  },

  // ========== HEADER ==========
  header: {
    backgroundColor: COLORS.textWhite,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxl,
    alignItems: 'center',
    borderBottomLeftRadius: SPACING.xl,
    borderBottomRightRadius: SPACING.xl,
  },

  // ========== AVATAR ==========
  avatarContainer: {
    position: 'relative',
    marginBottom: SPACING.base,
  },

  avatar: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    borderWidth: 3,
    borderColor: COLORS.textWhite,
  },

  avatarPlaceholder: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: FONT_SIZES.huge + 4,
    fontWeight: '700',
    color: COLORS.textWhite,
  },

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.textWhite,
  },

  // ========== USER INFO ==========
  name: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },

  email: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },

  phone: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
  },

  // ========== STATS ==========
  statsContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.xxl,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },

  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },

  statDivider: {
    width: 1,
    height: moderateScale(40),
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.base,
  },

  // ========== SECTIONS ==========
  section: {
    marginTop: SPACING.base,
    paddingHorizontal: SPACING.base,
  },

  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },

  sectionContent: {
    backgroundColor: COLORS.textWhite,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },

  // ========== INFO CARD ==========
  infoCard: {
    backgroundColor: COLORS.textWhite,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.base,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },

  infoLabel: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textLight,
  },

  infoValue: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.text,
  },

  infoDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.xs,
  },

  // ========== STATUS BADGE ==========
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  statusText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: COLORS.success,
  },

  // ========== MENU ITEMS ==========
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.textWhite,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },

  menuItemBordered: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  menuIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  menuContent: {
    flex: 1,
  },

  menuTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },

  menuSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },

  // ========== SETTINGS ITEM ==========
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  settingIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },

  settingContent: {
    flex: 1,
  },

  settingTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs / 2,
  },

  settingSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },

  // ========== LOGOUT BUTTON ==========
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textWhite,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
  },

  logoutText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.error,
  },

  // ========== DANGER ZONE ==========
  dangerZone: {
    marginTop: SPACING.xxl,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.base,
  },

  dangerZoneTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },

  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.textWhite,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.error,
  },

  deleteButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.error,
  },

  // ========== FOOTER ==========
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },

  footerText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textMuted,
  },
});
