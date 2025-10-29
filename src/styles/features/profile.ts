// src/styles/features/profile.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Profile and settings screen specific styles
 */
export const profileFeatureStyles = StyleSheet.create({
  // ========== HEADER ==========
  header: {
    backgroundColor: COLORS.textWhite,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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