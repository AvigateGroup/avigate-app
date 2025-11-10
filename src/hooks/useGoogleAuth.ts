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

  // Create redirect URI
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'avigate',
    path: 'auth/callback', // Optional: adds a path for better organization
  });

  // Configure the auth request with authorization code flow + PKCE
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
      redirectUri,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.Code, // Use Code instead of IdToken
      usePKCE: true, // Explicitly enable PKCE for security
      // Optional: Add these for better UX
      extraParams: {
        access_type: 'offline', // Get refresh token
      },
    },
    discovery,
  );

  // Log redirect URI for debugging (add this to Google Console)
  useEffect(() => {
    if (request) {
      console.log('📍 OAuth Redirect URI:', redirectUri);
      console.log('🔑 Add this exact URI to Google Cloud Console:');
      console.log('   - Go to: https://console.cloud.google.com/apis/credentials');
      console.log('   - Edit your OAuth 2.0 Client ID');
      console.log(`   - Add to "Authorized redirect URIs": ${redirectUri}`);
    }
  }, [request, redirectUri]);

  // Handle auth response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      console.error('Google Auth Error:', response.error);
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
          clientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
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
        language: 'en-US', // You can get this from device locale if needed
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
    isReady: !!request,
  };
};