// src/screens/auth/VerifyEmailScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/components/common/OTPInput';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';
import { APP_CONFIG } from '@/constants/config';
import { VerifyEmailScreenNavigationProp, VerifyEmailScreenRouteProp } from '@/types/navigation.types';

type VerifyEmailScreenProps = {
  navigation: VerifyEmailScreenNavigationProp;
  route: VerifyEmailScreenRouteProp;
};

export const VerifyEmailScreen: React.FC<VerifyEmailScreenProps> = ({
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
      <View style={styles.container}>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to{'\n'}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <Text style={styles.instruction}>
          Please enter the 6-digit code to verify your email address
        </Text>

        <View style={styles.otpContainer}>
          <OTPInput value={otp} onChange={setOtp} error={error} />
        </View>

        <Button
          title="Verify Email"
          onPress={handleVerify}
          loading={loading}
          disabled={otp.length !== APP_CONFIG.OTP_LENGTH}
          style={styles.verifyButton}
        />

        <View style={styles.resendContainer}>
          {canResend ? (
            <View style={styles.resendTextContainer}>
              <Text style={styles.resendLabel}>Didn't receive the code? </Text>
              <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                <Text style={styles.resendLink}>
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.countdownText}>
              Resend code in {countdown}s
            </Text>
          )}
        </View>

        <View style={styles.helpContainer}>
          <Text style={styles.helpText}>
            Make sure to check your spam folder
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.backToLogin}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
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
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  email: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  instruction: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 20,
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
  resendTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendLabel: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  countdownText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  helpContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  helpText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  backToLogin: {
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },
});