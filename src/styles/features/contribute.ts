// src/styles/features/contributeStyles.ts
import { StyleSheet } from 'react-native';

export const contributeStyles = StyleSheet.create({
  // Container
  container: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },

  // Content
  content: {
    flex: 1,
  },

  // Reward Card
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },

  rewardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  rewardText: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Section
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  // Type Grid
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  typeCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },

  typeLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },

  typeDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },

  // Input
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },

  input: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },

  charCount: {
    position: 'absolute',
    right: 16,
    bottom: 8,
    fontSize: 12,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },

  // Transport Modes
  transportModes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  transportChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },

  transportText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8,
  },

  infoText: {
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },

  // Optional Toggle
  optionalToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },

  optionalText: {
    fontSize: 14,
    flex: 1,
  },

  // Submit Section
  submitSection: {
    margin: 16,
    marginBottom: 32,
  },
});