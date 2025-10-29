// src/styles/base/icons.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Icon, badge, and status indicator styles
 */
export const iconStyles = StyleSheet.create({
  // ========== ICON CONTAINERS ==========
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

  iconContainerLarge: {
    alignItems: 'center',
    marginBottom: 32,
  },

  googleIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // ========== BADGES ==========
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

  // ========== STATUS INDICATORS ==========
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
});