// src/screens/auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
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
import { buttonStyles, formStyles, layoutStyles } from '@/styles/base';
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

      // Prepare login data
      const loginDto: LoginDto = {
        email: email.toLowerCase().trim(),
        password: password,
        fcmToken: fcmToken,
        deviceInfo: deviceInfo,
      };

      const response = await authApi.login(loginDto);

      if (response.success) {
        // Check what type of response we got
        const {
          accessToken,
          refreshToken,
          user,
          requiresOtpVerification,
          requiresVerification,
          requiresPhoneNumber,
        } = response.data;

        // Case 1: OTP verification required (most common for your flow)
        if (requiresOtpVerification) {
          Toast.show({
            type: 'success',
            text1: 'Verification Code Sent',
            text2: 'Please check your email for the login code',
          });

          // Navigate to OTP verification screen
          router.push({
            pathname: '/(auth)/verify-login-otp',
            params: { email: email.toLowerCase().trim() },
          });
          return;
        }

        // Case 2: Full login with tokens (direct login without OTP)
        if (accessToken && refreshToken && user) {
          Toast.show({
            type: 'success',
            text1: 'Welcome Back!',
            text2: response.message || 'Login successful',
          });

          // Save auth data
          await login(accessToken, refreshToken, user);

          // Check for additional verification requirements
          if (requiresVerification) {
            router.replace({
              pathname: '/(auth)/verify-email',
              params: { email: email.toLowerCase().trim() },
            });
          } else if (requiresPhoneNumber) {
            router.replace('/(auth)/phone-verification');
          }
          // If no additional requirements, AuthContext will handle navigation to main app
          return;
        }

        // Case 3: Email verification required (unverified account)
        if (requiresVerification) {
          Toast.show({
            type: 'info',
            text1: 'Email Verification Required',
            text2: response.message || 'Please verify your email to continue',
          });

          router.replace({
            pathname: '/(auth)/verify-email',
            params: { email: email.toLowerCase().trim() },
          });
          return;
        }

        // Fallback: If we get here, something unexpected happened
        Toast.show({
          type: 'error',
          text1: 'Login Error',
          text2: 'Unexpected response from server. Please try again.',
        });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = handleApiError(error);
      const statusCode = error?.response?.status;

      // Handle specific error cases
      if (statusCode === 401) {
        // Invalid credentials
        Toast.show({
          type: 'error',
          text1: 'Invalid Credentials',
          text2: 'The email or password you entered is incorrect.',
          visibilityTime: 4000,
        });
        
        // Clear password for security and show error state on both fields
        setPassword('');
        setErrors({
          email: 'Invalid credentials', // Space to trigger error styling without duplicate message
          password: 'Invalid credentials',
        });
      } else if (statusCode === 429) {
        // Rate limiting
        Toast.show({
          type: 'error',
          text1: 'Too Many Attempts',
          text2: 'Please wait a few minutes before trying again.',
          visibilityTime: 5000,
        });
      } else if (statusCode === 403) {
        // Account might be locked or disabled
        Toast.show({
          type: 'error',
          text1: 'Access Denied',
          text2: errorMessage,
          visibilityTime: 5000,
        });
      } else if (
        errorMessage.toLowerCase().includes('verification code') ||
        errorMessage.toLowerCase().includes('check your email') ||
        errorMessage.toLowerCase().includes('otp')
      ) {
        // OTP already sent or required
        Toast.show({
          type: 'info',
          text1: 'Verification Required',
          text2: errorMessage,
          visibilityTime: 3000,
        });
        
        setTimeout(() => {
          router.push({
            pathname: '/(auth)/verify-login-otp',
            params: { email: email.toLowerCase().trim() },
          });
        }, 1500);
      } else {
        // Generic error
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: errorMessage,
          visibilityTime: 4000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showLogo={true}>
      <View style={authFeatureStyles.authContent}>
        <Text style={authFeatureStyles.welcomeTitle}>Welcome to Avigate</Text>
        <Text style={authFeatureStyles.welcomeSubtitle}>Sign up or login below to continue.</Text>

        {/* Email/Password Form */}
        <View style={formStyles.form}>
          <Input
            placeholder="Enter your email"
            value={email}
            onChangeText={text => {
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
            onChangeText={text => {
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

        {/* Divider */}
        <View style={layoutStyles.divider}>
          <View style={layoutStyles.dividerLine} />
          <Text style={layoutStyles.dividerText}>OR</Text>
          <View style={layoutStyles.dividerLine} />
        </View>

        {/* Google Login Button with Image */}
        <View style={authFeatureStyles.socialButtonsContainer}>
          <TouchableOpacity onPress={() => router.push('/(auth)/google-auth')} activeOpacity={0.8}>
            <Image
              source={require('../../../assets/images/google-icon.png')}
              style={authFeatureStyles.googleButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={layoutStyles.footer}>
          <Text style={layoutStyles.footerText}>
            Don't have an account?{' '}
            <Text style={layoutStyles.footerLink} onPress={() => router.push('/(auth)/register')}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};