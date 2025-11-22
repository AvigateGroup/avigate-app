// src/styles/features/communityStyles.ts
import { StyleSheet } from 'react-native';

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
    padding: 16,
    borderBottomWidth: 1,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  settingText: {
    fontSize: 16,
    fontWeight: '600',
  },

  // Contribution CTA
  contributionCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },

  ctaTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  ctaText: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Filter
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },

  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Post Card
  postCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
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
    marginBottom: 12,
  },

  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  authorAvatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  authorInitials: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  authorDetails: {
    marginLeft: 12,
    flex: 1,
  },

  authorName: {
    fontSize: 16,
    fontWeight: '600',
  },

  postTime: {
    fontSize: 12,
    marginTop: 2,
  },

  reputationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 2,
  },

  reputationText: {
    fontSize: 11,
    fontWeight: '600',
  },

  postTypeBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Post Content
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },

  postContent: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },

  postLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },

  locationText: {
    fontSize: 14,
    fontWeight: '500',
  },

  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },

  // Post Actions
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    gap: 16,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
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
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 14,
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
    padding: 16,
    borderBottomWidth: 1,
  },

  backButton: {
    padding: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  moreButton: {
    padding: 4,
  },

  postDetailCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  postDetailTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 30,
  },

  postDetailContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },

  imagesContainer: {
    gap: 12,
    marginBottom: 16,
  },

  postDetailImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
  },

  // Comments
  commentsSection: {
    padding: 16,
  },

  commentsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },

  commentCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },

  commentAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  commentInitials: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
  },

  commentTime: {
    fontSize: 12,
    marginTop: 2,
  },

  commentContent: {
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 8,
  },

  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  commentActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  commentActionText: {
    fontSize: 13,
    fontWeight: '600',
  },

  noComments: {
    padding: 40,
    alignItems: 'center',
  },

  noCommentsText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },

  noCommentsSubtext: {
    fontSize: 14,
    marginTop: 4,
  },

  // Comment Input
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    gap: 12,
  },

  commentInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
  },

  commentButton: {
    minWidth: 70,
    height: 40,
  },
});