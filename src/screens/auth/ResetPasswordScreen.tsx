// src/screens/auth/ResetPasswordScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { OTPInput } from '@/components/common/OTPInput';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateOTP, validatePassword } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { APP_CONFIG } from '@/constants/config';
import { buttonStyles, formStyles, layoutStyles } from '@/styles/base';
import { authFeatureStyles } from '@/styles/features/auth';
import { SPACING } from '@/utils/responsive';

export const ResetPasswordScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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

  // Helper function to get user-friendly OTP error messages
  const getOTPErrorMessage = (errorMessage: string): string => {
    const lowerMessage = errorMessage.toLowerCase();
    
    if (lowerMessage.includes('already been used')) {
      return 'This code has already been used. Please request a new one.';
    }
    if (lowerMessage.includes('expired')) {
      return 'This code has expired. Please request a new one.';
    }
    if (lowerMessage.includes('invalid')) {
      return 'Invalid code. Please check and try again.';
    }
    
    return errorMessage;
  };

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
          visibilityTime: 4000,
        });

        router.push('/(auth)/login');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      const errorMessage = handleApiError(error);
      const statusCode = error?.response?.status;

      // Handle OTP-related errors (401)
      if (statusCode === 401) {
        const friendlyMessage = getOTPErrorMessage(errorMessage);
        
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: friendlyMessage,
          visibilityTime: 5000,
        });

        // Go back to OTP step to allow user to enter new code
        setStep('otp');
        setOtp('');
        setErrors({ otp: 'Invalid or expired code' });
      } 
      // Handle password validation errors (400)
      else if (statusCode === 400) {
        Toast.show({
          type: 'error',
          text1: 'Validation Error',
          text2: errorMessage,
          visibilityTime: 4000,
        });
      }
      // Handle rate limiting (429)
      else if (statusCode === 429) {
        Toast.show({
          type: 'error',
          text1: 'Too Many Attempts',
          text2: 'Please wait a few minutes before trying again.',
          visibilityTime: 5000,
        });
      }
      // Generic error
      else {
        Toast.show({
          type: 'error',
          text1: 'Reset Failed',
          text2: errorMessage,
          visibilityTime: 4000,
        });
      }
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
          visibilityTime: 3000,
        });

        setCountdown(60);
        setCanResend(false);
        setOtp('');
        setErrors({});
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      
      Toast.show({
        type: 'error',
        text1: 'Resend Failed',
        text2: errorMessage,
        visibilityTime: 4000,
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <AuthLayout showLogo={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top || SPACING.xl }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => (step === 'password' ? setStep('otp') : router.back())}
            activeOpacity={0.7}
          >
            <Text style={buttonStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Main Content */}
          <View style={styles.contentWrapper}>
            {step === 'otp' ? (
              <>
                {/* OTP Step */}
                <View style={authFeatureStyles.stepContainer}>
                  <Text style={authFeatureStyles.titleCentered}>Enter Reset Code</Text>
                  <Text style={authFeatureStyles.subtitleCentered}>
                    We've sent a 6-digit code to
                  </Text>
                  <View style={authFeatureStyles.emailContainer}>
                    <Text style={authFeatureStyles.emailText}>{email}</Text>
                  </View>
                </View>

                <View style={authFeatureStyles.otpWrapper}>
                  <OTPInput value={otp} onChange={setOtp} error={errors.otp} />
                </View>

                <Button
                  title="Continue"
                  onPress={handleContinue}
                  loading={loading}
                  disabled={otp.length !== APP_CONFIG.OTP_LENGTH}
                  style={buttonStyles.submitButton}
                />

                {/* Info Box - Code expires in 15 minutes */}
                <View style={authFeatureStyles.infoBox}>
                  <View style={authFeatureStyles.infoHeader}>
                    <Icon name="time-outline" size={16} color="#7C3AED" />
                    <Text style={authFeatureStyles.infoTitle}>
                      Your code expires in 15 minutes
                    </Text>
                  </View>
                  <Text style={authFeatureStyles.infoItem}>
                    Make sure to complete the reset process before the code expires.
                  </Text>
                </View>

                {/* Resend Section */}
                <View style={authFeatureStyles.resendSection}>
                  {canResend ? (
                    <View style={authFeatureStyles.resendRow}>
                      <Text style={authFeatureStyles.resendLabel}>Didn't receive code? </Text>
                      <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
                        <Text style={authFeatureStyles.resendLink}>
                          {resendLoading ? 'Sending...' : 'Resend Code'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Text style={authFeatureStyles.countdownText}>Resend code in {countdown}s</Text>
                  )}
                </View>
              </>
            ) : (
              <>
                {/* Password Step */}
                <View style={authFeatureStyles.stepContainer}>
                  <Text style={authFeatureStyles.titleCentered}>Create New Password</Text>
                  <Text style={authFeatureStyles.subtitleCentered}>
                    Please create a strong password for your account
                  </Text>
                </View>

                <View style={formStyles.form}>
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

                  <View style={formStyles.passwordRequirements}>
                    <Text style={formStyles.requirementsTitle}>Password must contain:</Text>
                    <Text style={formStyles.requirementItem}>• At least 8 characters</Text>
                    <Text style={formStyles.requirementItem}>• One uppercase letter</Text>
                    <Text style={formStyles.requirementItem}>• One lowercase letter</Text>
                    <Text style={formStyles.requirementItem}>• One number</Text>
                  </View>

                  <Button
                    title="Reset Password"
                    onPress={handleResetPassword}
                    loading={loading}
                    style={buttonStyles.submitButton}
                  />
                </View>
              </>
            )}

            {/* Spacer */}
            <View style={styles.flexSpacer} />

            {/* Back to Login */}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              style={authFeatureStyles.backToLoginWithMargin}
            >
              <Text style={authFeatureStyles.backToLoginText}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.xs,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  flexSpacer: {
    flex: 0.2,
  },
});
