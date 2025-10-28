// src/screens/auth/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateEmail, validatePassword, validatePhoneNumber } from '@/utils/validation';
import { handleApiError, getDeviceInfo } from '@/utils/helpers';
import { COLORS } from '@/constants/colors';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: undefined });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.phoneNumber && !validatePhoneNumber(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0];
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authApi.register({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNumber: formData.phoneNumber || undefined,
        deviceInfo: getDeviceInfo(),
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Registration Successful',
          text2: response.message,
        });

        // Navigate to email verification
        navigation.navigate('VerifyEmail', { 
          email: formData.email.toLowerCase().trim() 
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: handleApiError(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout showLogo={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started with Avigate</Text>

        <View style={styles.form}>
          <Input
            label="First Name"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChangeText={(text) => updateField('firstName', text)}
            error={errors.firstName}
            leftIcon="person-outline"
          />

          <Input
            label="Last Name"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChangeText={(text) => updateField('lastName', text)}
            error={errors.lastName}
            leftIcon="person-outline"
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={formData.email}
            onChangeText={(text) => updateField('email', text)}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="mail-outline"
          />

          <Input
            label="Phone Number (Optional)"
            placeholder="+234 800 000 0000"
            value={formData.phoneNumber}
            onChangeText={(text) => updateField('phoneNumber', text)}
            error={errors.phoneNumber}
            keyboardType="phone-pad"
            leftIcon="call-outline"
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={formData.password}
            onChangeText={(text) => updateField('password', text)}
            error={errors.password}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChangeText={(text) => updateField('confirmPassword', text)}
            error={errors.confirmPassword}
            secureTextEntry
            leftIcon="lock-closed-outline"
          />

          <Button
            title="Sign Up"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Sign up with Google"
            onPress={() => navigation.navigate('GoogleAuth')}
            variant="outline"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
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
  },
  form: {
    marginBottom: 24,
  },
  registerButton: {
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 24,
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