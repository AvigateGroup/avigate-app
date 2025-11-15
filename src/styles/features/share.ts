import { StyleSheet } from 'react-native';
import { COLORS } from '@/constants/colors';

export const shareStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: COLORS.white,
    marginBottom: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  
  // Share Type Selection Styles
  shareTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  shareTypeButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    minHeight: 120,
    justifyContent: 'center',
  },
  shareTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
  },
  shareTypeDesc: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Input Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
    paddingVertical: 8,
  },
  
  // Expiry Settings Styles
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginLeft: 12,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dateText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
    flex: 1,
  },
  
  // Info Card
  infoCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.infoLight,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  
  // Action Buttons
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginBottom: 32,
    marginTop: 8,
  },
  
  // Legacy styles (kept for compatibility)
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  toggleSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 8,
  },
  contactCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  contactAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});