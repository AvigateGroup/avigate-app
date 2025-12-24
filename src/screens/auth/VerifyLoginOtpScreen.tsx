// src/screens/auth/VerifyLoginOTPScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/components/common/OTPInput';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP } from '@/utils/validation';
import { handleApiError, getDeviceInfo } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { APP_CONFIG } from '@/constants/config';
import { COLORS } from '@/constants/colors';
import { authFeatureStyles } from '@/styles/features/auth';
import { buttonStyles } from '@/styles/base';

export const VerifyLoginOTPScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = (params.email as string) || '';

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
      const response = await authApi.verifyLoginOtp({
        email,
        otpCode: otp,
        deviceInfo: getDeviceInfo(),
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
    <AuthLayout showLogo={false}>
      <View style={authFeatureStyles.authContent}>
        {/* TOP SECTION */}
        <View>
          <Text style={authFeatureStyles.titleCentered}>Verify Your Login</Text>

          <Text style={authFeatureStyles.subtitleCentered}>Enter the 6-digit code sent to</Text>

          {/* ENHANCED EMAIL DISPLAY WITH CONTAINER */}
          <View style={authFeatureStyles.emailContainer}>
            <Text style={authFeatureStyles.emailText}>{email}</Text>
          </View>

          <View style={authFeatureStyles.otpWrapper}>
            <OTPInput value={otp} onChange={setOtp} error={error} />
          </View>
        </View>

        {/* BOTTOM SECTION */}
        <View>
          <Button
            title="Verify"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length !== APP_CONFIG.OTP_LENGTH}
            style={buttonStyles.submitButton}
          />

          <View style={authFeatureStyles.resendSection}>
            {canResend ? (
              <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                <Text style={authFeatureStyles.resendLink}>
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={authFeatureStyles.countdownText}>Resend code in {countdown}s</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.back()}
            style={authFeatureStyles.changeEmailButton}
          >
            <Icon name="arrow-back" size={18} color={COLORS.primary} />
            <Text style={authFeatureStyles.changeEmailText}>Change Email</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};