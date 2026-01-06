// src/navigation/LegalUpdateWrapper.tsx

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useLegalStatus } from '@/hooks/useLegalStatus';
import { LegalUpdateModal } from '@/components/modals/LegalUpdateModal';
import Toast from 'react-native-toast-message';

/**
 * Wrapper component that handles Legal Update Modal display
 * Must be placed inside NavigationContainer to access navigation
 */
export const LegalUpdateWrapper: React.FC = () => {
  const navigation = useNavigation();
  const { legalStatus, showLegalModal, loading, acceptLegalUpdate } = useLegalStatus();

  const handleViewTerms = () => {
    try {
      // Navigate to Terms of Service in Profile stack
      // @ts-expect-error - Nested navigation typing is complex
      navigation.navigate('Main', {
        screen: 'Profile',
        params: {
          screen: 'TermsOfService',
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Toast.show({
        type: 'info',
        text1: 'Terms of Service',
        text2: 'Please view Terms in Settings → About → Terms of Service',
      });
    }
  };

  const handleViewPrivacy = () => {
    try {
      // Navigate to Privacy Policy in Profile stack
      // @ts-expect-error - Nested navigation typing is complex
      navigation.navigate('Main', {
        screen: 'Profile',
        params: {
          screen: 'PrivacyPolicy',
        },
      });
    } catch (error) {
      console.error('Navigation error:', error);
      Toast.show({
        type: 'info',
        text1: 'Privacy Policy',
        text2: 'Please view Privacy Policy in Settings → About → Privacy Policy',
      });
    }
  };

  const handleAccept = async () => {
    try {
      await acceptLegalUpdate();
      Toast.show({
        type: 'success',
        text1: 'Thank You',
        text2: 'Your acceptance has been recorded',
      });
    } catch (error) {
      console.error('Error accepting legal update:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to record acceptance. Please try again.',
      });
    }
  };

  // Don't render anything if no legal status or not authenticated
  if (!legalStatus) {
    return null;
  }

  return (
    <LegalUpdateModal
      visible={showLegalModal}
      needsTermsUpdate={legalStatus.needsTermsUpdate}
      needsPrivacyUpdate={legalStatus.needsPrivacyUpdate}
      currentTermsVersion={legalStatus.currentTermsVersion}
      currentPrivacyVersion={legalStatus.currentPrivacyVersion}
      onAccept={handleAccept}
      onViewTerms={handleViewTerms}
      onViewPrivacy={handleViewPrivacy}
    />
  );
};
