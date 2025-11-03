// src/screens/auth/ResetPasswordScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/components/common/OTPInput';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP, validatePassword } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { APP_CONFIG } from '@/constants/config';
import { authStyles, commonStyles } from '@/styles';

export const ResetPasswordScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string;

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

        // Navigate to login using Expo Router
        router.push('/(auth)/login');
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
        style={authStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={authStyles.backButton}
          onPress={() => (step === 'password' ? setStep('otp') : router.back())}
          activeOpacity={0.7}
        >
          <Text style={authStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        {step === 'otp' ? (
          <>
            <Text style={authStyles.titleCentered}>Enter Reset Code</Text>
            <Text style={authStyles.subtitleCentered}>
              We've sent a 6-digit code to{'\n'}
              <Text style={authStyles.email}>{email}</Text>
            </Text>

            <View style={authStyles.otpContainer}>
              <OTPInput value={otp} onChange={setOtp} error={errors.otp} />
            </View>

            <Button
              title="Continue"
              onPress={handleContinue}
              loading={loading}
              disabled={otp.length !== APP_CONFIG.OTP_LENGTH}
              style={commonStyles.marginBottom16}
            />

            <View style={authStyles.resendContainer}>
              {canResend ? (
                <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                  <Text style={authStyles.resendText}>
                    {resendLoading ? 'Sending...' : 'Resend Code'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={authStyles.countdownText}>Resend code in {countdown}s</Text>
              )}
            </View>
          </>
        ) : (
          <>
            <Text style={authStyles.titleCentered}>Create New Password</Text>
            <Text style={authStyles.subtitleCentered}>
              Please create a strong password for your account
            </Text>

            <View style={authStyles.form}>
              <Input
                label="New Password"
                placeholder="Enter new password"
                value={newPassword}
                onChangeText={text => {
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
                onChangeText={text => {
                  setConfirmPassword(text);
                  setErrors({ ...errors, confirm: undefined });
                }}
                error={errors.confirm}
                secureTextEntry
                leftIcon="lock-closed-outline"
              />

              <View style={authStyles.passwordRequirements}>
                <Text style={authStyles.requirementsTitle}>Password must contain:</Text>
                <Text style={authStyles.requirementItem}>• At least 8 characters</Text>
                <Text style={authStyles.requirementItem}>• One uppercase letter</Text>
                <Text style={authStyles.requirementItem}>• One lowercase letter</Text>
                <Text style={authStyles.requirementItem}>• One number</Text>
              </View>

              <Button
                title="Reset Password"
                onPress={handleResetPassword}
                loading={loading}
                style={commonStyles.marginBottom16}
              />
            </View>
          </>
        )}

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={authStyles.backToLoginWithMargin}
        >
          <Text style={authStyles.backToLoginText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </AuthLayout>
  );
};
