// src/screens/auth/ResetPasswordScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/components/common/OTPInput';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP, validatePassword } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { COLORS } from '@/constants/colors';
import { APP_CONFIG } from '@/constants/config';

type ResetPasswordScreenProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<{ params: { email: string } }, 'params'>;
};

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  navigation,
  route,
}) => {
  const { email } = route.params;
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [errors, setErrors] = useState<{ otp?: string; password?: string; confirm?: string }>({});
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

  const validateOtpStep = (): boolean => {
    if (!validateOTP(otp)) {
      setErrors({ otp: 'Please enter a valid 6-digit code' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePasswordStep = (): boolean => {
    const newErrors: { password?: string; confirm?: string } = {};

    if (!newPassword) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    if (!confirmPassword) {
      newErrors.confirm = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirm = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateOtpStep()) {
      setStep('password');
    }
  };

  const handleResetPassword = async () => {
    if (!validatePasswordStep()) return;

    setLoading(true);

    try {
      const response = await authApi.resetPassword({
        email,
        otpCode: otp,
        newPassword,
        confirmPassword,
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Password Reset Successful',
          text2: 'You can now login with your new password',
        });

        // Navigate to login
        navigation.navigate('Login');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Reset Failed',
        text2: handleApiError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);

    try {
      const response = await authApi.forgotPassword({ email });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Code Sent',
          text2: 'A new reset code has been sent to your email',
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
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => step === 'password' ? setStep('otp') : navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {step === 'otp' ? (
          <>
            <Text style={styles.title}>Enter Reset Code</Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit code to{'\n'}
              <Text style={styles.email}>{email}</Text>
            </Text>

            <View style={styles.otpContainer}>
              <OTPInput value={otp} onChange={setOtp} error={errors.otp} />
            </View>

            <Button
              title="Continue"
              onPress={handleContinue}
              loading={loading}
              disabled={otp.length !== APP_CONFIG.OTP_LENGTH}
              style={styles.button}
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
          </>
        ) : (
          <>
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>
              Please create a strong password for your account
            </Text>

            <View style={styles.form}>
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={(text) => {
                  setNewPassword(text);
                  setErrors({ ...errors, password: undefined });
                }}
                error={errors.password}
                secureTextEntry
                leftIcon="lock-closed-outline"
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setErrors({ ...errors, confirm: undefined });
                }}
                error={errors.confirm}
                secureTextEntry
                leftIcon="lock-closed-outline"
              />

              <View style={styles.passwordRequirements}>
                <Text style={styles.requirementsTitle}>Password must contain:</Text>
                <Text style={styles.requirementItem}>• At least 8 characters</Text>
                <Text style={styles.requirementItem}>• One uppercase letter</Text>
                <Text style={styles.requirementItem}>• One lowercase letter</Text>
                <Text style={styles.requirementItem}>• One number</Text>
              </View>

              <Button
                title="Reset Password"
                onPress={handleResetPassword}
                loading={loading}
                style={styles.button}
              />
            </View>
          </>
        )}

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.backToLogin}
        >
          <Text style={styles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
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
    marginBottom: 32,
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
  form: {
    marginBottom: 24,
  },
  passwordRequirements: {
    backgroundColor: COLORS.backgroundLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 4,
  },
  button: {
    marginBottom: 16,
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 24,
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
  backToLogin: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backToLoginText: {
    fontSize: 14,
    color: COLORS.textLight,
    textDecorationLine: 'underline',
  },
});