// src/screens/auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateEmail } from '@/utils/validation';
import { handleApiError, getDeviceInfo } from '@/utils/helpers';
import { authStyles, commonStyles } from '@/styles';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authApi.login({
        email: email.toLowerCase().trim(),
        password,
        deviceInfo: getDeviceInfo(),
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.message,
        });

        // Navigate to OTP verification screen
        router.push({
          pathname: '/(auth)/verify-login-otp',
          params: { email: email.toLowerCase().trim() }
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: handleApiError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <View style={authStyles.container}>
        <Text style={authStyles.title}>Welcome Back</Text>
        <Text style={authStyles.subtitle}>Sign in to continue to Avigate</Text>

        <View style={authStyles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors({ ...errors, email: undefined });
            }}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: undefined });
            }}
            error={errors.password}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={authStyles.forgotPassword}
          >
            <Text style={authStyles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={commonStyles.marginBottom24}
          />

          <View style={commonStyles.divider}>
            <View style={commonStyles.dividerLine} />
            <Text style={commonStyles.dividerText}>OR</Text>
            <View style={commonStyles.dividerLine} />
          </View>

          <Button
            title="Sign in with Google"
            onPress={() => router.push('/(auth)/google-auth')}
            variant="outline"
          />
        </View>

        <View style={commonStyles.footer}>
          <Text style={commonStyles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={commonStyles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};
