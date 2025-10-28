// src/screens/auth/GoogleAuthScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
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

type GoogleAuthScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const GoogleAuthScreen: React.FC<GoogleAuthScreenProps> = ({
  navigation,
}) => {
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
          navigation.replace('PhoneVerification', {
            fromGoogleAuth: true,
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
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.iconContainer}>
          <View style={styles.googleIconCircle}>
            <Icon name="logo-google" size={48} color="#4285F4" />
          </View>
        </View>

        <Text style={styles.title}>Sign in with Google</Text>
        <Text style={styles.subtitle}>
          Use your Google account to sign in quickly and securely
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Quick and secure sign-in</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>No password to remember</Text>
          </View>
          <View style={styles.benefitItem}>
            <Icon name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.benefitText}>Auto-verified email</Text>
          </View>
        </View>

        <Button
          title={loading ? 'Signing in...' : 'Continue with Google'}
          onPress={handleGoogleSignIn}
          loading={loading}
          variant="outline"
          style={styles.googleButton}
        />

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.emailSignIn}
        >
          <Text style={styles.emailSignInText}>Sign in with Email</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Icon name="shield-checkmark-outline" size={16} color={COLORS.textMuted} />
          <Text style={styles.footerText}>
            We'll never post anything without your permission
          </Text>
        </View>
      </View>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  googleIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 24,
  },
  benefitsContainer: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  benefitText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 12,
  },
  googleButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  emailSignIn: {
    alignItems: 'center',
    marginBottom: 24,
  },
  emailSignInText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});