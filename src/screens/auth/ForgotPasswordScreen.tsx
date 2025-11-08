// src/screens/auth/ForgotPasswordScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateEmail } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { buttonStyles, formStyles, layoutStyles } from '@/styles/base';
import { authFeatureStyles } from '@/styles/features/auth';
import { StyleSheet } from 'react-native';

export const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validate = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      const response = await authApi.forgotPassword({
        email: email.toLowerCase().trim(),
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Reset Code Sent',
          text2: 'Check your email for the password reset code',
        });

        // Navigate to reset password screen
        router.push({
          pathname: '/(auth)/reset-password',
          params: { email: email.toLowerCase().trim() },
        });
      }
    } catch (error: any) {
      const errorMessage = handleApiError(error);
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showLogo={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.container}>
            {/* Back Button - Left Aligned */}
            <TouchableOpacity
              style={styles.backButtonContainer}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={buttonStyles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            {/* Content Wrapper - Centered and Justified */}
            <View style={styles.contentWrapper}>
              {/* Header Section - Centered */}
              <View style={styles.headerSection}>
                <Text style={styles.title}>Forgot Password?</Text>
                <Text style={styles.subtitle}>
                  Enter your email address and we'll send you a code to reset your password.
                </Text>
              </View>

              {/* Form */}
              <View style={formStyles.form}>
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    setError('');
                  }}
                  error={error}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon="mail-outline"
                />

                <Button
                  title="Send Reset Code"
                  onPress={handleSubmit}
                  loading={loading}
                  style={buttonStyles.submitButton}
                />
              </View>

              {/* Info Box - Centered */}
              <View style={styles.infoBoxCentered}>
                <View style={styles.infoHeader}>
                  <Icon name="information-circle-outline" size={16} color="#7C3AED" />
                  <Text style={authFeatureStyles.infoTitle}>What happens next?</Text>
                </View>
                <View style={authFeatureStyles.infoList}>
                  <Text style={authFeatureStyles.infoItem}>1. Check your email inbox</Text>
                  <Text style={authFeatureStyles.infoItem}>2. Enter the 6-digit code we sent</Text>
                  <Text style={authFeatureStyles.infoItem}>3. Create your new password</Text>
                  <Text style={authFeatureStyles.infoItem}>4. Login with your new credentials</Text>
                </View>
              </View>
            </View>

            {/* Footer - Centered */}
            <View style={styles.footerCentered}>
              <Text style={layoutStyles.footerText}>
                Remember your password?{' '}
                <Text
                  style={layoutStyles.footerLink}
                  onPress={() => router.push('/(auth)/login')}
                >
                  Sign In
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center', // Centers content vertically
  },
  container: {
    flex: 1,
    justifyContent: 'space-between', // Distributes space evenly
    paddingVertical: 20,
  },
  backButtonContainer: {
    alignSelf: 'flex-start', // Keep back button left-aligned
    paddingHorizontal: 20,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center', // Centers all content
    alignItems: 'center', // Centers horizontally
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center', // Center text horizontally
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  infoBoxCentered: {
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
    marginTop: 16,
    width: '100%', // Full width to match form
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  footerCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});
