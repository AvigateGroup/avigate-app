// src/styles/features/home.ts

import { StyleSheet, Platform } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING, FONT_SIZES, BORDER_RADIUS, moderateScale, platformValue } from '@/utils/responsive';

export const homeFeatureStyles = StyleSheet.create({
  // ========== MAP STYLES ==========
  map: {
    flex: 1,
  },

  markerContainer: {
    alignItems: 'center',
  },

  marker: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
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
    top: platformValue(moderateScale(60), moderateScale(50)),
    left: SPACING.base,
    backgroundColor: COLORS.textWhite,
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
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
    top: platformValue(moderateScale(60), moderateScale(50)),
    right: SPACING.base,
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
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
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: '#EF4444',
    minWidth: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    borderWidth: 2,
    borderColor: COLORS.textWhite,
  },

  notificationBadgeText: {
    color: COLORS.textWhite,
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },

  // ========== ACTION BUTTONS - MOVED MUCH HIGHER! ==========
  actionButtons: {
    position: 'absolute',
    right: SPACING.base,
    bottom: moderateScale(260), // MOVED WAY UP! (was 200, now 260)
    gap: SPACING.md,
    zIndex: 5,
  },

  actionButton: {
    backgroundColor: COLORS.primary,
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
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
    paddingHorizontal: SPACING.base,
    paddingTop: SPACING.lg,
    paddingBottom: platformValue(moderateScale(90), moderateScale(75)),
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
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  searchPlaceholder: {
    fontSize: FONT_SIZES.lg,
    color: '#6B7280',
    marginLeft: SPACING.md,
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
    marginTop: SPACING.base,
    fontSize: FONT_SIZES.md,
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
