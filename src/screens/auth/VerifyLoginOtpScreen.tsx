// src/screens/auth/VerifyLoginOTPScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { OTPInput } from '@/components/common/OTPInput';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP } from '@/utils/validation';
import { handleApiError, getDeviceInfo, getFCMToken } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { APP_CONFIG } from '@/constants/config';
import { authFeatureStyles } from '@/styles/features/auth';
import { buttonStyles } from '@/styles/base';
import { useThemedColors } from '@/hooks/useThemedColors';

export const VerifyLoginOTPScreen: React.FC = () => {
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
      const fcmToken = await getFCMToken();
      const response = await authApi.verifyLoginOtp({
        email,
        otpCode: otp,
        deviceInfo: getDeviceInfo(),
        fcmToken: fcmToken,
      });

      console.log('OTP Verification Response:', JSON.stringify(response, null, 2));

      if (!response || !response.success) {
        throw new Error(response?.message || 'Verification failed');
      }

      if (!response.data?.accessToken || !response.data?.refreshToken || !response.data?.user) {
        console.error('Missing data in response:', response);
        throw new Error('Invalid response from server. Please try again.');
      }

      // Login successful - update auth state
      console.log('Calling login with tokens...');
      await login(response.data.accessToken, response.data.refreshToken, response.data.user);
      console.log('Login completed - navigation should trigger automatically');

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Login successful!',
      });
    } catch (error: any) {
      console.error('OTP Verification Error:', error);
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
      const response = await authApi.resendLoginOtp(email);

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
          Verify Your Login
        </Text>
        <Text style={[authFeatureStyles.subtitleCentered, { color: colors.textMuted }]}>
          {"We've sent a verification code to"}
        </Text>
        <Text style={authFeatureStyles.emailText}>{email}</Text>

        <Text style={[authFeatureStyles.instructionText, { color: colors.textMuted }]}>
          Enter the 6-digit code to complete your login
        </Text>

        {/* OTP Input */}
        <View style={authFeatureStyles.otpWrapper}>
          <OTPInput value={otp} onChange={setOtp} error={error} />
        </View>

        {/* Verify Button */}
        <Button
          title="Verify and Login"
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
                {"Didn't receive the code?"}{' '}
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
            {"Check your spam folder if you don't see it"}
          </Text>
        </View>

        {/* Back to Login */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={authFeatureStyles.backLink}
        >
          <Text style={[authFeatureStyles.backLinkText, { color: colors.primary }]}>
            Change Email
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};