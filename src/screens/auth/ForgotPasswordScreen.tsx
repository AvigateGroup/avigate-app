// src/screens/auth/ForgotPasswordScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { SPACING } from '@/utils/responsive';

export const ForgotPasswordScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: insets.top || SPACING.xl }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Text style={buttonStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Main Content - This naturally centers on taller screens */}
          <View style={styles.contentWrapper}>
            {/* Header Section */}
            <View style={authFeatureStyles.stepContainer}>
              <Text style={authFeatureStyles.stepTitle}>Forgot Password?</Text>
              <Text style={authFeatureStyles.stepSubtitle}>
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

            {/* Info Box */}
            <View style={authFeatureStyles.infoBox}>
              <View style={authFeatureStyles.infoHeader}>
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

            {/* Spacer to push footer down on tall screens */}
            <View style={styles.flexSpacer} />

            {/* Footer */}
            <View style={layoutStyles.footer}>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.xs,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  flexSpacer: {
    flex: 0.3, // Takes up 30% of remaining space, pushing footer down
  },
});
