// src/styles/features/profile.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

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
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  // ========== AVATAR ==========
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.textWhite,
  },

  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.textWhite,
  },

  // ========== USER INFO ==========
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },

  email: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 8,
  },

  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  phone: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  // ========== STATS ==========
  statsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    paddingHorizontal: 32,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },

  // ========== SECTIONS ==========
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },

  sectionContent: {
    backgroundColor: COLORS.textWhite,
    borderRadius: 12,
    overflow: 'hidden',
  },

  // ========== INFO CARD ==========
  infoCard: {
    backgroundColor: COLORS.textWhite,
    borderRadius: 12,
    padding: 16,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },

  infoLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  infoDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },

  // ========== STATUS BADGE ==========
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
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
    borderBottomColor: COLORS.border,
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

  // ========== SETTINGS ITEM ==========
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
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

  // ========== LOGOUT BUTTON ==========
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

  // ========== DANGER ZONE ==========
  dangerZone: {
    marginTop: 32,
    marginHorizontal: 16,
    marginBottom: 16,
  },

  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.error,
    marginBottom: 12,
    paddingHorizontal: 4,
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

  // ========== FOOTER ==========
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },

  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});