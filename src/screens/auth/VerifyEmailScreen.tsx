// src/screens/auth/VerifyEmailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation.types';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/components/common/OTPInput';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { APP_CONFIG } from '@/constants/config';
import { COLORS } from '@/constants/colors';
import { authFeatureStyles } from '@/styles/features/auth';
import { buttonStyles } from '@/styles/base';

type VerifyEmailScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'VerifyEmail'>;
type VerifyEmailScreenRouteProp = RouteProp<AuthStackParamList, 'VerifyEmail'>;

export const VerifyEmailScreen: React.FC = () => {
  const navigation = useNavigation<VerifyEmailScreenNavigationProp>();
  const route = useRoute<VerifyEmailScreenRouteProp>();
  const email = route.params?.email || '';

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
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
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
      <View style={authFeatureStyles.authContent}>
        <View>
          <Text style={authFeatureStyles.titleCentered}>Verify Your Email</Text>
          <Text style={authFeatureStyles.subtitleCentered}>We've sent a verification code to</Text>
          <Text style={authFeatureStyles.emailText}>{email}</Text>

          <Text style={authFeatureStyles.instructionText}>
            Enter the 6-digit code to verify your email
          </Text>

          <View style={authFeatureStyles.otpWrapper}>
            <OTPInput value={otp} onChange={setOtp} error={error} />
          </View>
        </View>

        <View>
          <Button
            title="Verify Email"
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length !== APP_CONFIG.OTP_LENGTH}
            style={buttonStyles.submitButton}
          />

          <View style={authFeatureStyles.resendSection}>
            {canResend ? (
              <View style={authFeatureStyles.resendRow}>
                <Text style={authFeatureStyles.resendLabel}>Didn't receive the code? </Text>
                <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                  <Text style={authFeatureStyles.resendLink}>
                    {resendLoading ? 'Sending...' : 'Resend'}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={authFeatureStyles.countdownText}>Resend code in {countdown}s</Text>
            )}
          </View>

          <View style={authFeatureStyles.helpNote}>
            <Icon name="information-circle-outline" size={14} color={COLORS.textMuted} />
            <Text style={authFeatureStyles.helpText}>
              Check your spam folder if you don't see it
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={authFeatureStyles.backLink}
          >
            <Text style={authFeatureStyles.backLinkText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};