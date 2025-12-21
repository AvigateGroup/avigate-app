// EXAMPLE: How to integrate Legal Update Modal into AppNavigator.tsx
// Copy the relevant parts into your actual AppNavigator

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '@/store/AuthContext';
import { useLegalStatus } from '@/hooks/useLegalStatus';
import { LegalUpdateModal } from '@/components/modals/LegalUpdateModal';
import { AuthNavigator } from '@/navigation/AuthNavigator';
import { MainNavigator } from '@/navigation/MainNavigator';
import { useNavigation } from '@react-navigation/native';

export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { legalStatus, showLegalModal, loading, acceptLegalUpdate } = useLegalStatus();

  // Only use this after NavigationContainer is ready
  const navigation = useNavigation();

  const handleViewTerms = () => {
    // Navigate to Terms of Service screen
    navigation.navigate('Profile' as never, { screen: 'TermsOfService' });
  };

  const handleViewPrivacy = () => {
    // Navigate to Privacy Policy screen
    navigation.navigate('Profile' as never, { screen: 'PrivacyPolicy' });
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {/* Main Navigation */}
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}

      {/* Legal Update Modal - Shows automatically when user needs to accept updates */}
      {legalStatus && (
        <LegalUpdateModal
          visible={showLegalModal}
          needsTermsUpdate={legalStatus.needsTermsUpdate}
          needsPrivacyUpdate={legalStatus.needsPrivacyUpdate}
          currentTermsVersion={legalStatus.currentTermsVersion}
          currentPrivacyVersion={legalStatus.currentPrivacyVersion}
          onAccept={acceptLegalUpdate}
          onViewTerms={handleViewTerms}
          onViewPrivacy={handleViewPrivacy}
        />
      )}
    </>
  );
};

// Alternative: Add to a screen component instead of navigator
export const HomeScreenWithLegalCheck = () => {
  const navigation = useNavigation();
  const { legalStatus, showLegalModal, loading, acceptLegalUpdate } = useLegalStatus();

  return (
    <View style={{ flex: 1 }}>
      {/* Your home screen content */}
      <YourHomeScreen />

      {/* Legal Update Modal */}
      {legalStatus && (
        <LegalUpdateModal
          visible={showLegalModal}
          needsTermsUpdate={legalStatus.needsTermsUpdate}
          needsPrivacyUpdate={legalStatus.needsPrivacyUpdate}
          currentTermsVersion={legalStatus.currentTermsVersion}
          currentPrivacyVersion={legalStatus.currentPrivacyVersion}
          onAccept={acceptLegalUpdate}
          onViewTerms={() => navigation.navigate('TermsOfService' as never)}
          onViewPrivacy={() => navigation.navigate('PrivacyPolicy' as never)}
        />
      )}
    </View>
  );
};
