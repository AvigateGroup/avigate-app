import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const communityStyles = StyleSheet.create({
  // ... existing styles
  
  // NEW - Reputation badge
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
  
  // NEW - Contribution CTA
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
});