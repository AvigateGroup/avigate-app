// src/screens/profile/VerifyEmailChangeScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { OTPInput } from '@/components/common/OTPInput';
import { Button } from '@/components/common/Button';
import { validateOTP } from '@/utils/validation';
import { useUserService } from '@/hooks/useUserService';
import { APP_CONFIG } from '@/constants/config';
import { COLORS } from '@/constants/colors';
import { authFeatureStyles } from '@/styles/features/auth';
import { buttonStyles } from '@/styles/base';
import { useThemedColors } from '@/hooks/useThemedColors';

export const VerifyEmailChangeScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const params = route.params as { email?: string } | undefined;
  const newEmail = params?.email || '';
  const colors = useThemedColors();

  const { verifyEmailChange, resendEmailChangeOTP, isLoading } = useUserService();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerify = async () => {
    if (!validateOTP(otp)) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setError('');

    try {
      const response = await verifyEmailChange({
        email: newEmail,
        otpCode: otp,
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Email Updated',
          text2: 'Your email has been successfully updated!',
        });

        navigation.goBack();
      }
    } catch (error: any) {
      console.error('Email verification error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Verification failed';

      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: errorMessage,
      });
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await resendEmailChangeOTP(newEmail);

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Code Sent',
          text2: 'A new verification code has been sent to your email',
        });

        setCountdown(60);
        setCanResend(false);
        setOtp('');
      }
    } catch (error: any) {
      console.error('Resend error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to resend code';

      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: errorMessage,
      });
    } finally {
      setResendLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        {/* Icon Section */}
        <View style={authFeatureStyles.verifyIconContainer}>
          <View style={authFeatureStyles.verifyIconCircle}>
            <Icon name="mail" size={32} color={COLORS.primary} />
          </View>
        </View>

        {/* Title and Email */}
        <Text style={[authFeatureStyles.titleCentered, { color: colors.text }]}>
          Verify Your New Email
        </Text>
        <Text style={[authFeatureStyles.subtitleCentered, { color: colors.textMuted }]}>
          We've sent a verification code to
        </Text>
        <Text style={authFeatureStyles.emailText}>{newEmail}</Text>

        <Text style={[authFeatureStyles.instructionText, { color: colors.textMuted }]}>
          Enter the 6-digit code to verify your new email address
        </Text>

        {/* OTP Input */}
        <View style={authFeatureStyles.otpWrapper}>
          <OTPInput value={otp} onChange={setOtp} error={error} />
        </View>

        {/* Verify Button */}
        <Button
          title="Verify Email"
          onPress={handleVerify}
          loading={isLoading}
          disabled={otp.length !== APP_CONFIG.OTP_LENGTH || isLoading}
          style={buttonStyles.submitButton}
        />

        {/* Resend Section */}
        <View style={authFeatureStyles.resendSection}>
          {canResend ? (
            <View style={authFeatureStyles.resendRow}>
              <Text style={[authFeatureStyles.resendLabel, { color: colors.textMuted }]}>
                Didn't receive the code?{' '}
              </Text>
              <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                <Text style={authFeatureStyles.resendLink}>
                  {resendLoading ? 'Sending...' : 'Resend'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={[authFeatureStyles.countdownText, { color: colors.textMuted }]}>
              Resend code in {countdown}s
            </Text>
          )}
        </View>

        {/* Help Note */}
        <View style={authFeatureStyles.helpNote}>
          <Icon name="information-circle-outline" size={14} color={colors.textMuted} />
          <Text style={[authFeatureStyles.helpText, { color: colors.textMuted }]}>
            Check your spam folder if you don't see it
          </Text>
        </View>

        {/* Cancel Button */}
        <TouchableOpacity
          onPress={handleCancel}
          style={[authFeatureStyles.backLink, { marginTop: 16 }]}
        >
          <Text style={[authFeatureStyles.backLinkText, { color: colors.primary }]}>
            Cancel and Go Back
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};