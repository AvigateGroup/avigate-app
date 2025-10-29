// src/screens/auth/GoogleAuthScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/common/Button';
import { Loading } from '@/components/common/Loading';
import { authApi } from '@/api/auth.api';
import { handleApiError, getDeviceInfo } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';
import { GOOGLE_CONFIG } from '@/constants/config';
import { authStyles, commonStyles } from '@/styles';

// Required for web browser to close properly after auth
WebBrowser.maybeCompleteAuthSession();

export const GoogleAuthScreen: React.FC = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Configure OAuth request
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');
  
  // Use Expo's auth proxy for Web OAuth clients
  // This works with http/https redirect URIs in Google Console
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, // This makes it work with Web OAuth clients
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

  // Log the redirect URI for debugging
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

      // Decode the ID token to get user info
      // In production, you should verify this token on your backend
      const userInfo = parseJwt(id_token);

      // Send Google auth data to backend
      const response = await authApi.googleAuth({
        email: userInfo.email,
        googleId: userInfo.sub,
        firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || 'User',
        lastName: userInfo.family_name || userInfo.name?.split(' ')[1] || '',
        profilePicture: userInfo.picture || undefined,
        idToken: id_token,
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

  // Helper function to parse JWT token
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
          disabled={loading || !request}
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