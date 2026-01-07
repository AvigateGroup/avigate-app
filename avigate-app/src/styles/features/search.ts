// src/styles/features/searchStyles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';
import { SPACING, FONT_SIZES, LINE_HEIGHTS, BORDER_RADIUS, moderateScale } from '@/utils/responsive';

export const searchStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    marginRight: SPACING.base,
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.md + 2,
    borderRadius: BORDER_RADIUS.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  // Badges
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },

  badgeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginLeft: SPACING.md,
    paddingVertical: 0,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.text,
    marginHorizontal: SPACING.base,
    marginBottom: SPACING.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.base,
    paddingHorizontal: SPACING.base,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  suggestionText: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  suggestionName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  suggestionAddress: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
  },
  emptyState: {
    padding: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.base,
    marginBottom: SPACING.sm,
  },
  emptySubtext: {
    fontSize: FONT_SIZES.base,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: SPACING.xxl,
  },

  // Current location button
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: SPACING.md,
  },

  // Tips card
  tipsCard: {
    flexDirection: 'row',
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    alignItems: 'flex-start',
  },

  tipsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.sm,
    color: COLORS.text,
  },

  tipsText: {
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS.base + 2,
    color: COLORS.textMuted,
  },

  // Meta info for intermediate stops
  suggestionMeta: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs,
    fontStyle: 'italic',
  },
});
