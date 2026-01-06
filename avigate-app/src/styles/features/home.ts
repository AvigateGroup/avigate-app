// src/styles/features/home.ts

import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';

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

  // ========== TOP RIGHT NOTIFICATION BUTTON ==========
  notificationButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 16,
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

  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: COLORS.textWhite,
  },

  notificationBadgeText: {
    color: COLORS.textWhite,
    fontSize: 10,
    fontWeight: '700',
  },

  // ========== ACTION BUTTONS - MOVED MUCH HIGHER! ==========
  actionButtons: {
    position: 'absolute',
    right: 16,
    bottom: 260, // MOVED WAY UP! (was 200, now 260)
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

  // ========== BOTTOM SECTION - COVERS GOOGLE LOGO ==========
  bottomSection: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.textWhite,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 90 : 75,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },

  // ========== SEARCH CONTAINER - LIGHTER GREY BACKGROUND ==========
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  searchPlaceholder: {
    fontSize: 18,
    color: '#6B7280',
    marginLeft: 12,
    fontWeight: '500',
  },

  // ========== LOADING ==========
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.textMuted,
  },

  // ========== CONTAINER ==========
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // ========== DEPRECATED ==========
  welcomeBanner: { display: 'none' },
  welcomeText: { display: 'none' },
  infoCard: { display: 'none' },
  infoHeader: { display: 'none' },
  infoTitle: { display: 'none' },
  infoAddress: { display: 'none' },
  infoCoordinates: { display: 'none' },
  searchBar: { display: 'none' },
  searchInput: { display: 'none' },
});
