// src/styles/features/home.ts

import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';

/**
 * Home screen specific styles
 * Includes map-related styles and location-based UI elements
 */
export const homeFeatureStyles = StyleSheet.create({
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

  // ========== MENU BUTTON ==========
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    left: 16,
    backgroundColor: COLORS.textWhite,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },

  // ========== ACTION BUTTONS (REPOSITIONED) ==========
  actionButtons: {
    position: 'absolute',
    right: 16,
    bottom: 180,
    gap: 12,
    zIndex: 5,
  },

  actionButton: {
    backgroundColor: COLORS.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },

  // ========== BOTTOM SECTION ==========
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.textWhite,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 90 : 70,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },

  // ========== SEARCH CONTAINER (WHERE TO?) ==========
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 8,
  },

  searchPlaceholder: {
    fontSize: 18,
    color: COLORS.text,
    marginLeft: 12,
    fontWeight: '500',
  },

  // ========== DEPRECATED STYLES (KEPT FOR BACKWARD COMPATIBILITY) ==========
  // These styles are no longer used but kept to prevent breaking changes
  welcomeBanner: {
    display: 'none', // Hidden - no longer used
  },

  welcomeText: {
    display: 'none', // Hidden - no longer used
  },

  infoCard: {
    display: 'none', // Hidden - replaced by bottom section
  },

  infoHeader: {
    display: 'none',
  },

  infoTitle: {
    display: 'none',
  },

  infoAddress: {
    display: 'none',
  },

  infoCoordinates: {
    display: 'none',
  },

  // ========== SEARCH BAR (OLD - DEPRECATED) ==========
  searchBar: {
    display: 'none', // Hidden - replaced by searchContainer
  },

  searchInput: {
    display: 'none',
  },
});
