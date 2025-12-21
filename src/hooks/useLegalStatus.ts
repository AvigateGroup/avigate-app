// src/hooks/useLegalStatus.ts

import { useState, useEffect } from 'react';
import { userApi, LegalStatusResponse } from '@/api/user.api';
import { useAuth } from '@/store/AuthContext';

export const useLegalStatus = () => {
  const { user, isAuthenticated } = useAuth();
  const [legalStatus, setLegalStatus] = useState<LegalStatusResponse | null>(null);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  // Check legal status on mount if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      checkLegalStatus();
    }
  }, [isAuthenticated, user?.id]);

  const checkLegalStatus = async () => {
    if (checking) return;

    setChecking(true);
    try {
      const response = await userApi.checkLegalStatus();

      if (response.success && response.data) {
        setLegalStatus(response.data);

        // Show modal if user needs to accept updates
        if (response.data.needsUpdate) {
          setShowLegalModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking legal status:', error);
      // Don't block user if check fails
    } finally {
      setChecking(false);
    }
  };

  const acceptLegalUpdate = async () => {
    if (!legalStatus) return;

    setLoading(true);
    try {
      const response = await userApi.acceptLegalUpdate({
        acceptTerms: legalStatus.needsTermsUpdate,
        acceptPrivacy: legalStatus.needsPrivacyUpdate,
      });

      if (response.success) {
        setShowLegalModal(false);
        setLegalStatus(null);

        // Optionally refresh user data
        // await refreshUser();
      }
    } catch (error) {
      console.error('Error accepting legal update:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    legalStatus,
    showLegalModal,
    loading,
    checking,
    acceptLegalUpdate,
    checkLegalStatus,
  };
};
