// src/screens/auth/VerifyEmailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { OTPInput } from '@/components/common/OTPInput';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { APP_CONFIG } from '@/constants/config';
import { authFeatureStyles } from '@/styles/features/auth';
import { buttonStyles } from '@/styles/base';
import { useThemedColors } from '@/hooks/useThemedColors';

export const VerifyEmailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = (params.email as string) || '';
  const colors = useThemedColors();

  const { login } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
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

    setLoading(true);
    setError('');

    try {
      const response = await authApi.verifyEmail({
        email,
        otpCode: otp,
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Email Verified',
          text2: 'Your email has been successfully verified!',
        });

        // If tokens are provided, log the user in
        if (response.data.accessToken && response.data.refreshToken) {
          await login(response.data.accessToken, response.data.refreshToken, response.data.user);
          // AuthContext will handle navigation to main app
        } else {
          // Navigate to login
          router.replace('/(auth)/login');
        }
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');

    try {
      const response = await authApi.resendVerification(email);

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
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: handleApiError(error),
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ flexGrow: 1, padding: 20, paddingTop: 60, justifyContent: 'center' }}
      showsVerticalScrollIndicator={false}
    >
      <View>
        {/* Title and Email */}
        <Text style={[authFeatureStyles.titleCentered, { color: colors.text }]}>
          Verify Your Email
        </Text>
        <Text style={[authFeatureStyles.subtitleCentered, { color: colors.textMuted }]}>
          We've sent a verification code to
        </Text>
        <Text style={authFeatureStyles.emailText}>{email}</Text>

        <Text style={[authFeatureStyles.instructionText, { color: colors.textMuted }]}>
          Enter the 6-digit code to verify your email
        </Text>

        {/* OTP Input */}
        <View style={authFeatureStyles.otpWrapper}>
          <OTPInput value={otp} onChange={setOtp} error={error} />
        </View>

        {/* Verify Button */}
        <Button
          title="Verify Email"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.length !== APP_CONFIG.OTP_LENGTH || loading}
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

        {/* Back to Login */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={authFeatureStyles.backLink}
        >
          <Text style={[authFeatureStyles.backLinkText, { color: colors.primary }]}>
            Back to Login
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};