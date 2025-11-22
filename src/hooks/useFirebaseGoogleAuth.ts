// src/hooks/useFirebaseGoogleAuth.ts

import { useState, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { authApi } from '@/api/auth.api';
import { getDeviceInfo, getFCMToken } from '@/utils/helpers';
import { useAuth } from '@/store/AuthContext';
import { GoogleAuthDto } from '@/types/auth.types';
import { GOOGLE_CONFIG } from '@/constants/config';

export const useFirebaseGoogleAuth = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    configureGoogleSignIn();
  }, []);

  const configureGoogleSignIn = () => {
    try {
      // Validate that we have the required Web Client ID
      if (!GOOGLE_CONFIG.WEB_CLIENT_ID) {
        console.error(' CRITICAL: Google Web Client ID is missing!');
        Toast.show({
          type: 'error',
          text1: 'Configuration Error',
          text2: 'Google Sign-In is not properly configured. Please reinstall the app.',
          visibilityTime: 8000,
        });
        setIsConfigured(false);
        return;
      }

      GoogleSignin.configure({
        webClientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
        offlineAccess: true,
      });

      setIsConfigured(true);
    } catch (error) {
      console.error(' Failed to configure Google Sign-In:', error);
      Toast.show({
        type: 'error',
        text1: 'Configuration Error',
        text2: 'Failed to initialize Google Sign-In',
      });
      setIsConfigured(false);
    }
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) {
      console.warn(' Google Sign-In not configured yet');
      Toast.show({
        type: 'error',
        text1: 'Not Ready',
        text2: 'Google Sign-In is still initializing...',
      });
      return;
    }

    setLoading(true);

    try {
      // Check if device supports Google Play Services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

      // Sign in with Google
      const signInResult = await GoogleSignin.signIn();

      // Handle the response structure
      const userInfo = signInResult.data || signInResult;

      if (!userInfo || !userInfo.user) {
        throw new Error('No user information received from Google');
      }

      const user = userInfo.user;
      // Get Google ID token
      const idToken = userInfo.idToken || signInResult.idToken;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Create Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign in to Firebase
      const firebaseUserCredential = await auth().signInWithCredential(googleCredential);

      // Get fresh Firebase ID token

      const firebaseIdToken = await firebaseUserCredential.user.getIdToken();

      // Get FCM token and device info
      const fcmToken = await getFCMToken();
      const deviceInfo = {
        userAgent: getDeviceInfo(),
        platform: Platform.OS,
        language: 'en-US',
      };

      // Prepare data for backend
      const googleAuthDto: GoogleAuthDto = {
        email: user.email,
        googleId: user.id,
        firstName: user.givenName || user.name?.split(' ')[0] || 'User',
        lastName: user.familyName || user.name?.split(' ')[1] || '',
        profilePicture: user.photo || undefined,
        idToken: firebaseIdToken,
        fcmToken: fcmToken,
        deviceInfo: deviceInfo,
      };

      // Call backend API

      const response = await authApi.googleAuth(googleAuthDto);

      if (response.success && response.data.accessToken && response.data.refreshToken) {
        // Save tokens and user data first
        await login(response.data.accessToken, response.data.refreshToken, response.data.user);

        // Show appropriate success message
        const welcomeMessage = response.data.isNewUser ? 'Welcome to Avigate!' : 'Welcome back!';

        Toast.show({
          type: 'success',
          text1: welcomeMessage,
          text2: response.message || 'Successfully signed in with Google',
        });
      }
    } catch (error: any) {
      console.error(' Firebase Google Sign-In Error:', error);
      console.error('  Error Code:', error.code);
      console.error('  Error Message:', error.message);

      // Extract status code and error message
      const statusCode = error?.response?.status || error?.response?.data?.statusCode;
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Authentication failed';

      // Handle Google Sign-In SDK errors
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Toast.show({
          type: 'info',
          text1: 'Cancelled',
          text2: 'Sign in was cancelled',
        });
        return;
      }

      if (error.code === statusCodes.IN_PROGRESS) {
        Toast.show({
          type: 'info',
          text1: 'In Progress',
          text2: 'Sign in is already in progress',
        });
        return;
      }

      if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Toast.show({
          type: 'error',
          text1: 'Play Services Required',
          text2: 'Google Play Services is not available on this device',
          visibilityTime: 5000,
        });
        return;
      }

      // Handle backend errors
      if (statusCode === 409) {
        // Conflict - Account exists with different credentials
        const lowerMessage = errorMessage.toLowerCase();

        if (lowerMessage.includes('different google account')) {
          Alert.alert(
            'Account Already Exists',
            'This email is already registered with different credentials. Would you like to sign in with email and password instead?',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: 'Sign In',
                onPress: () => {
                  router.push('/(auth)/login');
                },
              },
            ],
          );
          return;
        }

        if (lowerMessage.includes('phone') && lowerMessage.includes('already')) {
          Toast.show({
            type: 'error',
            text1: 'Phone Number In Use',
            text2: 'This phone number is already registered to another account',
            visibilityTime: 5000,
          });
          return;
        }

        // Generic conflict error
        Toast.show({
          type: 'error',
          text1: 'Account Conflict',
          text2: errorMessage,
          visibilityTime: 5000,
        });
        return;
      }

      if (statusCode === 401) {
        // Unauthorized - Token verification failed
        Toast.show({
          type: 'error',
          text1: 'Authentication Failed',
          text2: 'Unable to verify your Google account. Please try again.',
          visibilityTime: 5000,
        });

        // Sign out from Google and Firebase
        try {
          await GoogleSignin.signOut();
          await auth().signOut();
        } catch (signOutError) {
          console.error('Sign out error:', signOutError);
        }
        return;
      }

      if (statusCode === 400) {
        // Bad Request - Validation error
        Toast.show({
          type: 'error',
          text1: 'Invalid Data',
          text2: errorMessage,
          visibilityTime: 5000,
        });
        return;
      }

      // Handle DEVELOPER_ERROR
      if (error.message?.includes('DEVELOPER_ERROR') || error.code === '12501') {
        console.error(' DEVELOPER_ERROR - This usually means:');
        console.error('  1. SHA-1 certificate not registered in Firebase Console');
        console.error('  2. Wrong OAuth Client ID being used');
        console.error('  3. google-services.json not properly configured');

        Alert.alert(
          'Configuration Error',
          'Google Sign-In is not properly configured for this build. This usually means the SHA-1 certificate is not registered in Firebase Console.',
          [{ text: 'OK' }],
        );
        return;
      }

      // Handle NETWORK_ERROR
      if (error.message?.includes('NETWORK_ERROR')) {
        Toast.show({
          type: 'error',
          text1: 'Network Error',
          text2: 'Please check your internet connection and try again.',
          visibilityTime: 5000,
        });
        return;
      }

      // Generic error fallback
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: errorMessage,
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    signInWithGoogle,
    signOut,
    loading,
    isReady: isConfigured,
  };
};
