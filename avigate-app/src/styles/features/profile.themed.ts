// src/styles/features/profile.themed.ts

import { StyleSheet } from 'react-native';

/**
 * Generate themed profile styles
 * Use this with useThemedColors hook for dynamic theming
 */
export const createprofileFeatureStyles = (colors: any) =>
  StyleSheet.create({
    // ========== CONTAINERS ==========
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContainer: {
      flex: 1,
    },

    // ========== HEADER ==========
    header: {
      backgroundColor: colors.white,
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
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },

    avatarText: {
      fontSize: 36,
      fontWeight: '700',
      color: colors.textWhite,
    },

    cameraButton: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      backgroundColor: colors.primary,
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 3,
      borderColor: colors.textWhite,
    },

    // ========== USER INFO ==========
    name: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },

    email: {
      fontSize: 14,
      color: colors.textMuted,
      marginBottom: 8,
    },

    phoneContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },

    phone: {
      fontSize: 14,
      color: colors.textMuted,
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
      color: colors.primary,
      marginBottom: 4,
    },

    statLabel: {
      fontSize: 12,
      color: colors.textMuted,
    },

    statDivider: {
      width: 1,
      height: 40,
      backgroundColor: colors.border,
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
      color: colors.text,
      marginBottom: 12,
    },

    sectionContent: {
      backgroundColor: colors.white,
      borderRadius: 12,
      overflow: 'hidden',
    },

    // ========== INFO CARD ==========
    infoCard: {
      backgroundColor: colors.white,
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
      color: colors.textLight,
    },

    infoValue: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },

    infoDivider: {
      height: 1,
      backgroundColor: colors.border,
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
      color: colors.success,
    },

    // ========== MENU ITEMS ==========
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.white,
      padding: 16,
      borderRadius: 12,
      marginBottom: 8,
    },

    menuItemBordered: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    menuIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundLight,
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
      color: colors.text,
      marginBottom: 2,
    },

    menuSubtitle: {
      fontSize: 12,
      color: colors.textMuted,
    },

    // ========== SETTINGS ITEM ==========
    settingItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },

    settingIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.backgroundLight,
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
      color: colors.text,
      marginBottom: 2,
    },

    settingSubtitle: {
      fontSize: 12,
      color: colors.textMuted,
    },

    // ========== LOGOUT BUTTON ==========
    logoutButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      marginHorizontal: 16,
      marginTop: 16,
      padding: 16,
      borderRadius: 12,
      gap: 8,
    },

    logoutText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.error,
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
      color: colors.error,
      marginBottom: 12,
      paddingHorizontal: 4,
    },

    deleteButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.white,
      padding: 16,
      borderRadius: 12,
      gap: 8,
      borderWidth: 1,
      borderColor: colors.error,
    },

    deleteButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.error,
    },

    // ========== FOOTER ==========
    footer: {
      alignItems: 'center',
      paddingVertical: 24,
    },

    footerText: {
      fontSize: 12,
      color: colors.textMuted,
    },
  });
