// src/screens/profile/EditProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/store/AuthContext';
import { useThemedColors } from '@/hooks/useThemedColors';
import { useUserService } from '@/hooks/useUserService';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { CountryPhonePicker } from '@/components/common/CountryPhonePicker';
import { UserSex } from '@/types/auth.types';
import { validateEmail, validatePhoneNumber } from '@/utils/validation';
import { profileStyles } from '@/styles';
import { formStyles, spacingStyles, typographyStyles } from '@/styles/base';
import { authFeatureStyles } from '@/styles/features/auth';

export const EditProfileScreen: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth();
  const colors = useThemedColors();
  const { updateProfile, isLoading } = useUserService();

  // Extract country code and phone number from user's phone
  const extractPhoneDetails = (fullPhone: string) => {
    // Common country codes
    const countryCodes = ['+234', '+1', '+44', '+91', '+86', '+81', '+33', '+49'];
    for (const code of countryCodes) {
      if (fullPhone?.startsWith(code)) {
        return {
          countryCode: code,
          phoneNumber: fullPhone.slice(code.length),
          country: code === '+234' ? 'Nigeria' : code === '+1' ? 'United States' : 'Other',
        };
      }
    }
    return { countryCode: '+234', phoneNumber: fullPhone || '', country: 'Nigeria' };
  };

  const phoneDetails = extractPhoneDetails(user?.phoneNumber || '');

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: phoneDetails.phoneNumber,
    countryCode: phoneDetails.countryCode,
    country: phoneDetails.country,
    sex: user?.sex || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
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

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(formData.countryCode + formData.phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    if (!formData.sex) {
      newErrors.sex = 'Please select your sex';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the errors before continuing',
      });
      return;
    }

    try {
      // Only send changed fields
      const changedFields: any = {};
      const emailChanged = formData.email !== user?.email;

      if (formData.firstName !== user?.firstName)
        changedFields.firstName = formData.firstName.trim();
      if (formData.lastName !== user?.lastName) changedFields.lastName = formData.lastName.trim();
      if (emailChanged) changedFields.email = formData.email.toLowerCase().trim();

      const newFullPhone = formData.countryCode + formData.phoneNumber;
      if (newFullPhone !== user?.phoneNumber) {
        changedFields.phoneNumber = newFullPhone;
      }

      if (formData.sex !== user?.sex) changedFields.sex = formData.sex;

      if (Object.keys(changedFields).length === 0) {
        Toast.show({
          type: 'info',
          text1: 'No Changes',
          text2: 'No changes were made to your profile',
        });
        router.back();
        return;
      }

      await updateProfile(changedFields);

      // If email was changed, navigate to verification screen
      if (emailChanged) {
        Toast.show({
          type: 'success',
          text1: 'Verification Required',
          text2: 'Please verify your new email address',
        });

        // Use Expo Router to navigate
        router.push({
          pathname: '/profile/verify-email-change',
          params: { email: formData.email.toLowerCase().trim() },
        });
        return;
      }

      // For other changes, show success and go back
      Toast.show({
        type: 'success',
        text1: 'Profile Updated',
        text2: 'Your profile has been successfully updated',
      });

      router.back();
    } catch (error: any) {
      console.error('Update profile error:', error);

      // Extract error message from various possible error structures
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to update profile';

      const statusCode = error?.response?.status || error?.response?.data?.statusCode;

      // Handle 409 Conflict errors (duplicate email/phone)
      if (statusCode === 409) {
        const lowerMessage = errorMessage.toLowerCase();

        if (lowerMessage.includes('email') && lowerMessage.includes('already in use')) {
          setErrors({ email: 'This email is already in use by another account' });
          Toast.show({
            type: 'error',
            text1: 'Email Already In Use',
            text2: 'This email is already registered to another account',
          });
          return;
        }

        if (lowerMessage.includes('phone') && lowerMessage.includes('already in use')) {
          setErrors({ phoneNumber: 'This phone number is already in use by another account' });
          Toast.show({
            type: 'error',
            text1: 'Phone Number Already In Use',
            text2: 'This phone number is already registered to another account',
          });
          return;
        }
      }

      // Handle other error types
      if (statusCode === 400) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Input',
          text2: errorMessage,
        });
      } else if (statusCode === 401 || statusCode === 403) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Please log in again to continue',
        });
        // Optionally: router.push('/(auth)/login');
      } else {
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: errorMessage,
        });
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={[profileStyles.container, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[profileStyles.section, { marginTop: 0 }]}>
          <Text style={[profileStyles.sectionTitle, { color: colors.text }]}>
            Personal Information
          </Text>

          {/* First Name */}
          <Input
            placeholder="First name"
            value={formData.firstName}
            onChangeText={text => updateField('firstName', text)}
            error={errors.firstName}
            leftIcon="person-outline"
          />

          {/* Last Name */}
          <Input
            placeholder="Last name"
            value={formData.lastName}
            onChangeText={text => updateField('lastName', text)}
            error={errors.lastName}
            leftIcon="person-outline"
          />

          {/* Email */}
          <Input
            placeholder="Email"
            value={formData.email}
            onChangeText={text => updateField('email', text)}
            error={errors.email}
            leftIcon="mail-outline"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {formData.email !== user?.email && !errors.email && (
            <Text
              style={[authFeatureStyles.instructionText, { color: colors.warning, marginTop: -12 }]}
            >
              Changing your email will require re-verification
            </Text>
          )}

          {/* Phone Number with Country Picker */}
          <CountryPhonePicker
            countryCode={formData.countryCode}
            phoneNumber={formData.phoneNumber}
            country={formData.country}
            onCountryChange={(code, country) => {
              updateField('countryCode', code);
              updateField('country', country);
            }}
            onPhoneChange={phone => updateField('phoneNumber', phone)}
            error={errors.phoneNumber}
          />

          {/* Gender */}
          <View style={spacingStyles.marginBottom20}>
            <Text style={formStyles.genderLabel}>Gender </Text>
            <View style={formStyles.genderContainer}>
              <TouchableOpacity
                style={[
                  formStyles.genderButton,
                  formData.sex === UserSex.MALE && formStyles.genderButtonActive,
                ]}
                onPress={() => updateField('sex', UserSex.MALE)}
              >
                <Text
                  style={[
                    formStyles.genderButtonText,
                    formData.sex === UserSex.MALE && formStyles.genderButtonTextActive,
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  formStyles.genderButton,
                  formData.sex === UserSex.FEMALE && formStyles.genderButtonActive,
                ]}
                onPress={() => updateField('sex', UserSex.FEMALE)}
              >
                <Text
                  style={[
                    formStyles.genderButtonText,
                    formData.sex === UserSex.FEMALE && formStyles.genderButtonTextActive,
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
            {errors.sex && <Text style={typographyStyles.errorText}>{errors.sex}</Text>}
          </View>
        </View>

        {/* Update Button */}
        <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 32 }}>
          <Button
            title="Update Profile"
            onPress={handleUpdate}
            loading={isLoading}
            disabled={isLoading}
          />

          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            disabled={isLoading}
            style={{ marginTop: 12 }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
