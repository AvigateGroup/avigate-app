// src/styles/features/routeStyles.ts
import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const routeStyles = StyleSheet.create({
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

  dataAvailabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },

  dataAvailabilityText: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 4,
  },

  alternativeOptionsCard: {
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
  },

  alternativeOptionsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  alternativeOptionsTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  alternativeOptionsDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },

  localPhrases: {
    gap: 8,
  },

  phraseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  phraseText: {
    fontSize: 14,
    flex: 1,
    fontStyle: 'italic',
  },

  walkableNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },

  walkableText: {
    fontSize: 13,
    fontWeight: '500',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    marginRight: 16,
    padding: 4,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },

  headerSubtitle: {
    fontSize: 14,
    color: COLORS.warning,
    marginTop: 4,
  },

  // Route Options
  routeOptions: {
    padding: 16,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  routeOption: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  routeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  routeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  routeMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  metaText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  // Transport Modes
  transportModes: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },

  transportMode: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Badges
  walkingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    marginBottom: 8,
  },

  walkingText: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Confidence Bar
  confidenceBar: {
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    overflow: 'hidden',
  },

  confidenceFill: {
    height: '100%',
    borderRadius: 2,
  },

  // Route Details
  routeDetails: {
    padding: 16,
  },

  // Summary Card
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  summaryItem: {
    alignItems: 'center',
  },

  summaryLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
  },

  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 4,
  },

  // Steps
  steps: {
    marginBottom: 16,
  },

  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },

  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  stepIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  stepSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 4,
  },

  stepMeta: {
    marginTop: 4,
  },

  stepMetaText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // Step Content
  stepContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  instructionsCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  instructionsText: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Walking Directions
  walkingDirections: {
    marginTop: 12,
  },

  walkingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  walkingTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  walkStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },

  walkStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  walkStepNumberText: {
    fontSize: 12,
    fontWeight: '600',
  },

  walkStepText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },

  walkStepMeta: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // Alternative Transport
  alternativeCard: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },

  alternativeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },

  alternativeTitle: {
    fontSize: 14,
    fontWeight: '600',
  },

  alternativeText: {
    fontSize: 13,
    marginBottom: 8,
  },

  alternativeFare: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Step Connector
  stepConnector: {
    width: 2,
    height: 16,
    marginLeft: 24,
  },

  // Info Cards
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },

  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Bottom Action
  bottomAction: {
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
