// src/styles/features/communityStyles.ts
import { StyleSheet } from 'react-native';
import { SPACING, FONT_SIZES, LINE_HEIGHTS, BORDER_RADIUS, ICON_SIZES, moderateScale } from '@/utils/responsive';

export const communityStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Feed Header
  feedHeader: {
    padding: SPACING.base,
    borderBottomWidth: 1,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.base,
  },

  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  settingText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },

  // Contribution CTA
  contributionCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.base,
  },

  ctaTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },

  ctaText: {
    fontSize: FONT_SIZES.base,
    lineHeight: LINE_HEIGHTS.base,
  },

  // Filter
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },

  filterButton: {
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.xxl,
    borderWidth: 1,
  },

  filterButtonText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },

  // Post Card
  postCard: {
    marginHorizontal: SPACING.base,
    marginTop: SPACING.base,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  postHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },

  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  authorAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },

  authorAvatarPlaceholder: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },

  authorInitials: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  authorDetails: {
    marginLeft: SPACING.md,
    flex: 1,
  },

  authorName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
  },

  postTime: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs / 2,
  },

  reputationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs + 2,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs / 2,
  },

  reputationText: {
    fontSize: FONT_SIZES.xs + 1,
    fontWeight: '600',
  },

  postTypeBadge: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Post Content
  postTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    lineHeight: LINE_HEIGHTS.lg,
  },

  postContent: {
    fontSize: FONT_SIZES.base + 1,
    lineHeight: LINE_HEIGHTS.base + 2,
    marginBottom: SPACING.md,
  },

  postLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.xs + 2,
  },

  locationText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '500',
  },

  postImage: {
    width: '100%',
    height: moderateScale(200),
    borderRadius: BORDER_RADIUS.base,
    marginBottom: SPACING.md,
  },

  // Post Actions
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    gap: SPACING.base,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },

  actionText: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: SPACING.lg,
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },

  // Empty State
  emptyState: {
    padding: SPACING.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    marginTop: SPACING.base,
    marginBottom: SPACING.sm,
  },

  emptySubtext: {
    fontSize: FONT_SIZES.base,
    textAlign: 'center',
  },

  // Detail Screen
  detailContainer: {
    flex: 1,
  },

  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.base,
    borderBottomWidth: 1,
  },

  backButton: {
    padding: SPACING.xs,
  },

  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
  },

  moreButton: {
    padding: SPACING.xs,
  },

  postDetailCard: {
    margin: SPACING.base,
    padding: SPACING.base,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  postDetailTitle: {
    fontSize: FONT_SIZES.xxl - 2,
    fontWeight: '700',
    marginBottom: SPACING.md,
    lineHeight: LINE_HEIGHTS.xxl + 2,
  },

  postDetailContent: {
    fontSize: FONT_SIZES.md,
    lineHeight: LINE_HEIGHTS.md,
    marginBottom: SPACING.base,
  },

  imagesContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.base,
  },

  postDetailImage: {
    width: '100%',
    height: moderateScale(250),
    borderRadius: BORDER_RADIUS.base,
  },

  // Comments
  commentsSection: {
    padding: SPACING.base,
  },

  commentsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    marginBottom: SPACING.base,
  },

  commentCard: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.base,
    marginBottom: SPACING.md,
  },

  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },

  commentAvatar: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    marginRight: SPACING.sm,
  },

  commentAvatarPlaceholder: {
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },

  commentInitials: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  commentAuthor: {
    fontSize: FONT_SIZES.base,
    fontWeight: '600',
  },

  commentTime: {
    fontSize: FONT_SIZES.sm,
    marginTop: SPACING.xs / 2,
  },

  commentContent: {
    fontSize: FONT_SIZES.base + 1,
    lineHeight: LINE_HEIGHTS.base + 1,
    marginBottom: SPACING.sm,
  },

  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },

  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },

  commentActionText: {
    fontSize: FONT_SIZES.sm + 1,
    fontWeight: '600',
  },

  noComments: {
    padding: SPACING.xxxl,
    alignItems: 'center',
  },

  noCommentsText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    marginTop: SPACING.md,
  },

  noCommentsSubtext: {
    fontSize: FONT_SIZES.base,
    marginTop: SPACING.xs,
  },

  // Comment Input
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.base,
    borderTopWidth: 1,
    gap: SPACING.md,
  },

  commentInput: {
    flex: 1,
    minHeight: moderateScale(40),
    maxHeight: moderateScale(100),
    borderRadius: BORDER_RADIUS.xxl,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZES.base + 1,
  },

  commentButton: {
    minWidth: moderateScale(70),
    height: moderateScale(40),
  },
});
