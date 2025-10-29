// src/styles/base/cards.ts

import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Card component styles
 */
export const cardStyles = StyleSheet.create({
  // ========== BASIC CARDS ==========
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

  // ========== INFO CARDS ==========
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
    backgroundColor: COLORS.borderLight,
    marginVertical: 4,
  },
});