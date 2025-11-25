// src/styles/features/tripStyles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const tripStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.text,
  },

  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },

  warningText: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },

  // Header
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 16,
    paddingBottom: 16,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  headerButton: {
    padding: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },

  headerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    marginTop: 4,
    opacity: 0.9,
  },

  // ETA Card
  etaCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
  },

  etaRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  etaItem: {
    alignItems: 'center',
  },

  etaLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },

  etaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },

  etaDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },

  // Content
  content: {
    flex: 1,
    paddingTop: 16,
  },

  // Current Step Card
  currentStepCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 16,
  },

  currentStepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  currentStepIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  currentStepLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  currentStepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },

  currentStepSubtitle: {
    fontSize: 16,
    color: COLORS.primary,
  },

  // Waypoint Progress
  waypointProgress: {
    marginBottom: 16,
  },

  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },

  progressText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  progressBarContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },

  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Instructions Box
  instructionsBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 12,
  },

  instructionsText: {
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },

  quickAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },

  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // All Steps
  allSteps: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  stepItem: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },

  stepItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  stepNumberText: {
    fontSize: 14,
    fontWeight: '600',
  },

  stepItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },

  stepItemMeta: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  currentBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },

  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Tips Card
  tipsCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
  },

  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  tipsText: {
    fontSize: 14,
    lineHeight: 22,
  },

  // Bottom Actions
  bottomActions: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  modalContent: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },

  modalText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
});
