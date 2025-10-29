// src/screens/auth/RegisterScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 
import Toast from 'react-native-toast-message';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { authApi } from '@/api/auth.api';
import { validateEmail, validatePassword, validatePhoneNumber } from '@/utils/validation';
import { handleApiError, getDeviceInfo } from '@/utils/helpers';
import { authStyles, commonStyles } from '@/styles'; 

export const RegisterScreen: React.FC = () => {
  const router = useRouter(); 
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
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
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

        // Navigate using Expo Router
        router.push({
          pathname: '/(auth)/verify-email',
          params: { email: formData.email.toLowerCase().trim() }
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
      {/* Using centralized styles - no local StyleSheet needed! */}
      <View style={authStyles.container}>
        <Text style={authStyles.title}>Create Account</Text>
        <Text style={authStyles.subtitle}>Sign up to get started with Avigate</Text>

        <View style={authStyles.form}>
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
            style={commonStyles.marginBottom24}
          />

          <View style={commonStyles.divider}>
            <View style={commonStyles.dividerLine} />
            <Text style={commonStyles.dividerText}>OR</Text>
            <View style={commonStyles.dividerLine} />
          </View>

          <Button
            title="Sign up with Google"
            onPress={() => router.push('/(auth)/google-auth')}
            variant="outline"
          />
        </View>

        <View style={authStyles.footerWithPadding}>
          <Text style={commonStyles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={commonStyles.footerLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AuthLayout>
  );
};
