// src/screens/auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateEmail } from '@/utils/validation';
import { handleApiError, getDeviceInfo, getFCMToken } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { LoginDto } from '@/types/auth.types';
import { 
  containerStyles,  
  buttonStyles, 
  formStyles, 
  layoutStyles,
} from '@/styles/base';
import { authFeatureStyles } from '@/styles/features/auth';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

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
      // Get FCM token and device info
      const fcmToken = await getFCMToken();
      const deviceInfo = getDeviceInfo();

      // Prepare login data matching backend API
      const loginDto: LoginDto = {
        email: email.toLowerCase().trim(),
        password: password,
        fcmToken: fcmToken,
        deviceInfo: deviceInfo,
      };

      const response = await authApi.login(loginDto);

      if (response.success && response.data.accessToken && response.data.refreshToken) {
        Toast.show({
          type: 'success',
          text1: 'Welcome Back!',
          text2: response.message,
        });

        await login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );

        // Navigate based on user status
        if (response.data.requiresVerification) {
          router.replace({
            pathname: '/(auth)/verify-email',
            params: { email: email.toLowerCase().trim() }
          });
        } else if (response.data.requiresPhoneNumber) {
          router.replace('/(auth)/phone-verification');
        } else if (response.data.requiresOtpVerification) {
          router.replace({
            pathname: '/(auth)/verify-login-otp',
            params: { email: email.toLowerCase().trim() }
          });
        }
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
    <AuthLayout showLogo={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={containerStyles.container}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={authFeatureStyles.scrollContent}
        >
          <Text style={authFeatureStyles.welcomeTitle}>Welcome to Avigate</Text>
          <Text style={authFeatureStyles.welcomeSubtitle}>
            Sign up or login below to manage your project, task, and productivity
          </Text>

          {/* Tab Switcher */}
          <View style={authFeatureStyles.tabContainer}>
            <TouchableOpacity
              style={[authFeatureStyles.tab, authFeatureStyles.tabActive]}
              onPress={() => {}}
            >
              <Text style={[authFeatureStyles.tabText, authFeatureStyles.tabTextActive]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={authFeatureStyles.tab}
              onPress={() => router.push('/(auth)/register')}
            >
              <Text style={authFeatureStyles.tabText}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Social Login Buttons */}
          <View style={authFeatureStyles.socialButtonsContainer}>
            <Button
              title="Login with Apple"
              onPress={() => {
                Toast.show({
                  type: 'info',
                  text1: 'Coming Soon',
                  text2: 'Apple Sign-In will be available soon',
                });
              }}
              variant="outline"
              leftIcon="logo-apple"
              style={buttonStyles.buttonOutline}
            />

            <Button
              title="Login with Google"
              onPress={() => router.push('/(auth)/google-auth')}
              variant="outline"
              leftIcon="logo-google"
              style={buttonStyles.buttonOutline}
            />
          </View>

          {/* Divider */}
          <View style={layoutStyles.divider}>
            <View style={layoutStyles.dividerLine} />
            <Text style={layoutStyles.dividerText}>or continue with email</Text>
            <View style={layoutStyles.dividerLine} />
          </View>

          {/* Email/Password Form */}
          <View style={formStyles.form}>
            <Input
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors({ ...errors, email: '' });
              }}
              error={errors.email}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="mail-outline"
            />

            <Input
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              secureTextEntry
              leftIcon="lock-closed-outline"
              rightIcon="eye-outline"
            />

            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={formStyles.forgotPassword}
            >
              <Text style={formStyles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <Button
              title="Login"
              onPress={handleLogin}
              loading={loading}
              style={buttonStyles.submitButton}
            />
          </View>

          {/* Informational Footer - No Agreement Required */}
          <View style={layoutStyles.footer}>
            <Text style={layoutStyles.footerText}>
              Don't have an account?{' '}
              <Text 
                style={layoutStyles.footerLink} 
                onPress={() => router.push('/(auth)/register')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
};