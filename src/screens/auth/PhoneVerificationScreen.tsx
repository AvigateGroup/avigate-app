// src/screens/auth/PhoneVerificationScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/types/navigation.types';
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

type PhoneVerificationScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'PhoneVerification'>;
type PhoneVerificationScreenRouteProp = RouteProp<AuthStackParamList, 'PhoneVerification'>;

export const PhoneVerificationScreen: React.FC = () => {
  const navigation = useNavigation<PhoneVerificationScreenNavigationProp>();
  const route = useRoute<PhoneVerificationScreenRouteProp>();
  const fromGoogleAuth = route.params?.fromGoogleAuth || false;

  const { user, updateUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+234');
  const [country, setCountry] = useState('Nigeria');
  const [sex, setSex] = useState<UserSex | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: string) => {
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
        // CRITICAL: Update user in context with the new data
        if (response.data.user) {
          await updateUser(response.data.user);
        }

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Phone number added successfully',
        });

        // Note: Navigation to main app will be handled automatically by AuthContext
        // when user state is updated. No manual navigation needed.
      }
    } catch (error: any) {
      console.error('Phone capture error:', error);

      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to update phone number';

      const statusCode = error?.response?.status || error?.response?.data?.statusCode;

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

        Toast.show({
          type: 'error',
          text1: 'Phone Number Conflict',
          text2: errorMessage,
          visibilityTime: 5000,
        });
        return;
      }

      if (statusCode === 400) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Phone Number',
          text2: errorMessage,
          visibilityTime: 5000,
        });
        return;
      }

      if (statusCode === 401 || statusCode === 403) {
        Toast.show({
          type: 'error',
          text1: 'Authentication Error',
          text2: 'Please log in again to continue',
          visibilityTime: 5000,
        });
        return;
      }

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

      // Note: Navigation to main app will be handled automatically by AuthContext
    }
  };

  return (
    <AuthLayout showLogo={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 40 }}>
            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: 32 }}>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: COLORS.text,
                  marginBottom: 8,
                  textAlign: 'center',
                }}
              >
                Add Phone Number
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: COLORS.textMuted,
                  textAlign: 'center',
                  lineHeight: 22,
                }}
              >
                Help us secure your account
              </Text>
            </View>

            {/* Phone Number Input */}
            <View style={{ marginBottom: 24 }}>
              <CountryPhonePicker
                countryCode={countryCode}
                phoneNumber={phoneNumber}
                country={country}
                onCountryChange={(code, countryName) => {
                  setCountryCode(code);
                  setCountry(countryName);
                  updateField('phoneNumber');
                }}
                onPhoneChange={phone => {
                  setPhoneNumber(phone);
                  updateField('phoneNumber');
                }}
                error={errors.phoneNumber}
              />
            </View>

            {/* Gender Selection - Simplified (Optional) */}
            <View style={{ marginBottom: 24 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: COLORS.text,
                  marginBottom: 12,
                }}
              >
                Gender
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 12,
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor: sex === UserSex.MALE ? COLORS.primary : COLORS.border,
                    backgroundColor: sex === UserSex.MALE ? `${COLORS.primary}10` : COLORS.white,
                    alignItems: 'center',
                  }}
                  onPress={() => setSex(UserSex.MALE)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: sex === UserSex.MALE ? COLORS.primary : COLORS.text,
                    }}
                  >
                    Male
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor: sex === UserSex.FEMALE ? COLORS.primary : COLORS.border,
                    backgroundColor: sex === UserSex.FEMALE ? `${COLORS.primary}10` : COLORS.white,
                    alignItems: 'center',
                  }}
                  onPress={() => setSex(UserSex.FEMALE)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: sex === UserSex.FEMALE ? COLORS.primary : COLORS.text,
                    }}
                  >
                    Female
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Continue Button */}
            <Button title="Continue" onPress={handleSubmit} loading={loading} disabled={loading} />

            {/* Security Note */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                paddingHorizontal: 16,
              }}
            >
              <Icon name="lock-closed-outline" size={14} color={COLORS.textMuted} />
              <Text
                style={{
                  fontSize: 13,
                  color: COLORS.textMuted,
                  marginLeft: 6,
                }}
              >
                Your phone number is kept private and secure
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthLayout>
  );
};