// src/screens/auth/ForgotPasswordScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateEmail } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { authStyles, commonStyles } from '@/styles';

export const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await authApi.forgotPassword({
        email: email.toLowerCase().trim(),
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Reset Code Sent',
          text2: 'Check your email for the password reset code',
        });

        // Navigate to reset password screen
        router.push({
          pathname: '/(auth)/reset-password',
          params: { email: email.toLowerCase().trim() }
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: handleApiError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showLogo={false}>
      <View style={authStyles.container}>
        <TouchableOpacity
          style={authStyles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={authStyles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={authStyles.title}>Forgot Password?</Text>
        <Text style={authStyles.subtitle}>
          Enter your email address and we'll send you a code to reset your password.
        </Text>

        <View style={authStyles.form}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
            leftIcon="mail-outline"
          />

          <Button
            title="Send Reset Code"
            onPress={handleSubmit}
            loading={loading}
            style={authStyles.submitButton}
          />
        </View>

        <View style={commonStyles.infoBox}>
          <Text style={commonStyles.infoTitle}>📧 What happens next?</Text>
          <Text style={commonStyles.infoText}>
            1. Check your email inbox{'\n'}
            2. Enter the 6-digit code we sent{'\n'}
            3. Create your new password{'\n'}
            4. Login with your new credentials
          </Text>
        </View>

        <View style={commonStyles.footer}>
          <Text style={commonStyles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={commonStyles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};
