// src/components/modals/LegalUpdateModal.tsx

import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useThemedColors } from '@/hooks/useThemedColors';
import { Button } from '@/components/common/Button';
import { COLORS } from '@/constants/colors';

interface LegalUpdateModalProps {
  visible: boolean;
  needsTermsUpdate: boolean;
  needsPrivacyUpdate: boolean;
  currentTermsVersion: string;
  currentPrivacyVersion: string;
  onAccept: () => Promise<void>;
  onViewTerms: () => void;
  onViewPrivacy: () => void;
}

export const LegalUpdateModal: React.FC<LegalUpdateModalProps> = ({
  visible,
  needsTermsUpdate,
  needsPrivacyUpdate,
  currentTermsVersion,
  currentPrivacyVersion,
  onAccept,
  onViewTerms,
  onViewPrivacy,
}) => {
  const colors = useThemedColors();
  const [loading, setLoading] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(!needsTermsUpdate);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(!needsPrivacyUpdate);

  const handleAccept = async () => {
    setLoading(true);
    try {
      await onAccept();
    } finally {
      setLoading(false);
    }
  };

  const canAccept = hasReadTerms && hasReadPrivacy;

  const getUpdateMessage = () => {
    if (needsTermsUpdate && needsPrivacyUpdate) {
      return 'We have updated our Terms of Service and Privacy Policy';
    } else if (needsTermsUpdate) {
      return 'We have updated our Terms of Service';
    } else {
      return 'We have updated our Privacy Policy';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => {
        // Prevent closing - user must accept
      }}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: COLORS.primary }]}>
          <Icon name="document-text" size={32} color={COLORS.textWhite} />
          <Text style={styles.headerTitle}>Important Update</Text>
          <Text style={styles.headerSubtitle}>Please review and accept to continue</Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <View style={[styles.alertBox, { backgroundColor: colors.backgroundSecondary }]}>
            <Icon name="information-circle" size={24} color={COLORS.warning} />
            <Text style={[styles.alertText, { color: colors.text }]}>{getUpdateMessage()}</Text>
          </View>

          <Text style={[styles.description, { color: colors.textMuted }]}>
            To continue using Avigate, please review and accept the updated documents. We've made
            changes to improve your experience and protect your privacy.
          </Text>

          {/* Terms of Service Section */}
          {needsTermsUpdate && (
            <View style={[styles.documentSection, { borderColor: colors.border }]}>
              <View style={styles.documentHeader}>
                <Icon name="document-text-outline" size={20} color={colors.primary} />
                <Text style={[styles.documentTitle, { color: colors.text }]}>
                  Terms of Service
                </Text>
                <View style={[styles.versionBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.versionText}>v{currentTermsVersion}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.viewButton, { borderColor: colors.primary }]}
                onPress={() => {
                  setHasReadTerms(true);
                  onViewTerms();
                }}
              >
                <Text style={[styles.viewButtonText, { color: colors.primary }]}>
                  Read Terms of Service
                </Text>
                <Icon name="chevron-forward" size={20} color={colors.primary} />
              </TouchableOpacity>

              {hasReadTerms && (
                <View style={styles.checkRow}>
                  <Icon name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={[styles.checkText, { color: COLORS.success }]}>
                    Marked as read
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Privacy Policy Section */}
          {needsPrivacyUpdate && (
            <View style={[styles.documentSection, { borderColor: colors.border }]}>
              <View style={styles.documentHeader}>
                <Icon name="shield-checkmark-outline" size={20} color={colors.primary} />
                <Text style={[styles.documentTitle, { color: colors.text }]}>Privacy Policy</Text>
                <View style={[styles.versionBadge, { backgroundColor: colors.primary }]}>
                  <Text style={styles.versionText}>v{currentPrivacyVersion}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.viewButton, { borderColor: colors.primary }]}
                onPress={() => {
                  setHasReadPrivacy(true);
                  onViewPrivacy();
                }}
              >
                <Text style={[styles.viewButtonText, { color: colors.primary }]}>
                  Read Privacy Policy
                </Text>
                <Icon name="chevron-forward" size={20} color={colors.primary} />
              </TouchableOpacity>

              {hasReadPrivacy && (
                <View style={styles.checkRow}>
                  <Icon name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={[styles.checkText, { color: COLORS.success }]}>
                    Marked as read
                  </Text>
                </View>
              )}
            </View>
          )}

          <View style={[styles.infoBox, { backgroundColor: colors.backgroundSecondary }]}>
            <Icon name="bulb-outline" size={18} color={colors.textMuted} />
            <Text style={[styles.infoText, { color: colors.textMuted }]}>
              By accepting, you agree that you have read and understood the updated{' '}
              {needsTermsUpdate && needsPrivacyUpdate
                ? 'Terms of Service and Privacy Policy'
                : needsTermsUpdate
                  ? 'Terms of Service'
                  : 'Privacy Policy'}
              .
            </Text>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={[styles.footer, { backgroundColor: colors.backgroundSecondary }]}>
          <Button
            title={loading ? 'Processing...' : 'I Accept'}
            onPress={handleAccept}
            loading={loading}
            disabled={!canAccept || loading}
            style={styles.acceptButton}
          />

          {!canAccept && (
            <Text style={[styles.footerHint, { color: colors.textMuted }]}>
              Please read all updated documents to continue
            </Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textWhite,
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  alertText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  documentSection: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 8,
  },
  versionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  versionText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textWhite,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  checkText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  acceptButton: {
    marginBottom: 12,
  },
  footerHint: {
    fontSize: 12,
    textAlign: 'center',
  },
});
