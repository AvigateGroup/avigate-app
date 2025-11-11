// src/hooks/useFirebaseGoogleAuth.ts

import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import { authApi } from '@/api/auth.api';
import { handleApiError, getDeviceInfo, getFCMToken } from '@/utils/helpers';
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
      GoogleSignin.configure({
        webClientId: GOOGLE_CONFIG.WEB_CLIENT_ID,
        offlineAccess: true,
      });
      setIsConfigured(true);
      
      console.log('🔥 Firebase Google Auth configured');
      console.log('📱 Platform:', Platform.OS);
      console.log('🔑 Web Client ID:', GOOGLE_CONFIG.WEB_CLIENT_ID?.substring(0, 20) + '...');
    } catch (error) {
      console.error('❌ Failed to configure Google Sign-In:', error);
      Toast.show({
        type: 'error',
        text1: 'Configuration Error',
        text2: 'Failed to initialize Google Sign-In',
      });
    }
  };

  const signInWithGoogle = async () => {
    if (!isConfigured) {
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

      console.log('📱 Starting Google Sign-In...');

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      
      console.log('✅ Google Sign-In successful:', userInfo.user.email);

      // Get Google ID token
      const { idToken } = userInfo;

      if (!idToken) {
        throw new Error('No ID token received from Google');
      }

      // Create Firebase credential
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      console.log('🔐 Authenticating with Firebase...');

      // Sign in to Firebase
      const firebaseUserCredential = await auth().signInWithCredential(googleCredential);
      
      console.log('✅ Firebase authentication successful');

      // Get fresh Firebase ID token to send to your backend
      const firebaseIdToken = await firebaseUserCredential.user.getIdToken();

      // Get FCM token and device info
      const fcmToken = await getFCMToken();
      const deviceInfo = {
        userAgent: getDeviceInfo(),
        platform: Platform.OS,
        language: 'en-US',
      };

      // Prepare data for your backend
      const googleAuthDto: GoogleAuthDto = {
        email: userInfo.user.email,
        googleId: userInfo.user.id,
        firstName: userInfo.user.givenName || userInfo.user.name?.split(' ')[0] || 'User',
        lastName: userInfo.user.familyName || userInfo.user.name?.split(' ')[1] || '',
        profilePicture: userInfo.user.photo || undefined,
        idToken: firebaseIdToken, // Use Firebase token (more secure)
        fcmToken: fcmToken,
        deviceInfo: deviceInfo,
      };

      console.log('📤 Sending auth data to backend...');

      // Call your backend API
      const response = await authApi.googleAuth(googleAuthDto);

      if (response.success && response.data.accessToken && response.data.refreshToken) {
        Toast.show({
          type: 'success',
          text1: 'Welcome!',
          text2: response.message || 'Successfully signed in with Google',
        });

        // Save tokens and user data
        await login(response.data.accessToken, response.data.refreshToken, response.data.user);

        console.log('✅ Login successful, redirecting...');

        // Handle additional verification if needed
        if (response.data.requiresPhoneNumber) {
          router.replace({
            pathname: '/(auth)/phone-verification',
            params: { fromGoogleAuth: 'true' },
          });
        } else if (response.data.requiresVerification) {
          router.replace({
            pathname: '/(auth)/verify-email',
            params: { email: userInfo.user.email },
          });
        }
        // Otherwise, AuthContext will handle navigation to main app
      }
    } catch (error: any) {
      console.error('❌ Firebase Google Sign-In Error:', error);

      // Handle specific error codes
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
          text1: 'Play Services Required',
          text2: 'Google Play Services is not available on this device',
          visibilityTime: 5000,
        });
      } else {
        let errorMessage = handleApiError(error);
        let errorTitle = 'Sign In Failed';

        // More specific error messages
        if (error.message?.includes('DEVELOPER_ERROR')) {
          errorTitle = 'Configuration Error';
          errorMessage = 'Google Sign-In is not properly configured. Please check your setup.';
        } else if (error.message?.includes('NETWORK_ERROR')) {
          errorTitle = 'Network Error';
          errorMessage = 'Please check your internet connection and try again.';
        }

        Toast.show({
          type: 'error',
          text1: errorTitle,
          text2: errorMessage,
          visibilityTime: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      console.log('✅ Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out error:', error);
    }
  };

  return {
    signInWithGoogle,
    signOut,
    loading,
    isReady: isConfigured,
  };
};