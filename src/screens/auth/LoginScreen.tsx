// src/screens/auth/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { authApi } from '@/api/auth.api';
import { validateEmail } from '@/utils/validation';
import { handleApiError, getDeviceInfo, getFCMToken } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { LoginDto } from '@/types/auth.types';
import { buttonStyles, formStyles, layoutStyles } from '@/styles/base';
import { authFeatureStyles } from '@/styles/features/auth';

export const LoginScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const { signInWithGoogle, loading: googleLoading, isReady } = useGoogleAuth();
  
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
      const fcmToken = await getFCMToken();
      const deviceInfo = getDeviceInfo();

      const loginDto: LoginDto = {
        email: email.toLowerCase().trim(),
        password: password,
        fcmToken: fcmToken,
        deviceInfo: deviceInfo,
      };

      const response = await authApi.login(loginDto);

      if (response.success) {
        const {
          accessToken,
          refreshToken,
          user,
          requiresOtpVerification,
          requiresVerification,
          requiresPhoneNumber,
        } = response.data;

        if (requiresOtpVerification) {
          Toast.show({
            type: 'success',
            text1: 'Verification Code Sent',
            text2: 'Please check your email for the login code',
          });

          router.push({
            pathname: '/(auth)/verify-login-otp',
            params: { email: email.toLowerCase().trim() },
          });
          return;
        }

        if (accessToken && refreshToken && user) {
          Toast.show({
            type: 'success',
            text1: 'Welcome Back!',
            text2: response.message || 'Login successful',
          });

          await login(accessToken, refreshToken, user);

          if (requiresVerification) {
            router.replace({
              pathname: '/(auth)/verify-email',
              params: { email: email.toLowerCase().trim() },
            });
          } else if (requiresPhoneNumber) {
            router.replace('/(auth)/phone-verification');
          }
          return;
        }

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

      if (statusCode === 401) {
        const lowerErrorMessage = errorMessage.toLowerCase();

        if (
          lowerErrorMessage.includes('no account found') ||
          lowerErrorMessage.includes('please sign up')
        ) {
          Toast.show({
            type: 'error',
            text1: 'Account Not Found',
            text2: errorMessage,
            visibilityTime: 6000,
            onPress: () => {
              Toast.hide();
              router.push('/(auth)/register');
            },
          });

          setErrors({
            email: 'No account found with this email',
            password: '',
          });
        } else if (lowerErrorMessage.includes('incorrect password')) {
          Toast.show({
            type: 'error',
            text1: 'Incorrect Password',
            text2: errorMessage,
            visibilityTime: 5000,
            onPress: () => {
              Toast.hide();
              router.push('/(auth)/forgot-password');
            },
          });

          setPassword('');
          setErrors({
            email: '',
            password: 'Incorrect password',
          });
        } else if (lowerErrorMessage.includes('deactivated')) {
          Toast.show({
            type: 'error',
            text1: 'Account Deactivated',
            text2: errorMessage,
            visibilityTime: 5000,
          });

          setErrors({
            email: 'Account deactivated',
            password: '',
          });
        } else {
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
            text2: errorMessage || 'Invalid email or password.',
            visibilityTime: 4000,
          });

          setPassword('');
          setErrors({
            email: ' ',
            password: ' ',
          });
        }
      } else if (statusCode === 429) {
        Toast.show({
          type: 'error',
          text1: 'Too Many Attempts',
          text2: 'Please wait a few minutes before trying again.',
          visibilityTime: 5000,
        });
      } else if (statusCode === 403) {
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

  if (!isReady) {
    return <Loading fullScreen message="Setting up authentication..." />;
  }

  return (
    <AuthLayout showLogo={true}>
      <View style={authFeatureStyles.authContent}>
        <Text style={authFeatureStyles.welcomeTitle}>Welcome to Avigate</Text>
        <Text style={authFeatureStyles.welcomeSubtitle}>Sign up or login below to continue.</Text>

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
            disabled={googleLoading}
            style={buttonStyles.submitButton}
          />
        </View>

        <View style={layoutStyles.divider}>
          <View style={layoutStyles.dividerLine} />
          <Text style={layoutStyles.dividerText}>OR</Text>
          <View style={layoutStyles.dividerLine} />
        </View>

        <View style={authFeatureStyles.socialButtonsContainer}>
          <TouchableOpacity 
            onPress={signInWithGoogle}
            disabled={loading || googleLoading}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../../assets/images/google-icon.png')}
              style={[
                authFeatureStyles.googleButtonImage,
                (loading || googleLoading) && { opacity: 0.5 }
              ]}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

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