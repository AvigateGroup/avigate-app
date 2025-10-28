// src/screens/auth/VerifyLoginOTPScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/components/common/OTPInput';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP } from '@/utils/validation';
import { handleApiError, getDeviceInfo } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';
import { APP_CONFIG } from '@/constants/config';

type VerifyLoginOTPScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { email: string } }, 'params'>;
};

export const VerifyLoginOTPScreen: React.FC<VerifyLoginOTPScreenProps> = ({
  navigation,
  route,
}) => {
  const { email } = route.params;
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

      if (response.success && response.data.accessToken && response.data.refreshToken) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Login successful!',
        });

        await login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );

        // Navigation handled by AuthContext/AppNavigator
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
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Login</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <View style={styles.otpContainer}>
          <OTPInput value={otp} onChange={setOtp} error={error} />
        </View>

        <Button
          title="Verify"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.length !== APP_CONFIG.OTP_LENGTH}
          style={styles.verifyButton}
        />

        <View style={styles.resendContainer}>
          {canResend ? (
            <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
              <Text style={styles.resendText}>
                {resendLoading ? 'Sending...' : 'Resend Code'}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={styles.countdownText}>
              Resend code in {countdown}s
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.changeEmail}
        >
          <Text style={styles.changeEmailText}>Change Email</Text>
        </TouchableOpacity>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 40,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  otpContainer: {
    marginBottom: 32,
  },
  verifyButton: {
    marginBottom: 24,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  resendText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  countdownText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  changeEmail: {
    alignItems: 'center',
  },
  changeEmailText: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },
});