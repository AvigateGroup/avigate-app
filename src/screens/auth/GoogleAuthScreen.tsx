// src/screens/auth/GoogleAuthScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { authApi } from '@/api/auth.api';
import { handleApiError, getDeviceInfo, getFCMToken } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { GoogleAuthDto } from '@/types/auth.types';
import { COLORS } from '@/constants/colors';
import { GOOGLE_CONFIG } from '@/constants/config';
import { 
  buttonStyles, 
  layoutStyles,
} from '@/styles/base';
import { authFeatureStyles } from '@/styles/features/auth';

// Required for web browser to close properly after auth
WebBrowser.maybeCompleteAuthSession();

export const GoogleAuthScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Configure OAuth request
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'avigate',
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: response.error?.message || 'Failed to authenticate with Google',
      });
    } else if (response?.type === 'dismiss' || response?.type === 'cancel') {
      Toast.show({
        type: 'info',
        text1: 'Cancelled',
        text2: 'Sign in was cancelled',
      });
    }
  }, [response]);

  useEffect(() => {
    if (request) {
      console.log('📍 OAuth Redirect URI:', request.redirectUri);
      console.log('🔑 Add this URI to Google Cloud Console if needed');
    }
  }, [request]);

  const handleGoogleResponse = async (authResponse: any) => {
    setLoading(true);

    try {
      const { id_token } = authResponse.params;

      if (!id_token) {
        throw new Error('No ID token received from Google');
      }

      const userInfo = parseJwt(id_token);

      // Get FCM token and device info
      const fcmToken = await getFCMToken();
      const deviceInfo = {
        userAgent: getDeviceInfo(),
        platform: Platform.OS,
        language: navigator?.language || 'en-US',
      };

      // Prepare Google auth data matching backend API exactly
      const googleAuthDto: GoogleAuthDto = {
        email: userInfo.email,
        googleId: userInfo.sub,
        firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || 'User',
        lastName: userInfo.family_name || userInfo.name?.split(' ')[1] || '',
        profilePicture: userInfo.picture || undefined,
        idToken: id_token,
        fcmToken: fcmToken,
        deviceInfo: deviceInfo,
      };

      const response = await authApi.googleAuth(googleAuthDto);

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

        // Check if additional info is required
        if (response.data.requiresPhoneNumber) {
          router.replace({
            pathname: '/(auth)/phone-verification',
            params: { fromGoogleAuth: 'true' }
          });
        } else if (response.data.requiresVerification) {
          router.replace({
            pathname: '/(auth)/verify-email',
            params: { email: userInfo.email }
          });
        }
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: handleApiError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!request) {
      Toast.show({
        type: 'error',
        text1: 'Configuration Error',
        text2: 'Google Sign-In is not ready yet',
      });
      return;
    }

    try {
      await promptAsync();
    } catch (error: any) {
      console.error('Error initiating Google Sign-In:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to initiate Google Sign-In',
      });
    }
  };

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return {};
    }
  };

  if (!request) {
    return <Loading fullScreen message="Configuring Google Sign-In..." />;
  }

  return (
    <AuthLayout showLogo={true}>
      <View style={authFeatureStyles.authContent}>
        <View>
          <TouchableOpacity
            style={buttonStyles.backButtonWithIcon}
            onPress={() => router.back()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>

          <View style={authFeatureStyles.googleIconContainer}>
            <View style={authFeatureStyles.googleIconCircle}>
              <Icon name="logo-google" size={40} color="#4285F4" />
            </View>
          </View>

          <Text style={authFeatureStyles.titleCentered}>Sign in with Google</Text>
          <Text style={authFeatureStyles.subtitleCentered}>
            Use your Google account to sign in quickly and securely
          </Text>

          <View style={authFeatureStyles.benefitsContainer}>
            <View style={authFeatureStyles.benefitItem}>
              <Icon name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={authFeatureStyles.benefitText}>Quick and secure sign-in</Text>
            </View>
            <View style={authFeatureStyles.benefitItem}>
              <Icon name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={authFeatureStyles.benefitText}>No password to remember</Text>
            </View>
            <View style={authFeatureStyles.benefitItem}>
              <Icon name="checkmark-circle" size={18} color={COLORS.success} />
              <Text style={authFeatureStyles.benefitText}>Auto-verified email</Text>
            </View>
          </View>
        </View>

        <View>
          <TouchableOpacity
            onPress={handleGoogleSignIn}
            disabled={loading || !request}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../../assets/images/google-icon.png')}
              style={authFeatureStyles.googleButtonImage}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <View style={layoutStyles.divider}>
            <View style={layoutStyles.dividerLine} />
            <Text style={layoutStyles.dividerText}>OR</Text>
            <View style={layoutStyles.dividerLine} />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={authFeatureStyles.emailSignIn}
          >
            <Text style={authFeatureStyles.emailSignInText}>Sign in with Email</Text>
          </TouchableOpacity>

          <View style={authFeatureStyles.privacyNote}>
            <Icon name="shield-checkmark-outline" size={14} color={COLORS.textMuted} />
            <Text style={authFeatureStyles.privacyText}>
              We'll never post anything without your permission
            </Text>
          </View>
        </View>
      </View>
    </AuthLayout>
  );
};