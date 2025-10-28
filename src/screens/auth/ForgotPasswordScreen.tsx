// src/screens/auth/ForgotPasswordScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateEmail } from '@/utils/validation';
import { handleApiError } from '@/utils/helpers';
import { COLORS } from '@/constants/colors';

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
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
        navigation.navigate('ResetPassword', { 
          email: email.toLowerCase().trim() 
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: handleApiError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showLogo={false}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          No worries! Enter your email address and we'll send you a code to reset your password.
        </Text>

        <View style={styles.form}>
          <Input
            label="Email Address"
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            error={error}
            keyboardType="email-address"
            autoCapitalize="none"
            autoFocus
            leftIcon="mail-outline"
          />

          <Button
            title="Send Reset Code"
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📧 What happens next?</Text>
          <Text style={styles.infoText}>
            1. Check your email inbox{'\n'}
            2. Enter the 6-digit code we sent{'\n'}
            3. Create your new password{'\n'}
            4. Login with your new credentials
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}>Sign In</Text>
          </TouchableOpacity>
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
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
    marginBottom: 32,
    lineHeight: 24,
  },
  form: {
    marginBottom: 24,
  },
  submitButton: {
    marginTop: 8,
  },
  infoBox: {
    backgroundColor: COLORS.backgroundLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: COLORS.textLight,
    lineHeight: 22,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  footerLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
});