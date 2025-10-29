// src/screens/auth/GoogleAuthScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { authApi } from '@/api/auth.api';
import { handleApiError, getDeviceInfo } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';
import { GOOGLE_CONFIG } from '@/constants/config';
import { authStyles, commonStyles } from '@/styles';

export const GoogleAuthScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
        iosClientId: GOOGLE_CONFIG.IOS_CLIENT_ID,
        offlineAccess: true,
        forceCodeForRefreshToken: true,
      });
      setIsConfigured(true);
    } catch (error) {
      console.error('Google Sign-In configuration error:', error);
      Alert.alert(
        'Configuration Error',
        'Google Sign-In is not properly configured. Please check your configuration.',
      );
    }
  };

  const handleGoogleSignIn = async () => {
    if (!isConfigured) {
      Toast.show({
        type: 'error',
        text1: 'Configuration Error',
        text2: 'Google Sign-In is not configured',
      });
      return;
    }

    setLoading(true);

    try {
      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      if (!userInfo.user) {
        throw new Error('Failed to get user information from Google');
      }

      const { user, idToken } = userInfo;

      // Send Google auth data to backend
      const response = await authApi.googleAuth({
        email: user.email,
        googleId: user.id,
        firstName: user.givenName || user.name?.split(' ')[0] || 'User',
        lastName: user.familyName || user.name?.split(' ')[1] || '',
        profilePicture: user.photo || undefined,
        idToken: idToken || undefined,
        deviceInfo: {
          userAgent: getDeviceInfo(),
          platform: Platform.OS,
        },
      });

      if (response.success && response.data.accessToken && response.data.refreshToken) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.message,
        });

        await login(
          response.data.accessToken,
          response.data.refreshToken,
          response.data.user
        );

        // Check if phone number is required
        if (response.data.requiresPhoneNumber) {
          router.replace({
            pathname: '/(auth)/phone-verification',
            params: { fromGoogleAuth: 'true' }
          });
        }
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({
          type: 'info',
          text1: 'Cancelled',
          text2: 'Sign in was cancelled',
        });
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          type: 'info',
          text1: 'In Progress',
          text2: 'Sign in is already in progress',
        });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Google Play Services not available',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Sign In Failed',
          text2: handleApiError(error),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isConfigured) {
    return <Loading fullScreen message="Configuring Google Sign-In..." />;
  }

  return (
    <AuthLayout showLogo={false}>
      <View style={authStyles.container}>
        <TouchableOpacity
          style={authStyles.backButtonWithIcon}
          onPress={() => router.back()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={authStyles.iconContainerLarge}>
          <View style={authStyles.googleIconCircle}>
            <Icon name="logo-google" size={48} color="#4285F4" />
          </View>
        </View>

        <Text style={authStyles.titleCentered}>Sign in with Google</Text>
        <Text style={authStyles.subtitleCentered}>
          Use your Google account to sign in quickly and securely
        </Text>

        <View style={authStyles.benefitsContainer}>
          <View style={authStyles.benefitItem}>
            <Icon name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={authStyles.benefitText}>Quick and secure sign-in</Text>
          </View>
          <View style={authStyles.benefitItem}>
            <Icon name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={authStyles.benefitText}>No password to remember</Text>
          </View>
          <View style={authStyles.benefitItem}>
            <Icon name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={authStyles.benefitText}>Auto-verified email</Text>
          </View>
        </View>

        <Button
          title={loading ? 'Signing in...' : 'Continue with Google'}
          onPress={handleGoogleSignIn}
          loading={loading}
          variant="outline"
          style={authStyles.googleButton}
        />

        <View style={commonStyles.divider}>
          <View style={commonStyles.dividerLine} />
          <Text style={commonStyles.dividerText}>OR</Text>
          <View style={commonStyles.dividerLine} />
        </View>

        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          style={authStyles.emailSignIn}
        >
          <Text style={authStyles.emailSignInText}>Sign in with Email</Text>
        </TouchableOpacity>

        <View style={authStyles.footerWithIcon}>
          <Icon name="shield-checkmark-outline" size={16} color={COLORS.textMuted} />
          <Text style={authStyles.footerTextWithIcon}>
            We'll never post anything without your permission
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};
