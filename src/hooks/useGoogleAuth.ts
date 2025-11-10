// src/hooks/useGoogleAuth.ts

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { authApi } from '@/api/auth.api';
import { handleApiError, getDeviceInfo, getFCMToken } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { GoogleAuthDto } from '@/types/auth.types';
import { GOOGLE_CONFIG } from '@/constants/config';

// Required for web browser to close properly after auth
WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  // Configure OAuth discovery
  const discovery = AuthSession.useAutoDiscovery('https://accounts.google.com');

  // Select the correct client ID based on platform
  const getClientId = () => {
    if (Platform.OS === 'ios') {
      // Use iOS client ID if available, fallback to web
      return GOOGLE_CONFIG.IOS_CLIENT_ID || GOOGLE_CONFIG.WEB_CLIENT_ID;
    } else if (Platform.OS === 'android') {
      // Use Android client ID if available, fallback to web
      return GOOGLE_CONFIG.ANDROID_CLIENT_ID || GOOGLE_CONFIG.WEB_CLIENT_ID;
    }
    // Default to web client ID for web platform or Expo Go
    return GOOGLE_CONFIG.WEB_CLIENT_ID;
  };

  const clientId = getClientId();

  // Create redirect URI
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'avigate',
    path: 'auth/callback',
  });

  // Configure the auth request with authorization code flow + PKCE
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: {
        access_type: 'offline',
      },
    },
    discovery,
  );

  // Log configuration for debugging
  useEffect(() => {
    if (request) {
      console.log('📱 Platform:', Platform.OS);
      console.log('🔑 Using Client ID:', clientId ? clientId.substring(0, 20) + '...' : 'NOT SET');
      console.log('📍 Redirect URI:', redirectUri);
      
      if (!clientId || clientId === '') {
        console.error('❌ ERROR: No client ID configured for platform:', Platform.OS);
        console.error('   Please check your .env file and ensure:');
        if (Platform.OS === 'android') {
          console.error('   - EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID is set');
        } else if (Platform.OS === 'ios') {
          console.error('   - EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID is set');
        } else {
          console.error('   - EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is set');
        }
      }
    }
  }, [request, redirectUri, clientId]);

  // Handle auth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
      
      // Provide more helpful error messages
      let errorMessage = response.error?.message || 'Failed to authenticate with Google';
      
      if (errorMessage.includes('code_challenge_method')) {
        errorMessage = `Platform configuration error. Please ensure you've created ${Platform.OS === 'android' ? 'an Android' : Platform.OS === 'ios' ? 'an iOS' : 'a Web'} OAuth client in Google Cloud Console.`;
      }
      
      Toast.show({
        type: 'error',
        text1: 'Authentication Error',
        text2: errorMessage,
        visibilityTime: 6000,
      });
    } else if (response?.type === 'dismiss' || response?.type === 'cancel') {
      Toast.show({
        type: 'info',
        text1: 'Cancelled',
        text2: 'Sign in was cancelled',
      });
    }
  }, [response]);

  const handleGoogleResponse = async (authResponse: AuthSession.AuthSessionResult) => {
    if (authResponse.type !== 'success') return;

    setLoading(true);

    try {
      const { code } = authResponse.params;

      if (!code) {
        throw new Error('No authorization code received from Google');
      }

      // Exchange authorization code for tokens
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId,
          code,
          redirectUri,
        },
        discovery!,
      );

      const { idToken } = tokenResponse;

      if (!idToken) {
        throw new Error('No ID token received from token exchange');
      }

      // Parse the ID token to get user info
      const userInfo = parseJwt(idToken);

      // Get FCM token and device info
      const fcmToken = await getFCMToken();
      const deviceInfo = {
        userAgent: getDeviceInfo(),
        platform: Platform.OS,
        language: 'en-US',
      };

      // Prepare Google auth data matching backend API
      const googleAuthDto: GoogleAuthDto = {
        email: userInfo.email,
        googleId: userInfo.sub,
        firstName: userInfo.given_name || userInfo.name?.split(' ')[0] || 'User',
        lastName: userInfo.family_name || userInfo.name?.split(' ')[1] || '',
        profilePicture: userInfo.picture || undefined,
        idToken: idToken,
        fcmToken: fcmToken,
        deviceInfo: deviceInfo,
      };

      // Call your backend
      const response = await authApi.googleAuth(googleAuthDto);

      if (response.success && response.data.accessToken && response.data.refreshToken) {
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: response.message || 'Successfully signed in with Google',
        });

        // Save auth tokens and user data
        await login(response.data.accessToken, response.data.refreshToken, response.data.user);

        // Handle additional verification requirements
        if (response.data.requiresPhoneNumber) {
          router.replace({
            pathname: '/(auth)/phone-verification',
            params: { fromGoogleAuth: 'true' },
          });
        } else if (response.data.requiresVerification) {
          router.replace({
            pathname: '/(auth)/verify-email',
            params: { email: userInfo.email },
          });
        }
        // If no additional requirements, AuthContext will navigate to main app
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      
      // More specific error messages
      let errorMessage = handleApiError(error);
      let errorTitle = 'Sign In Failed';

      if (error.message?.includes('authorization code')) {
        errorTitle = 'Authentication Error';
        errorMessage = 'Failed to complete sign in. Please try again.';
      } else if (error.message?.includes('token exchange')) {
        errorTitle = 'Token Exchange Failed';
        errorMessage = 'Could not verify your Google account. Please try again.';
      }

      Toast.show({
        type: 'error',
        text1: errorTitle,
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!request) {
      Toast.show({
        type: 'error',
        text1: 'Configuration Error',
        text2: 'Google Sign-In is not ready yet. Please try again.',
      });
      return;
    }

    if (!clientId || clientId === '') {
      Toast.show({
        type: 'error',
        text1: 'Configuration Missing',
        text2: `Please configure ${Platform.OS === 'android' ? 'Android' : Platform.OS === 'ios' ? 'iOS' : 'Web'} OAuth client in .env file`,
        visibilityTime: 6000,
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

  // Helper to parse JWT
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return {};
    }
  };

  return {
    signInWithGoogle,
    loading,
    isReady: !!request && !!clientId,
  };
};