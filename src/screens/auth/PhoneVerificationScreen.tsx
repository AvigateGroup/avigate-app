// src/screens/auth/PhoneVerificationScreen.tsx

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/common/Button';
import { CountryPhonePicker } from '@/components/common/CountryPhonePicker';
import { authApi } from '@/api/auth.api';
import { validatePhoneNumber } from '@/utils/validation';
import { useAuth } from '@/store/AuthContext';
import { COLORS } from '@/constants/colors';
import { UserSex } from '@/types/auth.types';
import { authStyles } from '@/styles';
import { formStyles, spacingStyles } from '@/styles/base';

export const PhoneVerificationScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const fromGoogleAuth = params.fromGoogleAuth === 'true';

  const { user, updateUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [country, setCountry] = useState('Nigeria');
  const [sex, setSex] = useState<UserSex | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    delete newErrors[field];
    setErrors(newErrors);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!validatePhoneNumber(countryCode + phoneNumber)) {
      newErrors.phoneNumber = 'Invalid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please enter a valid phone number',
      });
      return;
    }

    setLoading(true);

    try {
      const fullPhoneNumber = countryCode + phoneNumber;
      const response = await authApi.capturePhone({
        phoneNumber: fullPhoneNumber,
        sex,
      });

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Phone number updated successfully',
        });

        // Update user in context
        if (response.data.user) {
          updateUser(response.data.user);
        }

        // Navigation will be handled by AuthContext
        // It will automatically redirect to main app
      }
    } catch (error: any) {
      console.error('Phone capture error:', error);

      // Extract error message from various possible error structures
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to update phone number';

      const statusCode = error?.response?.status || error?.response?.data?.statusCode;

      // Handle 409 Conflict errors (duplicate phone number)
      if (statusCode === 409) {
        const lowerMessage = errorMessage.toLowerCase();

        if (lowerMessage.includes('phone') && lowerMessage.includes('already in use')) {
          setErrors({ phoneNumber: 'This phone number is already in use by another account' });
          Toast.show({
            type: 'error',
            text1: 'Phone Number Already In Use',
            text2: 'This phone number is already registered to another account',
            visibilityTime: 6000,
          });
          return;
        }

        // Generic conflict error
        Toast.show({
          type: 'error',
          text1: 'Phone Number Conflict',
          text2: errorMessage,
          visibilityTime: 5000,
        });
        return;
      }

      // Handle validation errors (400)
      if (statusCode === 400) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Phone Number',
          text2: errorMessage,
          visibilityTime: 5000,
        });
        return;
      }

      // Handle authentication errors (401/403)
      if (statusCode === 401 || statusCode === 403) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Please log in again to continue',
          visibilityTime: 5000,
        });
        // Optionally sign out user
        return;
      }

      // Generic error fallback
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: errorMessage,
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    if (fromGoogleAuth) {
      Toast.show({
        type: 'info',
        text1: 'Skipped',
        text2: 'You can add your phone number later in settings',
      });
      // Navigation will be handled by AuthContext
      // The user will be redirected to main app
    }
  };

  return (
    <AuthLayout showLogo={false}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={authStyles.centeredContainer}>
          <View style={authStyles.iconContainer}>
            <View style={authStyles.iconCircle}>
              <Icon name="call-outline" size={40} color={COLORS.primary} />
            </View>
          </View>

          <Text style={authStyles.titleCentered}>Add Phone Number</Text>
          <Text style={authStyles.subtitleCentered}>
            Help us secure your account by adding your phone number
          </Text>

          <View style={authStyles.benefitsContainer}>
            <View style={authStyles.benefitItem}>
              <Icon name="shield-checkmark-outline" size={20} color={COLORS.primary} />
              <Text style={authStyles.benefitText}>Enhanced account security</Text>
            </View>
            <View style={authStyles.benefitItem}>
              <Icon name="notifications-outline" size={20} color={COLORS.primary} />
              <Text style={authStyles.benefitText}>Receive important notifications</Text>
            </View>
            <View style={authStyles.benefitItem}>
              <Icon name="person-outline" size={20} color={COLORS.primary} />
              <Text style={authStyles.benefitText}>Complete your profile</Text>
            </View>
          </View>

          <View style={authStyles.form}>
            {/* Phone Number with Country Picker */}
            <CountryPhonePicker
              countryCode={countryCode}
              phoneNumber={phoneNumber}
              country={country}
              onCountryChange={(code, countryName) => {
                setCountryCode(code);
                setCountry(countryName);
                updateField('phoneNumber', '');
              }}
              onPhoneChange={phone => {
                setPhoneNumber(phone);
                updateField('phoneNumber', '');
              }}
              error={errors.phoneNumber}
            />

            {/* Gender (Optional) */}
            <View style={spacingStyles.marginBottom20}>
              <Text style={formStyles.genderLabel}>Gender (Optional)</Text>
              <View style={formStyles.genderContainer}>
                <TouchableOpacity
                  style={[
                    formStyles.genderButton,
                    sex === UserSex.MALE && formStyles.genderButtonActive,
                  ]}
                  onPress={() => setSex(UserSex.MALE)}
                >
                  <Icon
                    name="male"
                    size={24}
                    color={sex === UserSex.MALE ? COLORS.textWhite : COLORS.text}
                  />
                  <Text
                    style={[
                      formStyles.genderButtonText,
                      sex === UserSex.MALE && formStyles.genderButtonTextActive,
                    ]}
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    formStyles.genderButton,
                    sex === UserSex.FEMALE && formStyles.genderButtonActive,
                  ]}
                  onPress={() => setSex(UserSex.FEMALE)}
                >
                  <Icon
                    name="female"
                    size={24}
                    color={sex === UserSex.FEMALE ? COLORS.textWhite : COLORS.text}
                  />
                  <Text
                    style={[
                      formStyles.genderButtonText,
                      sex === UserSex.FEMALE && formStyles.genderButtonTextActive,
                    ]}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Continue"
              onPress={handleSubmit}
              loading={loading}
              style={authStyles.submitButton}
            />

            {fromGoogleAuth && (
              <TouchableOpacity onPress={handleSkip} style={authStyles.skipButton}>
                <Text style={authStyles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={authStyles.footerWithIcon}>
            <Icon name="lock-closed-outline" size={16} color={COLORS.textMuted} />
            <Text style={authStyles.footerTextWithIcon}>
              Your phone number is kept private and secure
            </Text>
          </View>
        </View>
      </ScrollView>
    </AuthLayout>
  );
};