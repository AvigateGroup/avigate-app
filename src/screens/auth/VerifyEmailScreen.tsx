// src/screens/auth/VerifyEmailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/components/common/OTPInput';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { APP_CONFIG } from '@/constants/config';
import { authStyles, commonStyles } from '@/styles';

export const VerifyEmailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;
  
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
          await login(
            response.data.accessToken,
            response.data.refreshToken,
            response.data.user
          );
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
    <AuthLayout showLogo={false}>
      <View style={authStyles.centeredContainer}>
        <Text style={authStyles.titleCentered}>Verify Your Email</Text>
        <Text style={authStyles.subtitleCentered}>
          We've sent a verification code to{'\n'}
          <Text style={authStyles.email}>{email}</Text>
        </Text>

        <Text style={authStyles.instruction}>
          Please enter the 6-digit code to verify your email address
        </Text>

        <View style={authStyles.otpContainer}>
          <OTPInput value={otp} onChange={setOtp} error={error} />
        </View>

        <Button
          title="Verify Email"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.length !== APP_CONFIG.OTP_LENGTH}
          style={commonStyles.marginBottom24}
        />

        <View style={authStyles.resendContainer}>
          {canResend ? (
            <View style={authStyles.resendTextContainer}>
              <Text style={authStyles.resendLabel}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                <Text style={authStyles.resendLink}>
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={authStyles.countdownText}>
              Resend code in {countdown}s
            </Text>
          )}
        </View>

        <View style={authStyles.helpContainer}>
          <Text style={authStyles.helpText}>
            Make sure to check your spam folder
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={authStyles.backToLogin}
        >
          <Text style={authStyles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

