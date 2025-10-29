// src/styles/homeStyles.ts

import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../constants/colors';

/**
 * Styles specific to the Home Screen
 * Includes map-related styles and location-based UI elements
 */

export const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textLight,
  },

  // ========== MAP STYLES ==========
  map: {
    flex: 1,
  },

  markerContainer: {
    alignItems: 'center',
  },

  marker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.textWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },

  // ========== BANNERS & OVERLAYS ==========
  welcomeBanner: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: COLORS.textWhite,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  welcomeText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },

  // ========== INFO CARD ==========
  infoCard: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    backgroundColor: COLORS.textWhite,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 8,
  },

  infoAddress: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: 4,
  },

  infoCoordinates: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  // ========== ACTION BUTTONS ==========
  actionButtons: {
    position: 'absolute',
    right: 16,
    bottom: 280,
    gap: 12,
  },

  actionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },

  // ========== SEARCH BAR ==========
  searchBar: {
    position: 'absolute',
    top: 80,
    left: 16,
    right: 16,
    backgroundColor: COLORS.textWhite,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
});